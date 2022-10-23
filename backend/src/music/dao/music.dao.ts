import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { from, map, ObjectUnsubscribedError, Observable, tap } from 'rxjs';
import { MusicEntity } from '../entities/music.entity';
import { Music } from '../schemas/music.schema';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CreateMusicDto } from '../dto/create-music.dto';
import { UpdateMusicDto } from '../dto/update-music.dto';
import { Album } from 'src/album/albums.types';


@Injectable()
export class MusicDao {
  constructor(
    @InjectModel(Music.name)
    private readonly _musicModel: Model<Music>,
  ) {}

  find = (): Observable<Music[]> =>
  from(this._musicModel.find({}).sort({addedToApiDate: -1}).lean()).pipe(map((music) => [].concat(music)));

  findByAlbumId = (id: string): Observable<Music[]> =>
    from(this._musicModel.find({'albums.id': new mongoose.Types.ObjectId(id)}, { 'albums._id': 0}).sort({addedToApiDate: -1}).lean()).pipe(map((music) => [].concat(music)));

  findById = (id: string): Observable<Music | void> =>
    from(this._musicModel.findById(id).lean());

  save = (music: CreateMusicDto): Observable<Music> =>
    from(new this._musicModel(music).save());

  findByIdAndUpdate = (
    id: string,
    music: UpdateMusicDto,
  ): Observable<Music | void> =>
    from(
      this._musicModel.findByIdAndUpdate(id, music, {
        new: true,
        runValidators: true,
      }),
    );

  findByIdAndRemove = (id: string): Observable<Music | void> =>
    from(this._musicModel.findByIdAndRemove(id));

  findAlbumsByNameAndRemove = (name: string): Observable< any | void> =>
    from(this._musicModel.updateMany({},
      {$pull: {
        'albums': {
          'name': name
        }
      }}
    ))

  findAlbumsByNameAndUpdate = (oldName: string, newName: string): Observable< any | void> =>
    from(this._musicModel.updateMany(
      {"albums.name": oldName},
      {$set: {'albums.$.name': newName}}
  ))
}