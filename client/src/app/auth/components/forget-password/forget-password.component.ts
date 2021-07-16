import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  errorMessage :string | null= '';
  successMessage :string | null= '';

  forgetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get email(): AbstractControl {
    return this.forgetPasswordForm.get('email')!;
  }

  constructor(
    private authService: AuthService, 
    private router: Router
  ) { }
 
  ngOnInit(): void {
  }

  resetPassword(){

    if (this.forgetPasswordForm.valid) {
      const{email}=this.forgetPasswordForm.value;
      this.authService.requestReset(email).subscribe(
        data => {
          this.forgetPasswordForm.reset();
          this.errorMessage = null;
          this.successMessage = "Reset password link send to the email sucessfully.";
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigateByUrl('/auth/login');
          }, 6000);
        },
        err => {
          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    }
  }

}
