import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Users } from '../models/users.models';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  constructor() { }

  private userSubject = new BehaviorSubject<Users>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  setUser(user: Users) {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUserFromStorage(): Users {
    const userSession = sessionStorage.getItem('user');
    return userSession ? JSON.parse(userSession) : null;
  }
}
