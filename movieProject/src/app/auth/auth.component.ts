import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NotificationsService} from "../services/notifications/notification.service";
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit{

  constructor(private fb: FormBuilder,
              private router: Router,
              private notifications: NotificationsService,
              private authService: AuthService) {
  }

  hide = true;
  disablBool: boolean = true;

  logInFbForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', [Validators.required]]
    },
    {
      validators: this.checkForm("name")
    });

  onSubmit() {
    /********************DATASERVICE**************/
    if(!this.authService.isLoggedIn()){
      this.authService.logIn(this.logInFbForm.controls['name'].value, this.logInFbForm.controls['password'].value).subscribe(created => {
        if (created) {
          this.router.navigate(['']);
        } else {
          this.notifications.showWarning("User does not exist");
        }
      });
    }
  }

  ngOnInit(): void {
  }

  checkForm(name: string){
    return (formGroup: FormGroup) =>{
      const nameControl = formGroup.controls[name];
      if(nameControl.value == null) {
        return {valid: false}
      }
      return null;
    }
  }
}
