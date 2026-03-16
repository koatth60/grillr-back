import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { InterviewSession } from "./interview-session.entity";

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  text: string;

  @Column()
  order: number;

  @Column({ nullable: true, type: "text" })
  answer: string;

  @Column({ nullable: true, type: "text" })
  feedback: string;

  @Column({ nullable: true })
  score: number;

  @ManyToOne(() => InterviewSession, (s) => s.questions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "sessionId" })
  session: InterviewSession;

  @Column()
  sessionId: string;
}
