import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class UserService {
  private serverUrl = 'https://items-server.uk.r.appspot.com:3000';
  // private serverUrl = '';

  constructor(private http: HttpClient) { }

async loginUser(username: string, password: string): Promise<any> {
  return await this.http.post(this.serverUrl + '/auth/signin',
  new HttpParams().set('username', username).set('password', password)
  ).toPromise();
}

async signNewUser(username: string, password: string): Promise<any> {
  return await this.http.post(this.serverUrl + '/auth/signup',
  new HttpParams().set('username', username).set('password', password)
  ).toPromise();
}
}
