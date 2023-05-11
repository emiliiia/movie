import { Component } from '@angular/core';
import {AuthService} from "../services/auth/auth.service";
import {FormUser} from "../interface/form-user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationsService} from "../services/notifications/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent {
  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private notifications: NotificationsService,
              private router: Router) {
  }

  options = [
    { label: 'Admin', value: 'admin' },
    { label: 'Moderator', value: 'moderator' },
    { label: 'User', value: 'user' }
  ];

  userUpdateFbForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]]
    },
    {
      validators: this.checkForm("name")
    });

  displayedColumns: string[] = ['name', 'role', 'update'];
  dataSource = this.authService.getAllUsers();
  clickedRows = new Set<FormUser>();

  ngOnInit(){
    if(this.authService.getCurrentUserRole() !== "admin"){
      this.router.navigate(['']);
    }
  }

  onSubmit() {
      /********************DATASERVICE**************/
      this.authService.updateUser(
        this.userUpdateFbForm.controls['password'].value, this.userUpdateFbForm.controls['role'].value,
      ).subscribe(updated => {
        if (updated) {
          this.notifications.showSuccess('User updated successfully');
        } else {
          this.notifications.showError('Failed to update user');
        }
      });
  }

  getData(password: string) {
    /********************DATASERVICE**************/
    this.authService.getUserByPassword(password).subscribe(user => {
      if (user) {
        this.notifications.showSuccess('user successfully received');
        this.userUpdateFbForm.controls['name'].setValue(user.name);
        this.userUpdateFbForm.controls['password'].setValue(user.password);
        this.userUpdateFbForm.controls['role'].setValue(user.role);
      }
      else{
        this.notifications.showError('Failed to get user');
      }
    });
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
