import { RouterModule, Routes } from '@angular/router';
import { AddPropertyComponent } from './add-property/add-property.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { ReservationComponent } from './reservation/reservation.component';
import {PropertiesListComponent } from './properties-list/properties-list.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { AccountComponent } from './account/account.component';
import { PropertyReservationsComponent } from './property-reservations/property-reservations.component';
import { SavedPropertiesComponent } from './saved-properties/saved-properties.component';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';

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
          {
            path: 'editProperty/:id',
            component: EditPropertyComponent,
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
            path: 'propertyReservations/:id',
            component: PropertyReservationsComponent,
          },
          {
            path: 'savedProperties',
            component:SavedPropertiesComponent,
          },
          {
            path: '**',
            component: PageNotFoundComponent,
          }
     
    ],
  },
];

export const MemberRoutingModule = RouterModule.forChild(routes);

