import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VBeeModule } from './vbee/vbee.module';
import { TtsController } from './controllers/tts.controller';
import { VoiceController } from './controllers/voice.controller';
import { SpeechRecognitionController } from './controllers/speech-recognition.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    VBeeModule,
  ],
  controllers: [
    AppController,
    TtsController,
    VoiceController,
    SpeechRecognitionController,
  ],
  providers: [AppService],
})
export class AppModule { }
