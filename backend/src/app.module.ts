import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MusicModule } from './music/musics.module';
import * as Config from 'config';
import { AlbumModule } from './album/albums.module';

@Module({
  imports: [
    MusicModule,
    AlbumModule,
    MongooseModule.forRoot(Config.get<string>('mongodb.uri')),
  ],
})
export class AppModule {}
