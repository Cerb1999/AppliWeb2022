import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { from, map, Observable } from 'rxjs';
import { Music } from 'src/music/musics.types';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';
import { AlbumEntity } from '../entities/album.entity';
import { Album } from '../schemas/album.schema';

@Injectable()
export class AlbumDao {
  constructor(
    @InjectModel(Album.name)
    private readonly _albumModel: Model<Album>,
  ) {}

  find = (): Observable<Album[]> =>
    from(this._albumModel.find({}).lean()).pipe(map((music) => [].concat(music)));

  findOne = (name: string): Observable<Album | void> =>
    from(this._albumModel.findOne({'name': name}).lean());

  findById = (id: string): Observable<Album | void> =>
    from(this._albumModel.findById(id).lean());

  save = (album: CreateAlbumDto): Observable<Album> =>
    from(new this._albumModel(album).save());


  findByIdAndUpdate = (
    id: string,
    album: UpdateAlbumDto,
  ): Observable<Album | void> =>
    from(
      this._albumModel.findByIdAndUpdate(id, album, {
        new: true,
        runValidators: true,
      }),
    );

  findByNameAndUpdate = (
    name: string,
    album: UpdateAlbumDto,
  ): Observable<Album | void> =>
    from(
      this._albumModel.findOneAndUpdate({'name': name}, album, {
        new: true,
        runValidators: true,
      }),
    );

  findByIdAndRemove = (id: string): Observable<Album | Music | void> =>
    from(this._albumModel.findByIdAndRemove(id));

  findByNameAndRemove = (name: string): Observable<Album | Music | void> =>
    from(this._albumModel.findOneAndRemove({'name':name}));
}
