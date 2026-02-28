import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { VBeeService } from '../vbee/vbee.service';
import { AudioFormat } from '../../../../dist';

interface TTSRequestDto {
	text: string;
	voiceId: string;
	speed?: number;
	format?: AudioFormat;
	language?: string;
	sampleRate?: number;
}

@Controller('tts')
export class TtsController {
	constructor(private readonly vbeeService: VBeeService) { }

	@Post('synthesize')
	async synthesize(@Body() request: TTSRequestDto) {
		try {
			const client = this.vbeeService.getClient();
			const result = await client.tts.synthesize(request);

			return {
				success: true,
				data: result,
				message: 'Text-to-speech synthesis completed successfully',
			};
		} catch (error) {
			throw new HttpException(
				{
					success: false,
					message: 'Failed to synthesize speech',
					error: error.message,
				},
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Post('synthesize-to-file')
	async synthesizeToFile(@Body() body: TTSRequestDto & { outputPath: string }) {
		try {
			const client = this.vbeeService.getClient();
			const { outputPath, ...request } = body;
			const result = await client.tts.synthesize(body)
			return {
				success: true,
				data: result,
				message: 'Audio saved to file successfully',
			};
		} catch (error) {
			throw new HttpException(
				{
					success: false,
					message: 'Failed to save audio to file',
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
			message: 'TTS service is running',
			timestamp: new Date().toISOString(),
		};
	}
}
