import { Component, EventEmitter, Inject, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { NavigationEnd, NavigationStart,ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Track } from 'ngx-audio-player';
import { MusicComponent } from '../music/music.component';
import { Music } from '../shared/types/musics.types';
import { merge, Observable } from 'rxjs';
import { MusicService } from '../shared/services/musics.service';
import { interval } from 'rxjs';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  fileName: string = '';
  file: File | undefined;
  audio: any;
  id: number;
  private readonly _delete$: EventEmitter<Music>;
  randMusicName: string;

  
  list_musics: MusicComponent[] = [];

  _musics: Music[];
  private readonly _backendURL: any;

  constructor(private route: Router, private http: HttpClient, private _musicService: MusicService, private _route: ActivatedRoute) {
    this.fileName = "";
    this._musics = [];
    this.audio = new Audio();
    this.id = 0;
    this._delete$ = new EventEmitter<Music>();
    this.randMusicName = "";
  }

  
  ngOnDestroy() {
    this.stopMusicAny();
  }

  ngOnInit() {
    this._musicService
    .fetch()
      .subscribe({ next: (musics: Music[]) => this._musics = musics });

    this._musicService
      .fetchRandomNoAlbum()
      .subscribe({
        next: (music: Music) => {
          this.randMusicName = music.name;
          this.randMusicName = "../../assets/musiques/" + music.name + ".mp3";
        }
      });
  }

  randomPlayMusic(): void {
    this.stopMusicAny();
    this.audio.src = this.randMusicName;
    this.audio.load();
    this.audio.play();
  }

  get musics(): Music[] {
    return this._musics;
  }
  

  playMusic(music: Music) {
    this.stopMusicAny();
    this._musics.forEach((element) => {
      if (element === music) {
        let musicURL = "../../assets/musiques/" + music.name + ".mp3";
        this.audio.src = musicURL;
        this.audio.load();
        this.audio.play();
      };
    });
  }

  stopMusicAny(): void {
    this.audio.pause()
  }

  stopMusic(music: Music) {
    this._musics.forEach((element) => {
      if (element === music) {
        this.audio.pause();
        this.audio.currentTime = 0;
      };
    });
    
  }

  _add(files: FileList): Observable<Music> {
    const target = event?.target as HTMLInputElement;
    const file = target.files;

    if (file) {

      this.fileName = file[0].name;

      const formData = new FormData();

      formData.append("thumbnail", file[0]);

      const upload$ = this.http.post("/api/thumbnail-upload", formData);

      upload$.subscribe();

      
    }
    this.fileName = this.fileName.substring(0, this.fileName.length - 4); // nom fichier sans le format

    const music: Music = {
      name: this.fileName
    };
    
    this._musics.push(music);
    const create = this._musicService.create(music as Music);
    create.subscribe();
    return create;
    
  }

  delete(music: Music): void {
    
    this.stopMusicAny();
    this._musicService
      .delete(music.name as string)
      .subscribe((name: string) => this._musics = this._musics.filter((p: Music) => p.name !== name));
      

    this._musics.forEach((element) => {
      if (element === music) {
        this._musics.splice(this._musics.indexOf(music), 1);
      };
    });
  }
}
