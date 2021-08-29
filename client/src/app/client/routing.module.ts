import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SearchComponent } from './search/search.component';
import { HelpComponent } from './help/help.component';

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
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'contact',
        component: ContactUsComponent,
      },
      {
        path: 'help',
        component: HelpComponent,
      },
      {
        path: 'auth',
        loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule),
      },

    ],
  },
];

export const RoutingModule = RouterModule.forChild(routes);
