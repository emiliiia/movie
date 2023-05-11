import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneMovieComponent } from './one-movie.component';

describe('OneMovieComponent', () => {
  let component: OneMovieComponent;
  let fixture: ComponentFixture<OneMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneMovieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
