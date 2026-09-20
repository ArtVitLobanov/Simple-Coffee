import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BackendRequestService } from './backend-request-service';
import { DataModels } from '../data-models/data-models';

// This service provides the persistent user information for components

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    username = ''
    password = ''
    errorMessage = signal<string>('')

    isLoggedIn = signal<boolean>(false);
    isAdmin = signal<boolean>(false);
    userProfile = signal<DataModels.UserProfileData | undefined>(undefined)

  constructor(
    private backendService: BackendRequestService,
    ) {}

  authUser() {
    const savedName = localStorage.getItem("username")
    const savedPassword = localStorage.getItem("password")

    if (savedName && savedPassword) {
        this.username = savedName
        this.password = savedPassword
        this.loginUser(this.username, this.password)
    } else {
        this.errorMessage.set("No cached login info found. Fill fields, please")
    }
  }

  loginUser(username:string, password:string): void {
    this.errorMessage.set('');

    if (!username || !password) {
      this.errorMessage.set('Please fill in both fields')
      return
    }
    
    this.backendService.authUser(username, password).subscribe({
    next: (res) => {
      if (res.status === 200) {
        this.errorMessage.set('')
        this.isLoggedIn.set(true);
          
        // User browser cache
        this.username = username
        this.password = password
        localStorage.setItem('username', this.username);
        localStorage.setItem('password', this.password);

        this.checkAdminStatus()
        this.fetchProfile()
      }
    },
    error: (err) => {
      const errorMsg = err.error?.message || 'Invalid credentials or server error';
      this.errorMessage.set(errorMsg);
      this.logoutUser();
    }
    });
  }

    logoutUser(): void {
        this.isLoggedIn.set(false);
        this.isAdmin.set(false)
        this.username = '';
        this.password = '';
        localStorage.removeItem('username');
        localStorage.removeItem('password');
    }

    fetchProfile(): void {
        this.errorMessage.set('');

        this.backendService.getUserProfile().subscribe({
            next: (userProfile) => {
                this.userProfile.set(userProfile);
            },
            error: (err) => {
                this.errorMessage.set(err.message || 'Could not fetch user profile');
            }
        });
    }

  getUserName() {
    return this.username
  }

  getErrorMessage(){
    return this.errorMessage()
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn()
  }

  checkAdminStatus() {
    this.backendService.isAdmin().subscribe({
        next: (userAdmin) => {
            this.isAdmin.set(userAdmin)
        },
        error: () => {
            this.isAdmin.set(false)
        }
    })
  }

  isUserAdmin(): boolean {
    return this.isAdmin()
  }

}