import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { ReservationComponent } from './reservation/reservation.component';
import {PropertiesListComponent } from './properties-list/properties-list.component';

const routes: Routes = [
  {
        path: '',
        component: MainComponent,
    
        children: [
          {
            path: '',
            component: HomeComponent,
          },
          {
            path: 'account',
            component: AccountComponent,
          },
          {
            path: 'reservations',
            component: ReservationComponent,
          },
          {
            path: 'add-property',
            component: AddPropertyComponent,
          },
          {
            path: 'properties',
            component: PropertiesListComponent,
          },
          // {
          //   path: 'admin',
          //   loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule),
          // },
             // {
          //   path: 'user',
          //   loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule),
          // },
    ],
  },
];

export const MemberRoutingModule = RouterModule.forChild(routes);

