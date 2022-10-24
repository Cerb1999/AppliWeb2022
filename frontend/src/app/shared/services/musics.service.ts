import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { defaultIfEmpty, filter, map } from 'rxjs/operators';
import { Album } from '../types/albums.types';
import { Music } from '../types/musics.types';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private readonly _backendURL: any;

  constructor(private _http: HttpClient) {
    this._backendURL = {};

    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;
    }

    // @ts-ignore
    Object.keys(environment.backend.endpoints).forEach(k => this._backendURL[ k ] = `${baseUrl}${environment.backend.endpoints[ k ]}`);
  }


  fetch(): Observable<Music[]> {
    return this._http.get<Music[]>(this._backendURL.allMusics)
      .pipe(
        filter((music: Music[]) => !!music),
        defaultIfEmpty([])
      );
  }

  fetchByAlbum(id: string): Observable<Music[]> {
    return this._http.get<Music[]>(this._backendURL.allMusicsOneAlbum.replace(':id', id))
      .pipe(
        filter((music: Music[]) => !!music),
        defaultIfEmpty([])
      );
  }

  fetchRandomNoAlbum(): Observable<Music> {
    return this._http.get<Music>(this._backendURL.randomMusicNoAlbum)
      .pipe(
        filter((music: Music) => !!music),
      );
  }

  fetchRandomByAlbum(id: string): Observable<Music> {
    return this._http.get<Music>(this._backendURL.randomMusicOneAlbum.replace(':id', id))
      .pipe(
        filter((music: Music) => !!music),
      );
  }

  fetchOne(id: string): Observable<Music> {
    return this._http.get<Music>(this._backendURL.oneMusic.replace(':id', id));
  }

  create(music: Music): Observable<any> {
    return this._http.post<Music>(this._backendURL.allMusics, music, this._options());
  }

  update(id: string, music: Music): Observable<any> {
    return this._http.put<Music>(this._backendURL.oneMusic.replace(':id', id), music, this._options());
  }

  delete(id: string): Observable<string> {
    return this._http.delete(this._backendURL.oneMusic.replace(':id', id))
      .pipe(
        map(() => id)
      );
  }

  private _options(headerList: object = {}): any {
    return { headers: new HttpHeaders(Object.assign({ 'Content-Type': 'application/json' }, headerList)) };
  }
}
