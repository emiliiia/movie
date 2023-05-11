import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NotificationsService} from "../services/notifications/notification.service";
import {AuthService} from "../services/auth/auth.service";
import {FormUser} from "../interface/form-user";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit{

  constructor(private fb: FormBuilder,
              private router: Router,
              private notifications: NotificationsService,
              private authService: AuthService) {
  }

  hide = true;
  disablBool: boolean = true;

  userFbForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
      confirmPassword: ['', Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]
  },
    {
      validators: this.checkPassword("password", "confirmPassword")
    });

  onSubmit() {

    let newUser: FormUser;
    newUser = {
      name: this.userFbForm.controls['name'].value,
      password: this.userFbForm.controls['password'].value,
      role: 'user'
    }

    /********************DATASERVICE**************/
    if(!this.authService.isLoggedIn()){
      if(!this.authService.ifUniqueName(newUser.name)){
        this.notifications.showWarning("User with this name already exists");
      }
      else if(!this.authService.ifUniquePassword(newUser.password)){
        this.notifications.showWarning("User with this password already exists");
      }
      else {
        this.authService.register(newUser).subscribe(saved => {
          if(saved){
            this.userFbForm.reset();
            this.notifications.showSuccess('User saved successfully');
            this.router.navigate(['/authorization']);
          }
          else {
            this.notifications.showError('Failed to save user');
          }
        });
      }
    }
  }

  ngOnInit(): void {
  }

  checkPassword(password: string, confirmPassword: string){
    return (formGroup: FormGroup) =>{
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];
      if(passwordControl.value !== confirmPasswordControl.value) {
        return {valid: false}
      }
      return null;
    }
  }
}
