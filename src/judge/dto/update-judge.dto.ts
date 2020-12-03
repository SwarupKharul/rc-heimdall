import { IsEnum, IsNumber, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { CodeStates } from '../enum/codeStates.enum';

/**
 * **Update Judge Submission DTO**
 *
 * [[UpdateJudgeDto]] is responsible for handling input and validating the same
 * while updating a submission. This is provisioned to manually edit the tally
 * records in case of any discrepancy in automatic evaluation.
 *
 * @category Judge
 */
export class UpdateJudgeDto {
  @IsUUID()
  @ApiProperty({ description: 'ID of judge processing being updated' })
  judgeSubmissionID: number;

  @IsEnum(CodeStates)
  @ApiProperty({ description: 'New Code state of the submission' })
  state: CodeStates;

  @IsNumber()
  @ApiProperty({ description: 'Points to set for submission' })
  points: number;
}
