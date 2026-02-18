import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
})
export class LoginPage {
  loginForm: FormGroup;
  developerMode = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      accessCode: ['']
    });

    const role = this.route.snapshot.queryParamMap.get('role');
    this.developerMode = role === 'developer';
    this.updateAccessCodeValidator();
  }

  setDeveloperMode(flag: boolean) {
    this.developerMode = flag;
    this.updateAccessCodeValidator();
  }

  private updateAccessCodeValidator() {
    const ctrl = this.loginForm.get('accessCode');
    if (!ctrl) return;
    if (this.developerMode) {
      ctrl.setValidators([Validators.required]);
    } else {
      ctrl.clearValidators();
    }
    ctrl.updateValueAndValidity();
  }

  onLogin() {
    if (this.loginForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const { email, password, accessCode } = this.loginForm.value;

    const payload: any = {
      email,
      password
    };

    // developer login ho to accessCode bhi bhejo
    if (this.developerMode) {
      payload.accessCode = accessCode;
    }

    this.auth.login(payload).subscribe({
      next: (res: any) => {

        const role = res.role;

        // Developer mode check
        if (this.developerMode && role !== 'developer') {
          alert('This account is not registered as a developer.');
          return;
        }

        if (!this.developerMode && role === 'developer') {
          alert('Please use Developer Login for developer accounts.');
          return;
        }

        if (role === 'developer') {
          this.router.navigate(['/developer']);
        } else {
          this.router.navigate(['/user']);
        }

      },
      error: (err) => {
        const message = err.error?.message || 'Login failed';
        alert(message);
        console.error('Login error:', err);
      }
    });
  }

}

