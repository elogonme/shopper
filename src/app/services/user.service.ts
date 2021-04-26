import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  private serverUrl = 'http://shopperserver-env.eba-ycg2eh3f.eu-west-1.elasticbeanstalk.com';
  // private serverUrl = environment.backend_url;

  constructor(private http: HttpClient) {}

  async loginUser(username: string, password: string): Promise<any> {
    return await this.http
      .post(
        this.serverUrl + '/auth/signin',
        new HttpParams().set('username', username).set('password', password)
      )
      .toPromise();
  }

  async signNewUser(username: string, password: string): Promise<any> {
    return await this.http
      .post(
        this.serverUrl + '/auth/signup',
        new HttpParams().set('username', username).set('password', password)
      )
      .toPromise();
  }
}
