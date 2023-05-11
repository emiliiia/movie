import {Component, HostBinding} from '@angular/core';
import {FormControl} from "@angular/forms";
import {OverlayContainer} from "@angular/cdk/overlay";
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";
import {NotificationsService} from "../services/notifications/notification.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  toggleControl = new FormControl(false);
  registerBool!: boolean;
  logInBool!: boolean;
  isAdmin: boolean = false;

  @HostBinding('class') className = '';

  constructor(private overlay: OverlayContainer,
              private authService: AuthService,
              private notifications: NotificationsService,
              private router: Router) { }

  ngOnInit() {
    if(this.authService.getCurrentUserRole() == "admin"){
      this.isAdmin = true;
    }

    this.logInBool = this.authService.isLoggedIn();
    // Отримання збереженого значення теми з localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme == 'dark') {
      this.updateTheme(true);
      this.toggleControl.setValue(true);
    }

    // Слухач для зміни значення теми
    this.toggleControl.valueChanges.subscribe((value) => {
      // Збереження значення теми в localStorage
      localStorage.setItem('theme', value ? 'dark' : 'light');
      // Виконання інших дій, пов'язаних зі зміною теми
      this.updateTheme(value);
    });
  }

  logout(){
    this.authService.logout().subscribe(saved => {
      if(saved){
        this.notifications.showSuccess('Successful log out');
        this.router.navigate(['']);
      }
    });
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
