import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../services/data/data.service";
import {Subscription, switchMap} from "rxjs";
import {FormMovie} from "../interface/form-movie";

@Component({
  selector: 'app-one-movie',
  templateUrl: './one-movie.component.html',
  styleUrls: ['./one-movie.component.scss']
})
export class OneMovieComponent implements OnInit {
  movie!: FormMovie;
  editedMovie!: FormMovie;
  editMode: boolean = false;
  id: number | undefined;
  private subscription: Subscription;

  constructor(private route: ActivatedRoute, private dataService: DataService) {
    this.subscription = route.params.subscribe(params=>this.id=params['id']);
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
    )
      .subscribe(data=> this.id = +data);
    this.getMovie();
  }

  private getMovie(): void {
    this.dataService.getMovieById(this.id!).subscribe(data => this.movie = data!);
  }

  changeEditMode(value: boolean) {
    this.getMovie();
    this.editMode = value;
  }

  showEditForm(value: boolean) {
    this.editedMovie = this.movie;
    this.editMode = value;
  }
}
