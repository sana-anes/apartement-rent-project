import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  errorMessage:string=''


  constructor(
    private authService: AuthService,
    private router: Router

    ) { }

  passwordsMatchValidator(control: FormControl): ValidationErrors | null {
    const password = control.root.get('password');
    return password && control.value !== password.value
      ? {
          passwordMatch: true,
        }
      : null;
  }


  registerForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required,Validators.minLength(6)]),
    repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator]),
  });


  get firstname(): AbstractControl {
    return this.registerForm.get('firstname')!;
  }
  get lastname(): AbstractControl {
    return this.registerForm.get('lastname')!;
  }

  get email(): AbstractControl {
    return this.registerForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.registerForm.get('password')!;
  }

  get repeatPassword(): AbstractControl {
    return this.registerForm.get('repeatPassword')!;
  }

  register(): void {
    const { firstname,lastname, email, password } = this.registerForm.value;
if(this.registerForm.valid){
    this.authService.register(firstname,lastname, email, password).subscribe(
      data => {
        this.errorMessage='';
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigateByUrl('/auth/login');
        }, 3000);

        console.log(data);
    
      },
      err => {
        if (err.error.msg) {
          this.errorMessage = err.error.msg[0].message;
        }
        if (err.error.message) {
          this.errorMessage = err.error.message;
        }    
        setTimeout(() => {
          this.errorMessage ='';
        }, 6000)
      
      
      }
    );
  }
} 
  
  ngOnInit(): void {
  }

}
