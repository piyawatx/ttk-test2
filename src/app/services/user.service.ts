import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:3000/users';
  constructor(private httpClient: HttpClient) {}

  getUsers() {
    return this.httpClient.get(this.url);
  }
  getUserById(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }
  create(user: any) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(user);
    return this.httpClient.post(this.url, body, { headers: headers });
  }

  update(user: any) {
    console.log('update ', user);

    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(user);
    return this.httpClient.put(this.url, body, { headers: headers });
  }

  delete(id: number) {
    return this.httpClient.delete(this.url + '/' + id);
  }
}
