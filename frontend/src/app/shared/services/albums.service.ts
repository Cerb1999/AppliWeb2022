import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { defaultIfEmpty, filter, map } from 'rxjs/operators';
import { Album } from '../types/albums.types';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
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


  fetch(): Observable<Album[]> {
    return this._http.get<Album[]>(this._backendURL.allAlbums)
      .pipe(
        filter((album: Album[]) => !!album),
        defaultIfEmpty([])
      );
  }

  fetchRandom(): Observable<Album> {
    return this._http.get<Album>(this._backendURL.randomAlbum)
      .pipe(
        filter((album: Album) => !!album),
      );
  }

  fetchOne(id: string): Observable<Album> {
    return this._http.get<Album>(this._backendURL.oneAlbum.replace(':id', id));
  }

  create(person: Album): Observable<any> {
    return this._http.post<Album>(this._backendURL.allAlbums, person, this._options());
  }

  update(id: string | undefined, album: Album): Observable<any> {
    return this._http.put<Album>(this._backendURL.oneAlbum.replace(':id', id), album, this._options());
  }

  delete(id: string): Observable<string> {
    return this._http.delete(this._backendURL.oneAlbum.replace(':id', id))
      .pipe(
        map(() => id)
      );
  }

  private _options(headerList: object = {}): any {
    return { headers: new HttpHeaders(Object.assign({ 'Content-Type': 'application/json' }, headerList)) };
  }
}
