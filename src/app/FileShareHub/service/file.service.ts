import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
   private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData) {
    return this.http.post(`${this.api}/files/upload`, formData);
  }

  getFiles() {
    return this.http.get(`${this.api}/files`);
  }

  deleteFile(id: string) {
    return this.http.delete(`${this.api}/files/${id}`);
  }
}
