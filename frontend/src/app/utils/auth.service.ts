import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post('http://localhost:3000/api' + '/login', {username: username, password: password}, {responseType: 'text'});
   }

   register(username: string, password: string) {
    return this.http.post('http://localhost:3000/api' + '/register', {username: username, password: password}, {responseType: 'text'});
   }

   logout() {
    return this.http.post('http://localhost:3000/api' + '/logout', {responseType: 'text', withCredentials: true});
   }
}
