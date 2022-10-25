import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MusicService } from '../shared/services/musics.service';
import { Music } from '../shared/types/musics.types';

@Component({
  selector: 'app-musics',
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.scss']
})
export class MusicsComponent implements OnInit {
  private _musics: Music[];
    private readonly _backendURL: any;
  //audio: any;


  constructor(private _router: Router, private _musicService: MusicService) {
    this._musics = [];
    //this.audio = new Audio();
    this._backendURL = {};
    // build backend base url
    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;
    }
    // @ts-ignore
    Object.keys(environment.backend.endpoints).forEach(k => this._backendURL[k] = `${baseUrl}${environment.backend.endpoints[k]}`);
  }

  ngOnInit(): void {
    this._musicService
      .fetch()
      .subscribe({ next: (musics: Music[]) => this._musics = musics });
  }

  navigate(name: string | undefined): void {
    this._router.navigate([ '/albums', name ]);
  }


  _add(music: Music | undefined): Observable<Music> {
    return this._musicService.create(music as Music);
  }

  get musics(): Music[] {
    return this.musics;
  }
  
  delete(music: Music): void {
    this._musicService
      .delete(music.id as string)
      .subscribe((id: string) => this._musics = this._musics.filter((p: Music) => p.id !== id));
  }
  /*
  playMusic(music: Music) {
    let musicURL = "../../assets/musiques" + music.name + ".mp3";
    this.audio.src = musicURL;
    this.audio.load();
    this.audio.play();
  }

  stopMusic() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
  */
}
