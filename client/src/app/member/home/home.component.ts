import { BASE_URL } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { AuthService, TokenStorageService } from 'src/app/auth/services';
import { UserService } from 'src/app/shared/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: any;
  users:any;
  base_url:string=BASE_URL;
  constructor(
    private authService: AuthService,
    private userService: UserService, 
    private token: TokenStorageService,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();

    this.userService.getUserInfo().subscribe(
      data => { 
        console.log(data);
       },
      err =>{
        console.log(err);

      }
    )
  
  }

  logout(){
    this.authService.logout();
  }


}
