import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { ItemsService } from '../services/items.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  form: FormGroup;
  user = new User();
  private failedLoginSubject$ = new BehaviorSubject<boolean>(false);
  failedLogin$ = this.failedLoginSubject$.asObservable();

  constructor(
    private itemsService: ItemsService,
    private router: Router, private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder) {

    this.form = fb.group( {
      username: ['TestUser', [Validators.minLength(5),
        Validators.maxLength(20), Validators.pattern('[a-zA-Z0-9]+$'), Validators.required]],
      password: ['Testpassword123', [Validators.minLength(5),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
    });
  }

  loading$ = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
  }


async login() {
    this.loading$.next(true);
    const val = this.form.value;
    try {
      const result = await this.userService.loginUser(val.username, val.password);
      this.initOnUserLogin(result);
      // this.loading$.next(false);
      this.router.navigateByUrl('/home');
    }
    catch (err) {
      if (err) {
        this.failedLoginSubject$.next(true);
        this.loading$.next(false);
      }
     }
  }

  async signup(){
    this.loading$.next(false);
    const val = this.form.value;
    try {
      const result = await this.userService.signNewUser(val.username, val.password);
      this.loading$.next(false);
    }
    catch (err) {
      if (err) {
        this.failedLoginSubject$.next(true);
        this.loading$.next(false);
      }
     }
  }

  initOnUserLogin(result: any){
    localStorage.setItem('authJwtToken', result.accessToken);
    console.log('Successfully logged in'); // Remove after testing
    this.itemsService.initItems();
  }



}
