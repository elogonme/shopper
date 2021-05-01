import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { UserComponent } from './user/user.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './user/auth.interceptor';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
  },

  {
    path: 'new',
    component: NewComponent,
  },
  {
    path: 'login',
    component: UserComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  // {
  //   path: 'exit',
  //   component: HomeComponent
  // },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AppRoutingModule {}
