import { Module } from '@nestjs/common';
import { DateScalar } from './custom/date.scalar';

@Module({
  providers: [DateScalar],
})
export class CommonModule {}
