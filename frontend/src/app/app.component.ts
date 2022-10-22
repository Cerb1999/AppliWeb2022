import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  nomFichier: string;
  title: any;
  
  constructor (private route: Router/*, private http: HttpClient*/) {
    this.nomFichier = "";
  }
  
  /*
  ajoutMusique(event) {
    
    const file:File = event.target.files[0];

    if (file) {

        this.nomFichier = file.name;

        const formData = new FormData();

        formData.append("thumbnail", file);

        const upload$ = this.http.post("/api/thumbnail-upload", formData);

        upload$.subscribe();
    }
  }
  */
  onAlbum() {
    this.route.navigate(['/albums']);
  }

  
}
