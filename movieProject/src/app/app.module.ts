import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import {FlexModule} from "@angular/flex-layout";
import {AllMoviesComponent} from './all-movies/all-movies.component';
import {AppRoutingModule} from "./app-routing.module";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import { AddMovieFormComponent } from './add-movie-form/add-movie-form.component';
import {NotificationSnackbarComponent} from "./services/notifications/notification.service";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {GlobalHttpInterceptorService} from "./services/global-http-interceptor.service";
import { OneMovieComponent } from './one-movie/one-movie.component';
import { MovieInfoComponent } from './movie-info/movie-info.component';
import { RoundNumberPipe } from './pipes/round-number.pipe';
import {MatSortModule} from "@angular/material/sort";
import { FavouriteComponent } from './favourite/favourite.component';
import { AuthComponent } from './auth/auth.component';
import { RegistrationComponent } from './registration/registration.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { AdminPageComponent } from './admin-page/admin-page.component';
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [
    AppComponent,
    AllMoviesComponent,
    AddMovieFormComponent,
    NotificationSnackbarComponent,
    HeaderComponent,
    FooterComponent,
    OneMovieComponent,
    MovieInfoComponent,
    RoundNumberPipe,
    FavouriteComponent,
    AuthComponent,
    RegistrationComponent,
    AdminPageComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatExpansionModule,
        HttpClientModule,
        FlexModule,
        AppRoutingModule,
        MatAutocompleteModule,
        MatTooltipModule,
        MatSelectModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatSortModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
