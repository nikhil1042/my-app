import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SingUpPage } from './FileShareHub/sing-up-page/sing-up-page';
import { LoginPage } from './FileShareHub/login-page/login-page';
import { DeveloperDashboard } from './FileShareHub/developer-dashboard/developer-dashboard';
import { UserDashboard } from './FileShareHub/user-dashboard/user-dashboard';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('my-app');
}
