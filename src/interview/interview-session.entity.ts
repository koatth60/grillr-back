import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Question } from "./question.entity";

@Entity("interview_sessions")
export class InterviewSession {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  jobTitle: string;

  @Column("text")
  jobDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Question, (q) => q.session, { cascade: true })
  questions: Question[];
}
