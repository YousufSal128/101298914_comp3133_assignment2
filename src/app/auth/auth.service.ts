import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private injector = inject(Injector);

  login(username: string, password: string): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      const apollo = inject(Apollo);
      const LOGIN = gql`
        query Login($username: String!, $password: String!) {
          login(username: $username, password: $password)
        }
      `;
      return apollo.query({
        query: LOGIN,
        variables: { username, password }
      });
    });
  }
  

  signup(username: string, email: string, password: string): Observable<any> {
    return runInInjectionContext(this.injector, () => {
      const apollo = inject(Apollo);
      const SIGNUP = gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password)
        }
      `;
      return apollo.mutate({
        mutation: SIGNUP,
        variables: { username, email, password },
      });
    });
  }
  
  

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
