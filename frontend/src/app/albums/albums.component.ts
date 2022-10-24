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
  private _albums: Album[];

  constructor(private _router: Router, private _albumService: AlbumService) {
    this._albums = [];  
  }

  ngOnInit(): void {
    this._albumService
      .fetch()
      .subscribe({ next: (albums: Album[]) => this._albums = albums });
  }

  navigate(id: string | undefined): void {
    this._router.navigate([ '/albums', id ]);
  }

  delete(album: Album): void {
    this._albumService
      .delete(album.id as string)
      .subscribe((id: string) => this._albums = this._albums.filter((a: Album) => a.id !== id));
  }

  _add(album: Album | undefined): Observable<Album> {
    return this._albumService.create(album as Album);
  }

  get albums(): Album[] {
    return this.albums;
  }
}