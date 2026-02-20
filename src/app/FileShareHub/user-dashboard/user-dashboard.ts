import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export class UserDashboard implements OnInit {

  files: any[] = [];
  userName: string = '';
  userEmail: string = '';
  isLoading: boolean = false;
  isLoadingMore: boolean = false;
  errorMessage: string = '';
  isLoadingSlow: boolean = false;
  sidebarOpen: boolean = false;
  private loadingTimeout: any;
  private apiBaseUrl = 'https://backend-i8c3.onrender.com/';
  private hasLoadedOnce: boolean = false;
  
  // Pagination
  private currentPage: number = 1;
  private pageSize: number = 10;
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
      this.userName = localStorage.getItem('name') || 'User';
      this.userEmail = localStorage.getItem('email') || 'No email';
      console.log('User Email:', this.userEmail);
      
      const cachedFiles = localStorage.getItem('userFiles');
      if (cachedFiles) {
        try {
          this.files = JSON.parse(cachedFiles);
        } catch (e) {}
      }
      
      window.addEventListener('scroll', () => this.onScroll());
    }
    
    this.loadMore();
  }

  /** Load more files when user scrolls (pagination) */
  loadMore() {
    if (this.isLoadingNextPage || this.currentPage > this.totalPages) {
      return;
    }

    this.isLoadingNextPage = true;
    if (this.currentPage === 1) {
      this.isLoading = true;
    } else {
      this.isLoadingMore = true;
    }

    this.fileService.getFiles(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        console.log(`✅ Page ${this.currentPage} loaded`, res);
        console.log('Files received:', res.files);
        
        if (this.currentPage === 1) {
          this.files = res.files || [];
        } else {
          this.files = [...this.files, ...(res.files || [])];
        }
        
        console.log('Total files now:', this.files.length);
        console.log('Setting isLoading to false');
        
        this.totalPages = res.totalPages || 1;
        this.currentPage++;
        this.isLoadingNextPage = false;
        this.isLoading = false;
        this.isLoadingMore = false;
        
        console.log('isLoading:', this.isLoading);
        
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('userFiles', JSON.stringify(this.files));
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

  viewFile(fileUrl: string) {
    window.open(fileUrl, '_blank');
  }

  downloadFile(fileUrl: string, fileName: string) {
    let downloadUrl = fileUrl;
    if (fileUrl.includes('cloudinary.com') && fileUrl.includes('/upload/')) {
      downloadUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');
    }
    
    const url = this.getFileUrl(downloadUrl);
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
