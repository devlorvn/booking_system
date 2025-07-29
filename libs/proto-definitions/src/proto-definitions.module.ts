import { Module } from '@nestjs/common';
import { ProtoDefinitionsService } from './proto-definitions.service';

@Module({
  providers: [ProtoDefinitionsService],
  exports: [ProtoDefinitionsService],
})
export class ProtoDefinitionsModule {}
