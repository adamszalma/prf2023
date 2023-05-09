import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private http: HttpClient) { }

  getPets() {
    return this.http.get('http://localhost:3000/api' + '/pets');
  }

  deletePet(id: string) {
    return this.http.request('delete', 'http://localhost:3000/api' + '/pets', {body: {id: id}, responseType: 'text'});
  }

  newPet(petType: string, petName: string) {
    return this.http.post('http://localhost:3000/api' + '/pets', {petType: petType, petName:petName}, {responseType: 'text'});
  }

  updatePet(id: string, petType: string, petName: string) {
    return this.http.put('http://localhost:3000/api' + '/pets', {id: id, petType: petType, petName:petName}, {responseType: 'text'});
  }
}
