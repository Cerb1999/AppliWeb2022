import { Module, Logger } from '@nestjs/common';
import { MusicController } from './musics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MusicDao } from './dao/music.dao';
import { MusicSchema, Music } from './schemas/music.schema';
import { MusicService } from './musics.service';
import { Album, AlbumSchema } from 'src/album/schemas/album.schema';
import { AlbumModule } from 'src/album/albums.module';
import { MusicEntity } from './entities/music.entity';
import { forwardRef } from '@nestjs/common/utils';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Music.name, schema: MusicSchema}]),
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema}]),
    forwardRef(() => AlbumModule),
  ],
  controllers: [MusicController],
  providers: [MusicService, Logger, MusicDao],
  exports: [MusicService, MusicDao]
})
export class MusicModule {}
