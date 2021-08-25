import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { UserService } from 'src/app/shared/services';
import { User } from '../../shared/models/user';
import { TokenStorageService } from 'src/app/auth/services';

@Component({
  selector: 'personel-info',
  templateUrl: './personel-info.component.html',
  styleUrls: ['./personel-info.component.css']
})
export class PersonelInfoComponent implements OnInit {
  errorMessage:string='';
  successMessage:string='';
  data!: User;
  infoForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required,
                                Validators.pattern("^[0-9]*$"),
                                Validators.minLength(8)]),

  });

  get firstname(): AbstractControl {
    return this.infoForm.get('firstname')!;
  }
  get lastname(): AbstractControl {
    return this.infoForm.get('lastname')!;
  }

  get email(): AbstractControl {
    return this.infoForm.get('email')!;
  }
  get address(): AbstractControl {
    return this.infoForm.get('address')!;
  }
  get phone(): AbstractControl {
    return this.infoForm.get('phone')!;
  }

 
  constructor(
    private userService: UserService,
    private router: Router,
    private tokenStorage: TokenStorageService,

  ) { }

  ngOnInit(): void {
    this.userService. getUserInfo()
    .subscribe((res: any) => {
      this.data = res;
      this.infoForm.patchValue(res)
      console.log(this.data);
      if(!this.data.address && !this.data.phone) this.errorMessage="please complete your account informations";
      else this.errorMessage="";
    }, err => {
      if (err.error.msg) {
          this.errorMessage = err.error.msg[0].message;
      }
      if (err.error.message) {
          this.errorMessage = err.error.message;
      }    
      setTimeout(() => {
          this.errorMessage ='';
              }, 6000);  
  }  
);    
}
save(){
  this.errorMessage="";
  const user:User=this.infoForm.value;
   console.log(this.infoForm.value)
   this.userService.updateUser(user)
    .subscribe((res: any) => {
      console.log(res);
      this.errorMessage = '';
      this.successMessage = res.message;
      this.tokenStorage.saveUser(res.user);

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
