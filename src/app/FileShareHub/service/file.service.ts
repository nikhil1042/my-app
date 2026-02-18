import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface FileModel {
  _id: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ======================
  // Upload File (Developer Only)
  // ======================
  uploadFile(formData: FormData): Observable<FileModel> {
    return this.http.post<FileModel>(
      `${this.apiUrl}/files/upload`,
      formData
    );
  }

  // ======================
  // Get All Files
  // ======================
  getFiles(): Observable<FileModel[]> {
    return this.http.get<FileModel[]>(
      `${this.apiUrl}/files`
    );
  }

  // ======================
  // Delete File (Developer Only)
  // ======================
  deleteFile(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/files/${id}`
    );
  }

}



