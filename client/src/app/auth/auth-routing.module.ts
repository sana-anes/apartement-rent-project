import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './components/container/container.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,

    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      { 
        path: 'forget-password',
        component: ForgetPasswordComponent 
        },
        {
          path: 'reset-password/:token',
          component: ResetPasswordComponent,
        },
          // {
          //   path: '**',
          //   redirectTo: 'pageNotFound'
          // }
    
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
