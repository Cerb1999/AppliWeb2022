import { Module, Logger } from '@nestjs/common';
import { MusicController } from './musics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MusicDao } from './dao/music.dao';
import { MusicSchema, Music } from './schemas/music.schema';
import { MusicService } from './musics.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Music.name, schema: MusicSchema }]),
  ],
  controllers: [MusicController],
  providers: [MusicService, Logger, MusicDao],
})
export class MusicModule {}
