import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../services/data/data.service";
import {NotificationsService} from "../services/notifications/notification.service";
import {FormMovie} from "../interface/form-movie";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OverlayContainer} from "@angular/cdk/overlay";
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-add-movie-form',
  templateUrl: './add-movie-form.component.html',
  styleUrls: ['./add-movie-form.component.scss']
})
export class AddMovieFormComponent implements OnInit{
  @Input() mode: string = "CREATE";
  @Input() movieId!: number;

  constructor(private fb: FormBuilder,
              private router: Router,
              private notifications: NotificationsService,
              private data: DataService,
              private overlay: OverlayContainer,
              private authService: AuthService) {
  }


  genresList = [
    { label: 'Drama', value: 'Drama' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Comedy', value: 'Comedy' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Science fiction', value: 'Science fiction' },
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Sports', value: 'Sports' },
    { label: 'Action', value: 'Action' },
    { label: 'Western', value: 'Western' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Musical', value: 'Musical' },
    { label: 'Mystery', value: 'Mystery' }
  ];


  hide1 = true;
  hide2 = true;
  hide3 = true;
  hide4 = true;

  savedMovies: FormMovie[] = []
  myVariable: boolean = true;
  myValue!: string;
  bool: boolean | undefined;
  image!: File;

  currentYear: number = new Date().getFullYear();

  ngOnInit(): void {
    if(!this.authService.isLoggedIn() || this.authService.getCurrentUserRole() == "user"){
      this.router.navigate(['/']);
    }
    /********************DATASERVICE**************/
    this.data.getSavedMovies().subscribe(movies => {
      this.savedMovies = movies;
    });

    if(this.mode == "UPDATE"){

      this.data.getMovieById(this.movieId).subscribe(movie => {
        if (movie) {
          this.myVariable = false;
          this.movieFbForm.controls['id'].setValue(movie.id);
          this.movieFbForm.controls['name'].setValue(movie.name);
          this.movieFbForm.controls['year'].setValue(movie.year);
          this.movieFbForm.controls['genre'].setValue(movie.genre);
          this.movieFbForm.controls['boxOfficeFees'].setValue(movie.boxOfficeFees);
          this.movieFbForm.controls['country'].setValue(movie.country);
          this.movieFbForm.controls['company'].setValue(movie.company);
          this.cast.clear();
          movie.cast.forEach((item, index) => {
            this.cast.push(this.fb.control(""));
          });
          this.movieFbForm.controls['cast'].setValue(movie.cast);
          this.movieFbForm.controls['description'].setValue(movie.description);
          this.movieFbForm.controls['director'].setValue(movie.director);
          this.notifications.showSuccess('movie successfully received');
        }
        else{
          this.notifications.showError('Failed to get user');
        }
      });
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
  }

  @HostBinding('class') className = '';

  updateTheme(isDarkTheme: null | boolean) {
    const darkClassName = 'darkMode';
    this.className = isDarkTheme ? darkClassName : '';
    if (isDarkTheme) {
      this.overlay.getContainerElement().classList.add(darkClassName);
    } else {
      this.overlay.getContainerElement().classList.remove(darkClassName);
    }
  }

  movieFbForm = this.fb.group({
      id: [{value: null, disabled: true}],
      name: ['', Validators.required],
      year: 1800,
      genre: this.fb.control(''),
      boxOfficeFees: [0, Validators.required],
      country: ['', Validators.required],
      company: ['', Validators.required],
      cast: this.fb.array([
        this.fb.control('')
      ]),
      description: [''],
      director: ['', Validators.required]
    },
    {
      validators: this.checkForm("name")
    });

  onSubmit() {
    if (this.mode === 'CREATE') {
      if(this.movieFbForm.controls["id"].value == null){
        if (!this.movieFbForm.controls["id"].untouched || this.movieFbForm.controls["id"].dirty) {
          return;
        }

        let possibleId = this.movieFbForm.controls["id"].value;
        let newMovie: FormMovie;
        newMovie = {
          id: possibleId == null || possibleId == '' ? null : possibleId,
          name: this.movieFbForm.controls['name'].value,
          year: this.movieFbForm.controls['year'].value,
          genre: this.movieFbForm.controls['genre'].value,
          boxOfficeFees: this.movieFbForm.controls['boxOfficeFees'].value,
          country: this.movieFbForm.controls['country'].value,
          company: this.movieFbForm.controls['company'].value,
          cast: this.movieFbForm.controls['cast'].value,
          description: this.movieFbForm.controls['description'].value,
          director: this.movieFbForm.controls['director'].value,
          addedDate: new Date,
          isFavourite: false
        }

        /********************DATASERVICE**************/
        const fileReader = new FileReader();
        const file = (<HTMLInputElement>document.getElementById("photo")).files![0];
        this.image = file;
        fileReader.readAsDataURL(file);

        this.data.saveMovieWithPhoto(newMovie, this.image).subscribe(created => {
          if (created) {
            this.router.navigate([`/movie/${newMovie.id}`]);
          } else {
            this.notifications.showError('Failed to create movie');
          }
        });
    }
    }
    else if (this.mode === 'UPDATE'){
      let newMovie: FormMovie;
      newMovie = {
        id: this.movieFbForm.controls['id'].value,
        name: this.movieFbForm.controls['name'].value,
        year: this.movieFbForm.controls['year'].value,
        genre: this.movieFbForm.controls['genre'].value,
        boxOfficeFees: this.movieFbForm.controls['boxOfficeFees'].value,
        country: this.movieFbForm.controls['country'].value,
        company: this.movieFbForm.controls['company'].value,
        cast: this.movieFbForm.controls['cast'].value,
        description: this.movieFbForm.controls['description'].value,
        director: this.movieFbForm.controls['director'].value,
        addedDate: new Date,
        isFavourite: false
      }

      if((<HTMLInputElement>document.getElementById("photo")).files!.length === 0){
        this.data.updateMovie(newMovie).subscribe(updated => {
          if (updated) {
            this.notifications.showSuccess('Movie was updated successfully');
            this.exit();
          } else {
            this.notifications.showError('Failed to update movie');
          }
        });
      }else {
        this.data.deleteMovie(newMovie.id);
        const fileReader = new FileReader();
        const file = (<HTMLInputElement>document.getElementById("photo")).files![0];
        this.image = file;
        fileReader.readAsDataURL(file);

        this.data.saveMovieWithPhoto(newMovie, this.image).subscribe(created => {
          if (created) {
            this.router.navigate(['/movies']);
          } else {
            this.notifications.showError('Failed to update movie');
          }
        });

      }
    }


  }

  get cast() {
    return this.movieFbForm.get('cast') as FormArray;
  }

  get genre() {
    return this.movieFbForm.get('genre') as FormArray;
  }

  addCast() {
    this.cast.push(this.fb.control("Cast name"));
  }

  removeCast(index: number) {
    this.cast.removeAt(index);
  }
  disableBool: boolean = true;

  checkForm(name: string){
    return (formGroup: FormGroup) =>{
      const nameControl = formGroup.controls[name];
      if(nameControl.value == null) {
        return {valid: false}
      }
      return null;
    }
  }

  resetForm() {
    this.movieFbForm.reset();
  }

  @Output() onInfo = new EventEmitter<boolean>();

  public returnToInfo() {
    this.onInfo.emit(false);
  }

  exit() {
    if (this.mode === 'UPDATE') {
      this.returnToInfo();
    }
    else if (this.mode === 'CREATE') {
      this.router.navigate(['/movies']);
    }
  }
}
