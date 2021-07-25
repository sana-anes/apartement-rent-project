import {
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AuthService ,
  TokenStorageService
} from '../../services';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage = '';
  isAdmin:boolean=false;
  role:string=''

  constructor(
    private authService: AuthService, 
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  
  get email(): AbstractControl {
    return this.loginForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.loginForm.get('password')!;
  }

   login(): void {
    const {  email, password } = this.loginForm.value;
    this.authService.login(email!,password!).subscribe(
      data => {
        console.log(data.accessToken);
        console.log(data.user);

        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data.user);
        ;
        this.isAdmin = this.tokenStorage.getUser().isAdmin;
        this.isAdmin?(this.role ='admin'):(this.role ='user');
        if(!this.isAdmin) this.router.navigateByUrl('/user');
      },
      err => {
        this.errorMessage = err.error.message;
        setTimeout(() => {
          this.errorMessage ='';
        }, 6000)

      }
    );

   }
   ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.router.navigateByUrl('/user');
    }
  }



}
