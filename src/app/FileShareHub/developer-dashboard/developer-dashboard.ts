import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FileService } from '../service/file.service';


@Component({
  selector: 'app-developer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './developer-dashboard.html',
  styleUrls: ['./developer-dashboard.css'],
})
export class DeveloperDashboard {
 title: string = '';
  description: string = '';
  selectedFile!: File;
  files: any[] = [];
  developerEmail: string = '';

  constructor(
    private fileService: FileService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFiles();

    // agar login ke time email store kar rahe ho to ye kaam karega
    this.developerEmail = localStorage.getItem('email') || '';
  }

  // Select file
  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Upload file
  uploadFile() {

    if (!this.selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('file', this.selectedFile);

    this.fileService.uploadFile(formData).subscribe({
      next: () => {
        alert('File uploaded successfully');
        this.title = '';
        this.description = '';
        this.selectedFile = undefined as any;
        this.loadFiles();
      },
      error: (err) => {
        alert(err.error?.message || 'Upload failed');
      }
    });
  }

  // Load all files
  loadFiles() {
    this.fileService.getFiles().subscribe({
      next: (res: any) => {
        this.files = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Delete file
  deleteFile(id: string) {

    if (!confirm('Are you sure you want to delete this file?')) return;

    this.fileService.deleteFile(id).subscribe({
      next: () => {
        alert('File deleted');
        this.loadFiles();
      },
      error: (err) => {
        alert(err.error?.message || 'Delete failed');
      }
    });
  }

  // Logout
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
