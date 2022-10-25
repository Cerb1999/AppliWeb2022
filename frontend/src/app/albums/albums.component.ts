import { Component, OnInit } from '@angular/core';
import { Album } from '../shared/types/albums.types';
import { Router } from '@angular/router';
import { AlbumService } from '../shared/services/albums.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {
  _albums: Album[];

  constructor(private _router: Router, private _albumService: AlbumService) {
    this._albums = [];  
  }

  ngOnInit(): void {
    this._albumService
      .fetch()
      .subscribe({ next: (albums: Album[]) => this._albums = albums });
  }

  ajoutAlbum() {
    let input = document.getElementById('name-album') as HTMLInputElement ;

    if (input.value != "") {
      const album: Album = {
        name: input.value
      }
      this._add(album);
    }
  }

  navigate(name: string | undefined): void {
    this._router.navigate([ 'albums/', name ]);
  }

  delete(album: Album): void {
    this._albumService
      .delete(album.name as string)
      .subscribe((name: string) => this._albums = this._albums.filter((a: Album) => a.name !== name));
  }

  _add(album: Album | void): Observable<Album> {
    const create = this._albumService.create(album as Album);
    create.subscribe();
    this._albums.push(album as Album);
    return create;
  }

  get albums(): Album[] {
    return this.albums;
  }
}