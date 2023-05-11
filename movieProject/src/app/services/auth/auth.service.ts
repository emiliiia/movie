import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {FormUser} from "../../interface/form-user";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser!: FormUser;
  private savedUsers: FormUser[] = [];

  constructor() {
    const storedObject = localStorage.getItem('currentUser');
    if (storedObject) {
      this.currentUser = JSON.parse(storedObject);
    }

    const savedObjects = localStorage.getItem('savedUsers');
    if (savedObjects) {
      this.savedUsers = JSON.parse(savedObjects);
    }
  }

  updateUser(password: string, role: string): Observable<boolean> {
    let updated = false;
    const index = this.savedUsers.findIndex(u => u.password === password);
    const user = this.savedUsers.find(u => u.password === password);
    if (user !== undefined) {
      user.role = role;
      this.savedUsers[index] = user;
      updated = true;
    }
    localStorage.setItem('savedUsers', JSON.stringify(this.savedUsers));
    return of(updated);
  }

  getUserByPassword(password: string): Observable<FormUser | undefined> {
    const user = this.savedUsers.find(u => u.password === password);
    return of(user);
  }

  getAllUsers(): FormUser[]{
    return this.savedUsers;
  }

  //Реєстрація -- додавання юзера в загальний список з усіма юзерами
  register(user: FormUser): Observable<boolean> {
    let saved = false;

    for(let i = 0; i < this.savedUsers.length; i++){
      if(this.savedUsers[i].password === user.password){
        return of(saved);
      }
    }

    this.savedUsers.push(user);
    localStorage.setItem('savedUsers', JSON.stringify(this.savedUsers));
    saved = true;
    return of(saved);
  }

  //Видалення currentUser
  logout(): Observable<boolean> {
    let saved = false;
    localStorage.removeItem('currentUser');
    return of(saved);
  }

  //створення об'єкта currentUser
  logIn(name: string, password: string): Observable<boolean>{
    let saved = false;
    for(let i = 0; i < this.savedUsers.length; i++){
      if(this.savedUsers[i].password === password && this.savedUsers[i].name === name){
        localStorage.setItem('currentUser', JSON.stringify(this.savedUsers[i]));
        saved = true;
      }
    }
    return of(saved);
  }

  //перевіряємо чи такий юзер існує
  userExist(name: string, password: string): boolean {
    for(let i = 0; i < this.savedUsers.length; i++){
      if(this.savedUsers[i].password === password && this.savedUsers[i].name === name){
        return true;
      }
    }
    return false;
  }

  isLoggedIn(): boolean{
    return this.currentUser !== undefined;
  }

  ifUniqueName(name: string): boolean{
    for(let i = 0; i < this.savedUsers.length; i++){
      if(this.savedUsers[i].name === name){
        return false;
      }
    }
    return true;
  }

  ifUniquePassword(password: string): boolean{
    for(let i = 0; i < this.savedUsers.length; i++){
      if(this.savedUsers[i].password === password){
        return false;
      }
    }
    return true;
  }

  getCurrentUser(): any {
    // Повертаємо дані поточного користувача
    return this.currentUser;
  }

  getCurrentUserRole(): string | null {
    // Повертаємо роль поточного користувача
    if (this.currentUser) {
      return this.currentUser.role;
    } else {
      return null;
    }
  }

  getCurrentUserName(): string | null {
    // Повертаємо роль поточного користувача
    if (this.currentUser) {
      return this.currentUser.name;
    } else {
      return null;
    }
  }

  getCurrentUserPassword(): string | null {
    // Повертаємо роль поточного користувача
    if (this.currentUser) {
      return this.currentUser.password;
    } else {
      return null;
    }
  }

}
