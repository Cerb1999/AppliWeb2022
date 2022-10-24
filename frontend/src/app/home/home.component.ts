import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Track } from 'ngx-audio-player';
import { MusicComponent } from '../music/music.component';
import { Music } from '../shared/types/musics.types';
import { Observable } from 'rxjs';
import { MusicService } from '../shared/services/musics.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /*
  file : File | null = null;
  nomFichier: string;
  title: any;
  msaapDisplayTitle = true;
  msaapDisplayPlayList = true;
  msaapPageSizeOptions = [2,4,6];
  msaapDisplayVolumeControls = true;
  msaapDisplayRepeatControls = true;
  msaapDisplayArtist = false;
  msaapDisplayDuration = false;
  msaapDisablePositionSlider = true;
    
  // Material Style Advance Audio Player Playlist
  msaapPlaylist: Track[] = [
    {
      title: 'Audio One Title',
      link: 'Link to Audio One URL',
      artist: 'Audio One Artist',
      duration: 0
    },
    {
      title: 'Audio Two Title',
      link: 'Link to Audio Two URL',
      artist: 'Audio Two Artist',
      duration: 0
    },
    {
      title: 'Audio Three Title',
      link: 'Link to Audio Three URL',
      artist: 'Audio Three Artist',
      duration: 0
    },
  ];
  */

  fileName: string = '';
  file: File | undefined;
  
  list_musics: MusicComponent[] = [];

  private _musics: Music[];

  constructor(private route: Router, private http: HttpClient, private _musicService: MusicService) {
    this.fileName = "";
    this._musics = [];
  }

  ngOnInit() {
    this._musicService
    .fetch()
    .subscribe({ next: (musics: Music[]) => this._musics = musics });
  }

  get musics(): MusicComponent[] {
    return this.list_musics;
  }

  addMusic(files: FileList) {
    const target = event?.target as HTMLInputElement;
    const file = target.files;

    if (file) {

      this.fileName = file[0].name;

      const formData = new FormData();

      formData.append("thumbnail", file[0]);

      const upload$ = this.http.post("/api/thumbnail-upload", formData);

      upload$.subscribe();
    }

    //this.list_musics.push(new MusicComponent().newMusic(this.fileName));

  }

  removeMusic(music: MusicComponent) {
    this.list_musics.forEach((element, index) => {
      if (element === music) delete this.list_musics[this.list_musics.indexOf(element)];
    });
  }


  _add(music: Music | undefined): Observable<Music> {
    return this._musicService.create(music as Music);
  }

  delete(music: Music): void {
    this._musicService
      .delete(music.id as string)
      .subscribe((id: string) => this._musics = this._musics.filter((p: Music) => p.id !== id));
  }

  mymusics(): Music[] {
    return this._musics;
  }
}
