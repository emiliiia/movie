import {Injectable} from '@angular/core';
import {FormMovie} from "../../interface/form-movie";
import {Observable, of} from "rxjs";
import {DataService} from "../data/data.service";

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  private favouriteMovies: FormMovie[] = [];
  private savedMovies: FormMovie[] = [];
  constructor() {
    const storedObjects = localStorage.getItem('favouriteMovies');
    if (storedObjects) {
      this.favouriteMovies = JSON.parse(storedObjects);
    }
  }

  getFavouriteMovies(): Observable<FormMovie[]> {
    return of(this.favouriteMovies);
  }

  isFavourite(id: number): boolean {
    return this.favouriteMovies.find(obj => obj.id === id) !== undefined;
  }

  saveFavouriteById(id: number): Observable<FormMovie | boolean> {
    let saved = false;
    const objectExists = this.favouriteMovies.find(obj => obj.id === id) !== undefined;
    if(objectExists){
      return of(saved);
    }
    else {
      const savedObjects = localStorage.getItem('savedMovies');
      if (savedObjects) {
        this.savedMovies = JSON.parse(savedObjects);
      }

      const objectToUpdate = this.savedMovies.find(obj => obj.id === id);
      if (objectToUpdate) {
        objectToUpdate.isFavourite = true;
      }

      localStorage.setItem('savedMovies', JSON.stringify(this.savedMovies));
      this.favouriteMovies.push((this.savedMovies.find(obj => obj.id === id))!);
      localStorage.setItem('favouriteMovies', JSON.stringify(this.favouriteMovies));
      return of(saved);
    }
  }

  saveFavouriteMovie(movie: FormMovie): Observable<boolean> {
    let saved = false;
    const objectExists = this.favouriteMovies.find(obj => obj.id === movie.id) !== undefined;
    if(objectExists){
      return of(saved);
    }
    else {
      const savedObjects = localStorage.getItem('savedMovies');
      if (savedObjects) {
        this.savedMovies = JSON.parse(savedObjects);
      }

      const objectToUpdate = this.savedMovies.find(obj => obj.id === movie.id);
      if (objectToUpdate) {
        objectToUpdate.isFavourite = true;
      }

      localStorage.setItem('savedMovies', JSON.stringify(this.savedMovies));

      this.favouriteMovies.push(movie);
      localStorage.setItem('favouriteMovies', JSON.stringify(this.favouriteMovies));
      return of(saved);
    }
  }

  deleteFromFavouriteMovie(id: number): Observable<boolean> {
    let deleted = false;
    const objectExists = this.favouriteMovies.find(obj => obj.id === id) !== undefined;
    if(objectExists){
      const savedObjects = localStorage.getItem('savedMovies');
      if (savedObjects) {
        this.savedMovies = JSON.parse(savedObjects);
      }

      const objectToUpdate = this.savedMovies.find(obj => obj.id === id);
      if (objectToUpdate) {
        objectToUpdate.isFavourite = false;
      }

      localStorage.setItem('savedMovies', JSON.stringify(this.savedMovies));
    }
    for (let i = 0; i < this.favouriteMovies.length; i++) {
      if (this.favouriteMovies[i].id === id) {
        this.favouriteMovies.splice(i, 1);
        deleted = true;
        break;
      }
    }
    localStorage.setItem('favouriteMovies', JSON.stringify(this.favouriteMovies));
    return of(deleted);
  }
}
