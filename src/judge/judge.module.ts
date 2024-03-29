import { HttpModule, Module } from '@nestjs/common';

import { JudgeController } from './judge.controller';
import { JudgeRepository } from './judge.repository';
import { JudgeService } from './judge.service';
import { ProblemsModule } from '../problems/problems.module';
import { TeamsModule } from '../teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCaseModule } from 'src/testCase/testCase.module';

/**
 * **Judge Module**
 *
 * Module to handle all operations related to Judge Entity
 *
 * @category Judge
 */
@Module({
  imports: [TypeOrmModule.forFeature([JudgeRepository]), HttpModule, ProblemsModule, TeamsModule, TestCaseModule],
  controllers: [JudgeController],
  providers: [JudgeService],
  exports: [JudgeService],
})
export class JudgeModule {}
