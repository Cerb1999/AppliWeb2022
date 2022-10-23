import { Module, Logger } from '@nestjs/common';
import { AlbumController } from './albums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumDao } from './dao/album.dao';
import { AlbumSchema, Album } from './schemas/album.schema';
import { AlbumService, } from './albums.service';
import { MusicService } from 'src/music/musics.service';
import { MusicDao } from 'src/music/dao/music.dao';
import { Music, MusicSchema } from 'src/music/schemas/music.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    MongooseModule.forFeature([{ name: Music.name, schema: MusicSchema}])
  ],
  controllers: [AlbumController],
  providers: [AlbumService, Logger, AlbumDao, MusicService, MusicDao],
})
export class AlbumModule {}
