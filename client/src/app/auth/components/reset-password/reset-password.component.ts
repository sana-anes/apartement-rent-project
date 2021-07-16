import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  errorMessage: string | null='';
  successMessage: string | null='';
  resetToken: null;
  CurrentState: any;


 
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.CurrentState = 'Wait';
    this.route.params.subscribe(params => {
      this.resetToken = params.token;
      console.log(this.resetToken);
      console.log(this.resetPasswordForm.value);
      this.VerifyToken();
    });
  }

  VerifyToken() {
    this.authService.ValidPasswordToken(this.resetToken).subscribe(
      data => {
        this.CurrentState = 'Verified';
      },
      err => {
        this.CurrentState = 'NotVerified';
      }
    );
  }
  resetPasswordForm = new FormGroup(
    {
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator])
    });
  
   get newPassword(): AbstractControl {
     return this.resetPasswordForm.get('newPassword')!;
   }
 
   get repeatPassword(): AbstractControl {
     return this.resetPasswordForm.get('repeatPassword')!;
   }

ngOnInit(): void {}

reset(){
  if (this.resetPasswordForm.valid) {
    const{newPassword}=this.resetPasswordForm.value;
    this.authService.newPassword(this.resetToken,newPassword).subscribe(
      data => {
        this.resetPasswordForm.reset();
        this.errorMessage = null;
        this.successMessage = data.message;
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



 passwordsMatchValidator(control: FormControl): ValidationErrors | null {
  const password = control.root.get('newPassword');
  
  return password && control.value !== password.value
    ? {
        passwordMatch: true,
      }
    : null;
}

}
