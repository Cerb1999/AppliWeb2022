import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Music } from '../shared/types/musics.types';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  // private property to store all backend URLs
  private readonly _backendURL: any;
  // private property to store dialog reference
  //private _peopleDialog: MatDialogRef<DialogComponent, Person> | undefined;

  /**
   * Component constructor
   */
  constructor(private _route: ActivatedRoute, private _router: Router, private _http: HttpClient) {
    this._backendURL = {};

    // build backend base url
    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;
    }

    // build all backend urls
    // @ts-ignore
    Object.keys(environment.backend.endpoints).forEach(k => this._backendURL[k] = `${baseUrl}${environment.backend.endpoints[k]}`);
  }

  /**
   * OnInit implementation
   */
  ngOnInit(): void {
    /*
    this._route.params
      .pipe(
        map((params: any) => params.id),
        mergeMap((id: string) => this._fetchOne(id))
      )
      .subscribe((music: Music) => this._initModal(music));
      */
  }
}
