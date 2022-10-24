import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MusicService } from '../shared/services/musics.service';
import { Music } from '../shared/types/musics.types';

@Component({
  selector: 'app-musics',
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.scss']
})
export class MusicsComponent implements OnInit {
  private _musics: Music[];
  audio: any;


  constructor(private _router: Router, private _musicService: MusicService) {
    this._musics = [];
    this.audio = new Audio();
  }

  ngOnInit(): void {
    this._musicService
      .fetch()
      .subscribe({ next: (musics: Music[]) => this._musics = musics });
  }

  navigate(id: string | undefined): void {
    this._router.navigate([ '/albums', id ]);
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

  playMusic(music: Music) {
    let musicURL = "../../../../data/" + music.name + ".mp3";
    this.audio.src = musicURL;
    this.audio.load();
    this.audio.play();
  }

  stopMusic() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
