import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VBeeService } from './vbee.service';

@Module({
	imports: [ConfigModule],
	providers: [VBeeService],
	exports: [VBeeService],
})
export class VBeeModule { }
