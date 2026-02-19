import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export class DeveloperDashboard implements OnInit {
  title: string = '';
  description: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';
  files: any[] = [];
  developerName: string = '';
  developerEmail: string = '';
  isUploading: boolean = false;
  isLoading: boolean = false;
  isLoadingMore: boolean = false;
  errorMessage: string = '';
  isLoadingSlow: boolean = false;
  sidebarOpen: boolean = false;
  private loadingTimeout: any;
  private hasLoadedOnce: boolean = false;
  private apiBaseUrl = 'https://backend-i8c3.onrender.com/';

  // Pagination
  private currentPage: number = 1;
  private pageSize: number = 10; // Increased for faster loading
  private totalPages: number = 1;
  private isLoadingNextPage: boolean = false;

  constructor(
    private fileService: FileService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.developerName = localStorage.getItem('name') || 'Developer';
      this.developerEmail = localStorage.getItem('email') || '';
      
      // Load cached files for instant display
      const cachedFiles = localStorage.getItem('devFiles');
      if (cachedFiles) {
        try {
          this.files = JSON.parse(cachedFiles);
          console.log('✅ Loaded from cache');
        } catch (e) {}
      }
      
      // Listen to scroll events for infinite scroll
      window.addEventListener('scroll', () => this.onScroll());
    }
    
    // Load fresh data from server
    this.loadMore();
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      if (this.selectedFile) {
        this.selectedFileName = this.selectedFile.name;
      }
    }
  }

  uploadFile() {
    if (!this.title.trim()) {
      alert('Please enter a file title');
      return;
    }

    if (!this.selectedFile) {
      alert('Please select a file');
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('file', this.selectedFile);

    this.fileService.uploadFile(formData).subscribe({
      next: () => {
        alert('✅ File uploaded successfully!');
        this.title = '';
        this.description = '';
        this.selectedFile = null;
        this.selectedFileName = '';
        this.isUploading = false;
        // Force refresh to get new file
        this.refreshFiles();
      },
      error: (err) => {
        console.error('Upload error:', err);
        alert(err.error?.message || 'Upload failed');
        this.isUploading = false;
      }
    });
  }

  /** Load more files when user scrolls (pagination) */
  loadMore() {
    // Prevent duplicate requests
    if (this.isLoadingNextPage || this.currentPage > this.totalPages) {
      return;
    }

    this.isLoadingNextPage = true;
    if (this.currentPage === 1) {
      this.isLoading = true; // Show loading only for first page
    } else {
      this.isLoadingMore = true; // Show loading more for subsequent pages
    }

    this.fileService.getFiles(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        console.log(`✅ Page ${this.currentPage} loaded`, res);
        console.log('Files received:', res.files);
        
        // For first page, replace; for others, append
        if (this.currentPage === 1) {
          this.files = res.files || [];
        } else {
          this.files = [...this.files, ...(res.files || [])];
        }
        
        console.log('Total files now:', this.files.length);
        console.log('Setting isLoading to false');
        
        // Update pagination info
        this.totalPages = res.totalPages || 1;
        this.currentPage++;
        this.isLoadingNextPage = false;
        this.isLoading = false;
        this.isLoadingMore = false;
        
        console.log('isLoading:', this.isLoading);
        
        // Cache for instant display next time
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('devFiles', JSON.stringify(this.files));
        }
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading files:', err);
        this.isLoadingNextPage = false;
        this.isLoading = false;
        this.isLoadingMore = false;
        if (this.currentPage === 1) {
          this.errorMessage = 'Failed to load files. Please try again.';
        }
      }
    });
  }

  /** Detect when user scrolls near bottom */
  onScroll() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Calculate if user is near bottom (within 200px)
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (pageHeight - scrollPosition < 200 && !this.isLoadingNextPage) {
      this.loadMore();
    }
  }

  /** Refresh files from server by force */
  refreshFiles() {
    this.currentPage = 1;
    this.totalPages = 1;
    this.errorMessage = '';
    this.loadMore();
  }

  deleteFile(id: string) {
    if (!confirm('⚠️ Are you sure you want to delete this file? This action cannot be undone.')) return;

    this.fileService.deleteFile(id).subscribe({
      next: () => {
        alert('✅ File deleted successfully!');
        // Force refresh after delete
        this.refreshFiles();
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert(err.error?.message || 'Delete failed');
      }
    });
  }

  getFileUrl(fileUrl: string): string {
    if (!fileUrl) return '';
    
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return fileUrl;
    }
    
    if (fileUrl.startsWith('/uploads/')) {
      return 'https://backend-i8c3.onrender.com' + fileUrl;
    }
    
    return 'https://backend-i8c3.onrender.com' + fileUrl;
  }

  isImageFile(fileName: string): boolean {
    if (!fileName) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const lowerFileName = fileName.toLowerCase();
    return imageExtensions.some(ext => lowerFileName.endsWith(ext));
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  downloadFile(fileUrl: string, fileName: string) {
    const url = this.getFileUrl(fileUrl);
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      })
      .catch(err => console.error('Download error:', err));
  }
}
