import {
  ConflictException,
    Injectable, NotFoundException, UnprocessableEntityException,
  } from '@nestjs/common';
import { find, findIndex, from, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  defaultIfEmpty,
  filter,
  map,
  tap,
  mergeMap,
} from 'rxjs/operators';
import { AlbumEntity } from './entities/album.entity';
import { AlbumDao } from './dao/album.dao';
import { Album } from './albums.types'
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { MusicService } from 'src/music/musics.service';
import { Music } from 'src/music/musics.types';
import { Logger, ValidationPipe } from '@nestjs/common';

  @Injectable()
  export class AlbumService {
    private _albums: Album[];

    constructor(private readonly _albumDao: AlbumDao, private readonly _musicService: MusicService) {}

    findAll = (): Observable<AlbumEntity[] | void> =>
      this._albumDao.find().pipe(
        filter(Boolean),
        map((albums) => (albums || []).map((album) => new AlbumEntity(album))),
        defaultIfEmpty(undefined),
      );

    findOne = (id: string): Observable<AlbumEntity> =>
      this._albumDao.findById(id).pipe(
        catchError((e) => 
          throwError(() => new UnprocessableEntityException(e.message)),
          ),
          mergeMap((album) =>
            !!album
              ? of(new AlbumEntity(album))
              : throwError(
                () => new NotFoundException(`Album with id '${id}' not found`),
                ),
          ),
      );

    findRandom = (): Observable<AlbumEntity | void> =>
      this._albumDao.find().pipe(
        filter((album) => !!album && !!album.length),
        map((album) => album[Math.round(Math.random() * album.length)]),
        map((album) => new AlbumEntity(album)),
        defaultIfEmpty(undefined),
      );

    private _prepareNewAlbum = (
      album: CreateAlbumDto,
    ): Observable<CreateAlbumDto> =>
      of({
        ...album,
      });

    create = (album: CreateAlbumDto): Observable<AlbumEntity> =>
      this._prepareNewAlbum(album).pipe(
        mergeMap((newPreparedMusic: CreateAlbumDto) =>
          this._albumDao.save(newPreparedMusic),
        ),
        catchError((e) =>
          e.code === 11000
            ? throwError(
                () =>
                  new ConflictException(
                    `Album with name '${album.name}' already exists`,
                  ),
              )
            : throwError(() => new UnprocessableEntityException(e.message)),
        ),
        map((albumCreated) => new AlbumEntity(albumCreated)),
      );



    delete = (id: string): Observable<void> =>
      this._albumDao.findByIdAndRemove(id).pipe(
        catchError((e) =>
          throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((albumDeleted) =>
          !!albumDeleted
            ? this._musicService.deleteAlbumInMusicsByName(albumDeleted.name)
            : throwError(
                () => new NotFoundException(`Album with id '${id}' not found`),
              ),
        ),
      );

    update = (id: string, old: string, album: UpdateAlbumDto): Observable<AlbumEntity> =>
      this._albumDao.findById(id).pipe(
        catchError((e) => 
          throwError(() => new UnprocessableEntityException(e.message)),
          ),
          mergeMap((old) =>
            !!old
              ? this._albumDao.findByIdAndUpdate(id, album).pipe(
                 catchError((e) =>
                  e.code === 11000
                    ? throwError(
                        () =>
                          new ConflictException(
                            `Album with name '${album.name}'`,
                          ),
                      )
                    : throwError(() => new UnprocessableEntityException(e.message)),
                  ),
                  mergeMap((albumUpdated) =>
                  !!albumUpdated
                    ? this._musicService.updateAlbumInMusicsByName(new AlbumEntity(old).name, albumUpdated.name)
                    : throwError(
                        () => new NotFoundException(`Album with name '${id}' not found`),
                      ),
                ),
                )
              : throwError(
                () => new NotFoundException(`Album with id '${id}' not found`),
                ),
          ),
      )
  }
  