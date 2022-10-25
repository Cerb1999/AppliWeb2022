import { Module, Logger } from '@nestjs/common';
import { AlbumController } from './albums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumDao } from './dao/album.dao';
import { AlbumSchema, Album } from './schemas/album.schema';
import { AlbumService, } from './albums.service';
import { Music, MusicSchema } from 'src/music/schemas/music.schema';
import { AlbumEntity } from './entities/album.entity';
import { MusicModule } from 'src/music/musics.module';
import { forwardRef } from '@nestjs/common/utils';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    MongooseModule.forFeature([{ name: Music.name, schema: MusicSchema }]),
    forwardRef(() => MusicModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumService, Logger, AlbumDao],
  exports:[AlbumService, AlbumDao]
})
export class AlbumModule {}
