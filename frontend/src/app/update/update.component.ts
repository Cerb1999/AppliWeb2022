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
    this._route.params
      .pipe(
        map((params: any) => params.id),
        mergeMap((id: string) => this._fetchOne(id))
      )
      .subscribe((music: Music) => this._initModal(music));
  }

  /**
   * Initialize modal process
   */
  private _initModal(music: Music): void {
    /*
    // create modal with initial data inside
    this._peopleDialog = this._dialog.open(DialogComponent, {
      width: '500px',
      disableClose: true,
      data: person
    });

    // subscribe to afterClosed observable to set dialog status and do process
    this._peopleDialog.afterClosed()
      .pipe(
        filter((person: Person | undefined) => !!person),
        map((person: Person | undefined) => {
          // get person id
          const id = person?.id;
          // delete obsolete attributes in original object which are not required in the API
          delete person?.id;
          delete person?.photo;

          return { id, update: person };
        }),
        mergeMap((_: { id: any, update: any }) => this._update(_.id, _.update))
      )
      .subscribe({
        error: () => this._router.navigate(['/people']),
        complete: () => this._router.navigate(['/people'])
      }
      );
      */
  }

  /**
   * Update a person in the list
   */
  private _update(id: string, music: Music): Observable<Music> {
    return this._http.put<Music>(
      this._backendURL.onePeople.replace(':id', id),
      music,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  /**
   * Returns an observable which fetch one person by id
   */
  private _fetchOne(id: string): Observable<Music> {
    return this._http.get<Music>(this._backendURL.onePeople.replace(':id', id));
  }

}
