import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, merge, mergeMap, Observable, tap } from 'rxjs';
import { AlbumService } from '../shared/services/albums.service';
import { MusicService } from '../shared/services/musics.service';
import { Album } from '../shared/types/albums.types';
import { Music } from '../shared/types/musics.types';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  private _album: Album;
  private _isAlbum: Boolean;
  _musics: Music[] = [];

  constructor(private _router: Router, private _musicService: MusicService, private _albumService: AlbumService, private _route: ActivatedRoute) {
    this._album = {} as Album;
    this._isAlbum = false;
  }

  ngOnInit(): void {
    merge(
      this._route.params.pipe(
        filter((params: any) => !!params.id),
        mergeMap((params: any) => this._albumService.fetchOne(params.id)),
        tap(() => this._isAlbum = true)
      ),
      this._route.params.pipe(
        filter((params: any) => !params.id),
        mergeMap(() => this._albumService.fetchRandom()),
        tap(() => this._isAlbum = false)
      )
    )
      .subscribe({
        next: (album: Album) => this._album = album,
        error: () => {
          this._isAlbum = false;
        }
      });


    merge(
      this._route.params.pipe(
        filter((params: any) => !!params.name),
        mergeMap((params: any) => this._musicService.fetchByAlbum(params.name))
      
      )
    )
      .subscribe({
        next: (musics: Music[]) => this._musics = musics,
       
      });
  }

  get musics(): Music[] {
    return this._musics;
  }

  get isAlbum(): Boolean {
    return this.isAlbum;
  }

  get album(): Album {
    return this._album;
  }

  fetch(): void {
    this._musicService
      .fetch()
      .subscribe({
        next: (musics: Music[]) => this._musics = musics
      });
  }

  fetchByAlbum(name: string): void {
    this._musicService
      .fetchByAlbum(name)
      .subscribe({
        next: (musics: Music[]) => this._musics = musics
      });
  }

  fetchByAlbumId(id: string): void {
    this._musicService
      .fetchByAlbumId(id)
      .subscribe({
        next: (musics: Music[]) => this._musics = musics
      });
  }

  random(): void {
    this._albumService
    .fetchRandom()
    .subscribe({
      next: (album: Album) => this._album});
  }
  
  update(album : Album): Observable<Album> {
    return this._albumService.update(album);
  }
}

