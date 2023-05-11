import {Component, Inject, Injectable} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-notification-snackbar',
  template: `
    <div class="notification-snackbar">
      <mat-icon>{{ data.icon }}</mat-icon>
      <div>{{ data.message }}</div>
    </div>
  `
})
export class NotificationSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message: string): void {
    this.snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {
        message: message,
        icon: 'done',
      },
      panelClass: ['green-snackbar'],
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  showError(message: string): void {
    this.snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {
        message: message,
        icon: 'close',
      },
      panelClass: ['error-snackbar'],
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  showWarning(message: string): void {
    this.snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {
        message: message,
        icon: 'warning',
      },
      panelClass: 'warning-snackbar',
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  showInfo(message: string): void {
    this.snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {
        message: message,
        icon: 'info',
      },
      panelClass: 'info-snackbar',
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
