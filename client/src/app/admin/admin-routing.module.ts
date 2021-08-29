import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ReservationComponent } from './reservation/reservation.component';
import {PropertiesListComponent } from './properties-list/properties-list.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { AccountComponent } from './account/account.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ContentComponent } from './content/content.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
        path: '',
        component: MainComponent,
    
        children: [
          {
            path: '',
            component: PropertiesListComponent,
          },
          {
            path: 'reservations',
            component: ReservationComponent,
          },

          {
            path: 'properties',
            component: PropertiesListComponent,
          },
          {
            path: 'propertyDetails/:id',
            component: PropertyDetailsComponent,
          },
          {
            path: 'account',
            component: AccountComponent,
          },
          {
            path: 'users',
            component: UsersListComponent,
          },
          {
            path: 'content',
            component: ContentComponent,
          },
          {
            path: 'feedback',
            component: FeedbackComponent,
          },


 
    ],
  },
];

export const AdminRoutingModule = RouterModule.forChild(routes);

