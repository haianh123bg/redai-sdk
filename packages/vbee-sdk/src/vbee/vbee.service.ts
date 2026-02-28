import { Injectable } from '@nestjs/common';
import { VBeeClient } from 'vbee-sdk';

@Injectable()
export class VBeeService {
	private client: VBeeClient;

	constructor() {
		// Initialize VBee SDK client
		// API key should be set in environment variable or .env file
		const apiKey = process.env.VBEE_API_KEY || 'your-api-key-here';
		const baseURL = process.env.VBEE_BASE_URL || 'https://api.vbee.vn';

		this.client = new VBeeClient({
			apiKey,
			baseURL,
			timeout: 30000,
			debug: true,
		});
	}

	getClient(): VBeeClient {
		return this.client;
	}
	
}
