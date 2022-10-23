import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})

export class MusicComponent implements OnInit {
  musicName: string = "";
  audio: any;
  //private readonly _delete$: EventEmitter<MusicComponent>;
  
  constructor() {
    this.audio = new Audio();
    //this._delete$ = new EventEmitter<MusicComponent>();
  }

  ngOnInit(): void {
  }

  get music(): MusicComponent {
    return this;
  }

  newMusic(musicName: string): MusicComponent {
    this.musicName = musicName.substring(0, musicName.length - 4);
    return this;
  }

  playMusic(music: MusicComponent) {
    let musicURL = "../../assets/musiques/" + music.musicName + ".mp3";
    this.audio.src = musicURL;
    this.audio.load();
    this.audio.play();
  }

  stopMusic() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
  /*
  @Output('deleteMusic') get delete$(): EventEmitter<MusicComponent> {
    return this._delete$;
  }

  delete(music: MusicComponent): void {
    this._delete$.emit(music);
  }
  */
}
