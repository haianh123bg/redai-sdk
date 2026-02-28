import {
	Controller,
	Post,
	Body,
	UploadedFile,
	UseInterceptors,
	HttpException,
	HttpStatus,
	Get
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VBeeService } from '../vbee/vbee.service';
import type { Express } from 'express';
import { AudioFormat } from '../../../../dist';

interface TranscribeRequestDto {
	language?: string;
	format?: AudioFormat;
}

interface TranscribeUrlDto {
	audioUrl: string;
	language?: string;
}

@Controller('speech-recognition')
export class SpeechRecognitionController {
	constructor(private readonly vbeeService: VBeeService) { }

	@Post('transcribe')
	@UseInterceptors(FileInterceptor('audio'))
	async transcribe(
		@UploadedFile() file: Express.Multer.File,
		@Body() body: TranscribeRequestDto,
	) {
		try {
			if (!file) {
				throw new Error('Audio file is required');
			}

			const client = this.vbeeService.getClient();
			const result = await client.speechRecognition.transcribe({
				audioFile: file.buffer,
				language: body.language,
				format: body.format,
			});

			return {
				success: true,
				data: result,
				message: 'Audio transcribed successfully',
			};
		} catch (error) {
			throw new HttpException(
				{
					success: false,
					message: 'Failed to transcribe audio',
					error: error.message,
				},
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Post('transcribe-from-url')
	async transcribeFromUrl(@Body() body: TranscribeUrlDto) {
		try {
			if (!body.audioUrl) {
				throw new Error('Audio URL is required');
			}

			const client = this.vbeeService.getClient();
			const result = await client.speechRecognition.transcribeFromUrl(
				body.audioUrl,
				body.language,
			);

			return {
				success: true,
				data: result,
				message: 'Audio transcribed from URL successfully',
			};
		} catch (error) {
			throw new HttpException(
				{
					success: false,
					message: 'Failed to transcribe audio from URL',
					error: error.message,
				},
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Get('health')
	health() {
		return {
			success: true,
			message: 'Speech Recognition service is running',
			timestamp: new Date().toISOString(),
		};
	}
}
