import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sing-up-page.html',
  styleUrls: ['./sing-up-page.css'],
})
export class SingUpPage {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required],
    });
    
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      alert('Please fill all required fields correctly');
      return;
    }

    this.auth.signup(this.signupForm.value).subscribe({
      next: () => {
        alert("Signup Successful! Redirecting to login...");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const message = err.error?.message || 'Signup failed';
        alert(message);
        console.error('Signup error:', err);
      }
    });
  }

  
}
