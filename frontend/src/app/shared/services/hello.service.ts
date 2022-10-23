import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Hello } from '../types/hello.type';
import { defaultIfEmpty, filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HelloService {
  // private property to store all backend URLs
  private readonly _backendURL: any;
  // private property to store default person
  private readonly _defaultHello: Hello;

  constructor(private _http: HttpClient) {
    this._defaultHello = {
      field: 'default_hello'
    };
    this._backendURL = {};

    // build backend base url
    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;
    }

    // build all backend urls
    // @ts-ignore
    Object.keys(environment.backend.endpoints).forEach(k => this._backendURL[ k ] = `${baseUrl}${environment.backend.endpoints[ k ]}`);
  }

  /**
   * Returns private property _defaultPerson
   */
  get defaultHello(): Hello {
    return this._defaultHello;
  }

  /**
   * Function to return list of person
   */
  fetch(): Observable<Hello[]> {
    return this._http.get<Hello[]>(this._backendURL.allHello)
      .pipe(
        filter((hello: Hello[]) => !!hello),
        defaultIfEmpty([])
      );
  }

  
  /**
   * Function to return request options
   */
  private _options(headerList: object = {}): any {
    return { headers: new HttpHeaders(Object.assign({ 'Content-Type': 'application/json' }, headerList)) };
  }
}
