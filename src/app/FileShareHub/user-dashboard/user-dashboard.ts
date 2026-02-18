import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css'],
})
export class UserDashboard {

  files: any[] = [];
  userName: string = '';
  userEmail: string = '';

  constructor(
    private fileService: FileService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // user info load
    this.userName = localStorage.getItem('name') || 'User';
    this.userEmail = localStorage.getItem('email') || '';

    // files load
    this.loadFiles();
  }

  loadFiles() {
    this.fileService.getFiles().subscribe({
      next: (res: any) => {
        this.files = res;
      },
      error: (err) => {
        console.error('Error loading files:', err);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
