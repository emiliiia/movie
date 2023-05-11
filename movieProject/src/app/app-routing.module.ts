import {Injectable, NgModule} from '@angular/core';
import {RouterModule, RouterStateSnapshot, Routes, TitleStrategy} from '@angular/router';
import {Title} from "@angular/platform-browser";
import {AllMoviesComponent} from "./all-movies/all-movies.component";
import {AddMovieFormComponent} from "./add-movie-form/add-movie-form.component";
import {OneMovieComponent} from "./one-movie/one-movie.component";
import {FavouriteComponent} from "./favourite/favourite.component";
import {AuthComponent} from "./auth/auth.component";
import {RegistrationComponent} from "./registration/registration.component";
import {AdminPageComponent} from "./admin-page/admin-page.component";

const routes: Routes = [
  {path: '', redirectTo: '/movies', pathMatch: 'full'},
  {path: 'movies', component: AllMoviesComponent, title: 'All Movies Page'},
  {path: 'add', component: AddMovieFormComponent, title: 'add movie'},
  {path: 'movie', component: OneMovieComponent, title: 'movie'},
  {path: 'movie/:id', component: OneMovieComponent, title: 'movie'},
  {path: 'favourite', component: FavouriteComponent, title: 'favourite'},
  {path: 'authorization', component: AuthComponent, title: 'authorization'},
  {path: 'registration', component: RegistrationComponent, title: 'registration'},
  {path: 'adminPage', component: AdminPageComponent, title: 'adminPage'},
  {path: '**', redirectTo: '/404'},
];

@Injectable({providedIn: 'root'})
export class TemplatePageTitleStrategy extends TitleStrategy{
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if(title !== undefined){
      this.title.setTitle(`B&M | ${title}`)
    }
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: TitleStrategy, useClass: TemplatePageTitleStrategy},
  ]
})
export class AppRoutingModule { }
