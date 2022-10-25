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
import { AlbumService } from 'src/album/albums.service';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';

  @Injectable()
  export class MusicService {
    private _musics: Music[];

    constructor(
      private readonly _musicDao: MusicDao,
      @Inject(forwardRef(() => AlbumService)) 
      private readonly _albumService: AlbumService) {};

    findAll = (): Observable<MusicEntity[] | void> =>
      this._musicDao.find().pipe(
        filter(Boolean),
        map((musics) => (musics || []).map((music) => new MusicEntity(music))),
        defaultIfEmpty(undefined),
      );

    findOne = (name: string): Observable<MusicEntity> =>
      this._musicDao.findOne(name).pipe(
        catchError((e) =>
          throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((music) =>
          !!music
            ? of(new MusicEntity(music))
            : throwError(
                () => new NotFoundException(`Music with name '${name}' not found`),
            ),
        ),
      );

    findById = (id: string): Observable<MusicEntity> =>
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

    findAllByAlbumName = (name: string): Observable<MusicEntity[] | void> =>
      this._musicDao.findByAlbumName(name).pipe(
          filter(Boolean),
          map((musics) => (musics || []).map((music) => new MusicEntity(music))),
          defaultIfEmpty(undefined),
    );

    findAllByAlbumId = (id: string): Observable<MusicEntity[] | void> =>
        this._albumService.findById(id).pipe(
          mergeMap((album) =>
            !!album
              ? this.findAllByAlbumName(album.id)
              : throwError(
                  () => new NotFoundException(`Musics with album id '${id}' not found`),
              ),
          ),
        );

    findAllByAlbum = (name: string): Observable<MusicEntity[] | void> =>
        this._albumService.findOne(name).pipe(
          mergeMap((album) =>
            !!album
              ? this.findAllByAlbumName(album.name)
              : throwError(
                  () => new NotFoundException(`Musics with album name '${name}' not found`),
              ),
          ),
        );

    findRandomNoAlbum = (): Observable<MusicEntity | void> =>
      this._musicDao.find().pipe(
        filter((music) => !!music && !!music.length),
        map((music) => music[Math.round(Math.random() * music.length)]),
        map((music) => new MusicEntity(music)),
        defaultIfEmpty(undefined),
    );

    findRandomByAlbumName = (name: string): Observable<MusicEntity | void> =>
      this._musicDao.findByAlbumName(name).pipe(
        filter((music) => !!music && !!music.length),
        map((music) => music[Math.round(Math.random() * music.length)]),
        map((music) => new MusicEntity(music)),
        defaultIfEmpty(undefined),
  );

    findRandomByAlbumId = (id: string): Observable<MusicEntity | void> =>
      this._albumService.findOne(id).pipe(
        mergeMap((album) =>
          !!album
            ? this.findRandomByAlbumName(album.name)
            : throwError(
                () => new NotFoundException(`Musics with album id '${id}' not found`),
            ),
        ),
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



    deleteById = (id: string): Observable<void> =>
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

  delete = (name: string): Observable<void> =>
    this._musicDao.findByNameAndRemove(name).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((musicDeleted) =>
        !!musicDeleted
          ? of(undefined)
          : throwError(
              () => new NotFoundException(`music with name '${name}' not found`),
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

  
    updateById = (id: string, music: UpdateMusicDto): Observable<MusicEntity> =>
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

  update = (name: string, music: UpdateMusicDto): Observable<MusicEntity> =>
    this._musicDao.findByNameAndUpdate(name, music).pipe(
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
              () => new NotFoundException(`Music with name '${name}' not found`),
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
  