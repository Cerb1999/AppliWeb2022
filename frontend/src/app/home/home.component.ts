import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Track } from 'ngx-audio-player';
import { MusicComponent } from '../music/music.component';

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

  constructor(private route: Router, private http: HttpClient) {
    this.fileName = "";
  }

  ngOnInit() {

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

    this.list_musics.push(new MusicComponent().newMusic(this.fileName));

  }

  removeMusic(music: MusicComponent) {
    this.list_musics.forEach((element, index) => {
      if (element === music) delete this.list_musics[this.list_musics.indexOf(element)];
    });
  }
}
