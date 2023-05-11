import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {FormMovie} from "../interface/form-movie";
import {NotificationsService} from "../services/notifications/notification.service";
import {DataService} from "../services/data/data.service";
import {OverlayContainer} from "@angular/cdk/overlay";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth/auth.service";
import {FavouriteService} from "../services/favourite/favourite.service";

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss']
})
export class MovieInfoComponent implements OnInit {
  @Input() movie!: FormMovie;
  @Input() movieId!: number;
  postImage: string = "assets/PostImage/pos_";
  addMovieAccess: boolean | undefined;

  constructor(private notifications: NotificationsService,
              private dataService: DataService,
              private overlay: OverlayContainer,
              private router: Router,
              private authService: AuthService,
              private favService: FavouriteService) {
  }
  @Output() onEdit = new EventEmitter<boolean>();
  @HostBinding('class') className = '';


  ngOnInit(): void {
    if(!this.authService.isLoggedIn() || this.authService.getCurrentUserRole() == "user"){
      this.addMovieAccess = true;
    }
  }

  public enableEditMode() {
    this.onEdit.emit(true);
  }

  delete() {
    if (window.confirm("Are you sure you want to permanently delete this post?")) {
      this.dataService.deleteMovie(this.movieId).subscribe(() => {
        this.router.navigate(['/movies']);
      });
    }
  }


  isFavourite(id: number):  boolean {
    return this.favService.isFavourite(id);
  }

  addFavourite(id: number){
    this.favService.saveFavouriteById(id);
  }

  deleteFavourite(id: number){
    this.favService.deleteFromFavouriteMovie(id);
  }

  ngDoCheck(){
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
}
