import {Component, HostBinding} from '@angular/core';
import {FormMovie} from "../interface/form-movie";
import {map, Observable, startWith} from "rxjs";
import {NotificationsService} from "../services/notifications/notification.service";
import {OverlayContainer} from "@angular/cdk/overlay";
import {FormBuilder} from "@angular/forms";
import {FavouriteService} from "../services/favourite/favourite.service";
import {Sort} from "@angular/material/sort";
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent {
  bool: boolean | undefined;
  postImage: string = "assets/PostImage/pos_";

  favouriteMovies: FormMovie[] = []

  nameForSearch!: string[];
  filteredOptions!: Observable<string[]>;
  sortedData!: FormMovie[];
  searchForm = this.fb.group({
      myControl: ['']
    }
  );

  @HostBinding('class') className = '';

  constructor(private notifications: NotificationsService,
              private favouriteService: FavouriteService,
              private overlay: OverlayContainer,
              private fb: FormBuilder,
              private favService: FavouriteService,
              private authService: AuthService,
              private router: Router) {
    this.sortedData = this.favouriteMovies.slice();
  }

  ngOnInit(): void {
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/movies']);
      this.notifications.showWarning('Sign in');
    }

    this.favouriteService.getFavouriteMovies().subscribe(movies => {
      this.favouriteMovies = movies;
    });

    this.sortedData = this.favouriteMovies;
    this.nameForSearch = this.favouriteMovies.map(obj => obj.name);
    this.filteredOptions = this.searchForm.controls['myControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();

    return this.nameForSearch.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit(): FormMovie[]{
    if(this.searchForm.controls['myControl'].value === ''){
      return this.sortedData = this.favouriteMovies;
    }
    else{
      return this.sortedData = this.favouriteMovies.filter(person => person.name === this.searchForm.controls['myControl'].value);
    }
  }

  deleteFavourite(id: number){
    this.favService.deleteFromFavouriteMovie(id);
  }

  ngDoCheck(){
    this.bool = localStorage.getItem('list') == 'true';

    // Отримання збереженого значення теми з localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme == 'dark') {
      this.updateTheme(true);
    }
    else {
      this.updateTheme(false);
    }
  }

  updateTheme(isDarkTheme: null | boolean) {
    const darkClassName = 'darkMode';
    this.className = isDarkTheme ? darkClassName : '';
    if (isDarkTheme) {
      this.overlay.getContainerElement().classList.add(darkClassName);
    } else {
      this.overlay.getContainerElement().classList.remove(darkClassName);
    }
  }

  boolChange(){
    this.bool = !this.bool;
    localStorage.setItem('list', String(this.bool));
  }
  sortData(sort: Sort) {
    const data = this.favouriteMovies.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'year':
          return compare(a.year, b.year, isAsc);
        case 'addedDate':
          return compare(a.addedDate.getDate(), b.addedDate.getDate(), isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
