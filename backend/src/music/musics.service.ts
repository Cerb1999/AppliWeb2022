import {
  ConflictException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
  } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import {
  catchError,
    defaultIfEmpty,
    filter,
    map,
    mergeMap,
    tap,
} from 'rxjs/operators';
import { MusicEntity } from './entities/music.entity';
import { MusicDao } from './dao/music.dao';
import { Music } from './musics.types';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { AlbumEntity } from 'src/album/entities/album.entity';

  @Injectable()
  export class MusicService {
    private _musics: Music[];

    constructor(private readonly _musicDao: MusicDao) {};

    findAll = (): Observable<MusicEntity[] | void> =>
      this._musicDao.find().pipe(
        filter(Boolean),
        map((musics) => (musics || []).map((music) => new MusicEntity(music))),
        defaultIfEmpty(undefined),
      );

    findOne = (id: string): Observable<MusicEntity> =>
      this._musicDao.findById(id).pipe(
        catchError((e) =>
          throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((music) =>
          !!music
            ? of(new MusicEntity(music))
            : throwError(
                () => new NotFoundException(`Music with id '${id}' not found`),
            ),
      ),
    );

    findAllByAlbumId = (id: string): Observable<MusicEntity[] | void> =>
    this._musicDao.findByAlbumId(id).pipe(
        filter(Boolean),
        map((album) => (album || []).map((music) => new MusicEntity(music))),
        defaultIfEmpty(undefined),
    );

    findRandomNoAlbum = (): Observable<MusicEntity | void> =>
      this._musicDao.find().pipe(
        filter((music) => !!music && !!music.length),
        map((music) => music[Math.round(Math.random() * music.length)]),
        map((music) => new MusicEntity(music)),
        defaultIfEmpty(undefined),
    );

    findRandomByAlbumId = (id: string): Observable<MusicEntity | void> =>
      this._musicDao.findByAlbumId(id).pipe(
        filter((music) => !!music && !!music.length),
        map((music) => music[Math.round(Math.random() * music.length)]),
        map((music) => new MusicEntity(music)),
        defaultIfEmpty(undefined),
    );

    private _prepareNewMusic = (
      music: CreateMusicDto,
    ): Observable<CreateMusicDto> =>
      of({
        ...music,
        addedToApiDate: Date.now(),
      });

    create = (music: CreateMusicDto): Observable<MusicEntity> =>
      this._prepareNewMusic(music).pipe(
        mergeMap((newPreparedMusic: CreateMusicDto) =>
          this._musicDao.save(newPreparedMusic),
        ),
        catchError((e) =>
          e.code === 11000
            ? throwError(
                () =>
                  new ConflictException(
                    `Music with name '${music.name}' already exists`,
                  ),
              )
            : throwError(() => new UnprocessableEntityException(e.message)),
        ),
        map((musicCreated) => new MusicEntity(musicCreated)),
      );



    delete = (id: string): Observable<void> =>
      this._musicDao.findByIdAndRemove(id).pipe(
        catchError((e) =>
          throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((musicDeleted) =>
          !!musicDeleted
            ? of(undefined)
            : throwError(
                () => new NotFoundException(`music with id '${id}' not found`),
              ),
        ),
    );

    
    deleteAlbumInMusicsByName = (name: string): Observable<void> =>
      this._musicDao.findAlbumsByNameAndRemove(name).pipe(
        catchError((e) =>
          throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((albumDeleted) =>
          !!albumDeleted
            ? of(undefined)
            : throwError(
                () => new NotFoundException(`album with name '${name}' not found`),
              ),
        ),
    );

    update = (id: string, music: UpdateMusicDto): Observable<MusicEntity> =>
      this._musicDao.findByIdAndUpdate(id, music).pipe(
        catchError((e) =>
          e.code === 11000
            ? throwError(
                () =>
                  new ConflictException(
                    `Album with name '${music.name}'`,
                  ),
              )
            : throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((musicUpdated) =>
          !!musicUpdated
            ? of(new MusicEntity(musicUpdated))
            : throwError(
                () => new NotFoundException(`Music with id '${id}' not found`),
              ),
        ),
    );


  updateAlbumInMusicsByName = (oldName: string, newName: string): Observable<AlbumEntity> =>
    this._musicDao.findAlbumsByNameAndUpdate(oldName, newName).pipe(
      tap(() => Logger.log(oldName + " " + newName)),
      catchError((e) =>
        e.code === 11000
          ? throwError(
              () =>
                new ConflictException(
                  `Album`,
                ),
            )
          : throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((albumInMusicUpdated) =>
        !!albumInMusicUpdated
          ? of(new AlbumEntity(undefined))
          : throwError(
              () => new NotFoundException(`Music not found`),
            ),
      ),
  );
  }
  