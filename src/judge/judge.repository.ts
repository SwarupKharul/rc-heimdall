import { EntityRepository, Repository } from 'typeorm';

import { JudgeSubmissions } from './judge.entity';

/**
 * **Judge Repository**
 *
 * This is the data persistence layer and is responsible for database related operations.
 *
 * @category Judge
 */
@EntityRepository(JudgeSubmissions)
export class JudgeRepository extends Repository<JudgeSubmissions> {
  /** to fetch highest points scored by team on given problem */
  async getHighestPointsFor(problemID: string, teamID: number) {
    const query = await this.createQueryBuilder('submission')
      .leftJoinAndSelect('submission.problem', 'problem')
      .select('MAX(submission.points)', 'points')
      .andWhere('submission.teamId = :team', { team: teamID })
      .andWhere('submission.problemId = :problem', { problem: problemID })
      .getRawOne();

    return query;
  }

  /** to fetch selected details of submission for client / participant */
  async findOneForClientByJudge0Token(token: string) {
    const query = await this.createQueryBuilder('submission')
      .select('submission.id')
      .addSelect('submission.language')
      .addSelect('submission.state')
      .addSelect('submission.points')
      .addSelect('submission.judge0ID')
      .andWhere('submission.judge0ID = :token', { token })
      .getOne();

    return query;
  }

  /** To fetch details of judgesubmissions from team */
  async findByTeam(team_id) {
    // show status for each testcase and problemID only
    const query = await this.createQueryBuilder('submission')
      .leftJoinAndSelect('submission.problem', 'problem')
      .groupBy('submission.problemId')
      .select('MAX(submission.points)', 'points')
      .andWhere('submission.team = :team_id', { team_id })
      .getMany();
    return query;
  }

  /** To fetch details by team and ID */
  async findOneByTeamAndID(id, team_id) {
    const query = await this.createQueryBuilder('submission')
      .andWhere('submission.id = :id', { id })
      .andWhere('submission.team = :team_id', { team_id })
      .leftJoinAndSelect('submission.testCase', 'testcase')
      .getOne();
    return query;
  }
}
