import { Controller, Post, Get, Body, Param, UseGuards, Request } from "@nestjs/common";
import { InterviewService } from "./interview.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("interview")
@UseGuards(JwtAuthGuard)
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post("sessions")
  createSession(
    @Request() req: any,
    @Body() body: { jobTitle: string; jobDescription: string }
  ) {
    return this.interviewService.createSession(
      req.user.id,
      body.jobTitle,
      body.jobDescription
    );
  }

  @Get("sessions")
  getSessions(@Request() req: any) {
    return this.interviewService.getUserSessions(req.user.id);
  }

  @Post("questions/:id/answer")
  submitAnswer(
    @Param("id") id: string,
    @Request() req: any,
    @Body() body: { answer: string }
  ) {
    return this.interviewService.submitAnswer(id, req.user.id, body.answer);
  }
}
