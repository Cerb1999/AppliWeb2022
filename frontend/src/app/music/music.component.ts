import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, merge, mergeMap, Observable, tap } from 'rxjs';
import { MusicService } from '../shared/services/musics.service';
import { Music } from '../shared/types/musics.types';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})

export class MusicComponent implements OnInit {
  //musicName: string = "";
  audio: any;
  //private readonly _delete$: EventEmitter<MusicComponent>;

  private _music: Music;
  private _isMusic: Boolean;
  
  constructor(private _router: Router, private _musicService: MusicService, private _route: ActivatedRoute) {
    this.audio = new Audio();
    this._music = {} as Music;
    this._isMusic = false;
    //this._delete$ = new EventEmitter<MusicComponent>();
  }

  ngOnInit(): void {
    merge(
      this._route.params.pipe(
        filter((params: any) => !!params.id),
        mergeMap((params: any) => this._musicService.fetchOne(params.id)),
        tap(() => this._isMusic = true)
      ),
      this._route.params.pipe(
        filter((params: any) => !params.id),
        mergeMap(() => this._musicService.fetchRandomNoAlbum()),
        tap(() => this._isMusic = false)
      )
    )
      .subscribe({
        next: (music: Music) => this._music = music,
        error: () => {
          // manage error when user doesn't exist in DB
          this._isMusic = false;
        }
      });
  }

  get music(): Music {
    return this._music;
  }

  get my_music(): Music {
    return this._music;
  }

  get isMusic(): Boolean {
    return this._isMusic;
  }

  randomNoAlbum(): void {
    this._musicService
    .fetchRandomNoAlbum()
    .subscribe({
      next: (music: Music) => this._music = music});
  }

  randomByAlbum(id: string): void {
    this._musicService
    .fetchRandomByAlbum(id)
    .subscribe({
      next: (music: Music) => this._music = music});
  }

  update(music: Music): Observable<Music> {
    return this._musicService.update(music.id, music);
  }

  navigate(id: string | undefined): void {
    this._router.navigate([ '/albums', id ]);
  }
  /*
  newMusic(musicName: string): MusicComponent {
    this.musicName = musicName.substring(0, musicName.length - 4);
    return this;
  }
  */
  playMusic(music: Music) {
    let musicURL = "../../assets/musiques/" + music.name + ".mp3";
    this.audio.src = musicURL;
    this.audio.load();
    this.audio.play();
  }

  stopMusic() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
