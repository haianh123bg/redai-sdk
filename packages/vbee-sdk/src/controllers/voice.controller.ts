import { Controller, Get, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import { VBeeService } from '../vbee/vbee.service';

interface VoiceFilters {
  language?: string;
  gender?: string;
  page?: number;
  pageSize?: number;
}

@Controller('voices')
export class VoiceController {
  constructor(private readonly vbeeService: VBeeService) { }

  @Get()
  async listVoices(@Query() filters: VoiceFilters) {
    try {
      const client = this.vbeeService.getClient();
      const result = await client.voice.list({
        language: filters.language,
        gender: filters.gender,
        page: filters.page ? parseInt(filters.page.toString()) : undefined,
        pageSize: filters.pageSize ? parseInt(filters.pageSize.toString()) : undefined,
      });

      return {
        success: true,
        data: result,
        message: 'Voice list retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve voice list',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async getVoiceById(@Param('id') id: string) {
    try {
      const client = this.vbeeService.getClient();
      const result = await client.voice.getById(id);

      return {
        success: true,
        data: result,
        message: 'Voice retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve voice',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('search/by-name')
  async searchVoicesByName(@Query('name') name: string) {
    try {
      if (!name) {
        throw new Error('Name parameter is required');
      }

      const client = this.vbeeService.getClient();
      const result = await client.voice.search(name);

      return {
        success: true,
        data: result,
        message: 'Voice search completed successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to search voices',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @Get('filter/by-language')
  // async filterByLanguage(@Query('language') language: string) {
  //   try {
  //     if (!language) {
  //       throw new Error('Language parameter is required');
  //     }

  //     const client = this.vbeeService.getClient();
  //     const result = await client.voice.filterByLanguage(language);

  //     return {
  //       success: true,
  //       data: result,
  //       message: 'Voices filtered by language successfully',
  //     };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         success: false,
  //         message: 'Failed to filter voices by language',
  //         error: error.message,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  @Get('health/check')
  health() {
    return {
      success: true,
      message: 'Voice service is running',
      timestamp: new Date().toISOString(),
    };
  }
}
