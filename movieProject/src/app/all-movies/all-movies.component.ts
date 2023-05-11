import {Component, HostBinding, OnInit} from '@angular/core';
import {NotificationsService} from "../services/notifications/notification.service";
import {DataService} from "../services/data/data.service";
import {OverlayContainer} from "@angular/cdk/overlay";
import {FormMovie} from "../interface/form-movie";
import {Sort} from "@angular/material/sort";
import {map, Observable, startWith} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {FavouriteService} from "../services/favourite/favourite.service";
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-all-movies',
  templateUrl: './all-movies.component.html',
  styleUrls: ['./all-movies.component.scss']
})
export class AllMoviesComponent implements OnInit {
  title = 'Breaking movies';
  bool: boolean | undefined;
  postImage: string = "assets/PostImage/pos_";
  showAddButton = true;
  savedMovies: FormMovie[] = []
  currentYear: number = new Date().getFullYear();

  addMovieAccess: boolean | undefined;
  favouriteAccess: boolean | undefined;

  readyMovies:  FormMovie =
    {
      id: 1,
      name: 'Drug drugs',
      year: this.currentYear,
      addedDate: new Date(),
      boxOfficeFees: 12,
      country: 'Drug 1',
      company: '',
      genre: "Action",
      director: 'Drug 1',
      cast: [],
      description: 'ssssssssssssssssssssss',
      isFavourite: false
    }

  options = [
    { label: 'Type A', value: 'type A' },
    { label: 'Type B', value: 'type B' },
    { label: 'Type C', value: 'type C' }
  ];

  nameForSearch!: string[];
  filteredOptions!: Observable<string[]>;


  sortedData!: FormMovie[];
  searchForm = this.fb.group({
    myControl: ['']
    }
  );

  @HostBinding('class') className = '';

  constructor(private notifications: NotificationsService,
              private dataService: DataService,
              private overlay: OverlayContainer,
              private fb: FormBuilder,
              private favService: FavouriteService,
              private authService: AuthService) {
    this.sortedData = this.savedMovies.slice();
  }

  ngOnInit(): void {
    if(!this.authService.isLoggedIn() || this.authService.getCurrentUserRole() == "user"){
      this.addMovieAccess = true;
    }

    if(!this.authService.isLoggedIn()){
      this.favouriteAccess = true;
    }

    this.dataService.getSavedMovies().subscribe(movies => {
      this.savedMovies = movies;
    });

    this.sortedData = this.savedMovies;
    this.nameForSearch = this.savedMovies.map(obj => obj.name);
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
      return this.sortedData = this.savedMovies;
    }
    else{
      return this.sortedData = this.savedMovies.filter(person => person.name === this.searchForm.controls['myControl'].value);
    }
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

    const savedObjects = localStorage.getItem('savedMovies');
    if (savedObjects) {
      this.savedMovies = JSON.parse(savedObjects);
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
    const data = this.savedMovies.slice();
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

  addFavourite(id: number){
    let favMovie = this.savedMovies.filter(movie => movie.id === id);
    this.favService.saveFavouriteMovie(favMovie[0]);
  }

  deleteFavourite(id: number){
    this.favService.deleteFromFavouriteMovie(id);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
