import { Routes } from '@angular/router';
import { SingUpPage } from './FileShareHub/sing-up-page/sing-up-page';
import { LoginPage } from './FileShareHub/login-page/login-page';
import { DeveloperDashboard } from './FileShareHub/developer-dashboard/developer-dashboard';
import { UserDashboard } from './FileShareHub/user-dashboard/user-dashboard';


export const routes: Routes = [
  { path: '', pathMatch: 'full', component: SingUpPage },
  { path: 'login', component: LoginPage },
  { path: 'developer', component: DeveloperDashboard },
  { path: 'user', component: UserDashboard },
];
