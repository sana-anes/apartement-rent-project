import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { UserService } from 'src/app/shared/services';
@Component({
  selector: 'security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  errorMessage:string='';
  successMessage:string='';

  passwordForm = new FormGroup({
    old_password: new FormControl('', [Validators.required]),
    new_password: new FormControl('', [Validators.required,Validators.minLength(6)]),
    confirm_password: new FormControl('', [Validators.required, this.passwordsMatchValidator]),
  });

  get old_password(): AbstractControl {
    return this.passwordForm.get('old_password')!;
  }
  get new_password(): AbstractControl {
    return this.passwordForm.get('new_password')!;
  }

  get confirm_password(): AbstractControl {
    return this.passwordForm.get('confirm_password')!;
  }

  passwordsMatchValidator(control: FormControl): ValidationErrors | null {
    const password = control.root.get('new_password');
    return password && control.value !== password.value
      ? {
          passwordMatch: true,
        }
      : null;
  }
  constructor(  
    private userService: UserService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }
  save(){
     console.log(this.passwordForm.value)
     const{old_password,new_password}=this.passwordForm.value;
     this.userService.updatePassword(old_password,new_password)
      .subscribe((res: any) => {
        console.log(res);
        this.errorMessage = '';
        this.successMessage = res.message;  
        setTimeout(() => {
            this.refresh();
        }, 2000);   
  
      }, err => {
        if (err.error.msg) {
          this.errorMessage = err.error.msg[0].message;
        }
        if (err.error.message) {
          this.errorMessage = err.error.message;
        }    
        setTimeout(() => {
          this.errorMessage ='';
        }, 6000)    });
     
  }
  refresh(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
