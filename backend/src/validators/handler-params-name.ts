import { IsMongoId, IsNotEmpty } from 'class-validator';

export class HandlerParamsN {
  @IsNotEmpty()
  name: string;
}
