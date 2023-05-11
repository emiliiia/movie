import { Injectable } from '@angular/core';
import {FormMovie} from "../../interface/form-movie";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {GlobalConstants} from "../../interface/global-constants";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private savedMovies: FormMovie[] = [];

  constructor(private http: HttpClient) {
    const storedObjects = localStorage.getItem('savedMovies');
    if (storedObjects) {
      this.savedMovies = JSON.parse(storedObjects);
    }
  }

  getSavedMovies(): Observable<FormMovie[]> {
    return of(this.savedMovies);
  }

  saveMovie(movie: FormMovie): Observable<boolean> {
    let saved = false;
    let index = -1;
    for(let i = 0; i < this.savedMovies.length; i++){
      if(this.savedMovies[i].id === movie.id){
        index = i;
        break;
      }
    }
    if(index === -1){
      movie.id = Date.now();
      this.savedMovies.push(movie);
      saved = true;
    }
    else {
      this.savedMovies[index] = movie;
      saved = true;
    }
    localStorage.setItem('savedMovies', JSON.stringify(this.savedMovies));
    return of(saved);
  }

  saveMovieWithPhoto(movie: FormMovie, image: File): Observable<boolean> {
    let saved = false;
    let index = -1;
    for (let i = 0; i < this.savedMovies.length; i++) {
      if (this.savedMovies[i].id === movie.id) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      movie.id = Date.now();
      this.savedMovies.push(movie);
      saved = true;
    } else {
      this.savedMovies[index] = movie;
      saved = true;
    }

    const newPath = `PostImage/pos_${movie.id}.jpg`;
    let imageData: FormData;
    imageData = new FormData();
    imageData.append('photo', image);
    imageData.append('newPath', newPath);
    this.http.post(GlobalConstants.apiURL + '/image/uploadPhoto/', imageData).toPromise();


    localStorage.setItem('savedMovies', JSON.stringify(this.savedMovies));
    return of(saved);
  }

  getMovieById(id: number): Observable<FormMovie | undefined> {
    const movie = this.savedMovies.find(m => m.id === id);
    return of(movie);
  }

  updateMovie(movie: FormMovie): Observable<boolean> {
    let updated = false;
    const index = this.savedMovies.findIndex(m => m.id === movie.id);
    if (index > -1) {
      this.savedMovies[index] = movie;
      updated = true;
      localStorage.setItem('savedMovies', JSON.stringify(this.savedMovies));
    }
    return of(updated);
  }

  deleteMovie(id: number): Observable<boolean> {
    let deleted = false;
    for (let i = 0; i < this.savedMovies.length; i++) {
      if (this.savedMovies[i].id === id) {
        this.savedMovies.splice(i, 1);
        deleted = true;
        break;
      }
    }
    localStorage.setItem('savedMovies', JSON.stringify(this.savedMovies));
    return of(deleted);
  }
}

