import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InterviewService } from "./interview.service";
import { InterviewController } from "./interview.controller";
import { InterviewSession } from "./interview-session.entity";
import { Question } from "./question.entity";

@Module({
  imports: [TypeOrmModule.forFeature([InterviewSession, Question])],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
