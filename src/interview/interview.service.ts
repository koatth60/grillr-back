import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Anthropic from "@anthropic-ai/sdk";
import { InterviewSession } from "./interview-session.entity";
import { Question } from "./question.entity";

@Injectable()
export class InterviewService {
  private claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  constructor(
    @InjectRepository(InterviewSession)
    private sessionRepo: Repository<InterviewSession>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>
  ) {}

  async createSession(userId: string, jobTitle: string, jobDescription: string) {
    // Ask Claude for 5 tailored questions
    const msg = await this.claude.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an expert technical interviewer. Generate exactly 5 tailored interview questions for this role. Mix behavioral, technical, and situational.

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Respond ONLY with a valid JSON array of 5 strings.`,
        },
      ],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "[]";
    const questionTexts: string[] = JSON.parse(text);

    const session = this.sessionRepo.create({ userId, jobTitle, jobDescription });
    await this.sessionRepo.save(session);

    const questions = questionTexts.map((text, i) =>
      this.questionRepo.create({ text, order: i + 1, sessionId: session.id })
    );
    await this.questionRepo.save(questions);

    return this.sessionRepo.findOne({
      where: { id: session.id },
      relations: ["questions"],
    });
  }

  async getUserSessions(userId: string) {
    return this.sessionRepo.find({
      where: { userId },
      relations: ["questions"],
      order: { createdAt: "DESC" },
    });
  }

  async submitAnswer(questionId: string, userId: string, answer: string) {
    const question = await this.questionRepo.findOne({
      where: { id: questionId },
      relations: ["session"],
    });

    if (!question) throw new NotFoundException("Question not found");
    if (question.session.userId !== userId) throw new ForbiddenException();

    // Ask Claude to evaluate the answer
    const msg = await this.claude.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `You are an expert interviewer. Evaluate this candidate answer.

Question: ${question.text}
Answer: ${answer}

Give concise feedback (2-3 sentences) and a score from 1 to 10. Respond ONLY with valid JSON:
{"feedback": "Your feedback here.", "score": 7}`,
        },
      ],
    });

    const text =
      msg.content[0].type === "text"
        ? msg.content[0].text
        : '{"feedback":"Could not evaluate.","score":5}';
    const { feedback, score } = JSON.parse(text);

    question.answer = answer;
    question.feedback = feedback;
    question.score = score;
    return this.questionRepo.save(question);
  }
}
