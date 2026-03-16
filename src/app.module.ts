import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { InterviewModule } from "./interview/interview.module";
import { User } from "./users/user.entity";
import { InterviewSession } from "./interview/interview-session.entity";
import { Question } from "./interview/question.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("DATABASE_HOST"),
        port: config.get<number>("DATABASE_PORT"),
        username: config.get("DATABASE_USER"),
        password: config.get("DATABASE_PASSWORD"),
        database: config.get("DATABASE_NAME"),
        entities: [User, InterviewSession, Question],
        synchronize: true, // auto-create tables in dev
      }),
    }),
    AuthModule,
    InterviewModule,
  ],
})
export class AppModule {}
