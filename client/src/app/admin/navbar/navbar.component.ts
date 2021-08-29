import { BreakpointObserver,  BreakpointState } from '@angular/cdk/layout';
import { BASE_URL } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { AuthService, TokenStorageService } from 'src/app/auth/services';
import { UserService } from 'src/app/shared/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentMember: any;
  users:any;
  base_url:string=BASE_URL;
  isMobile:boolean=false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private userService: UserService, 
    private token: TokenStorageService,
  ) { }

  ngOnInit(): void {

    this.breakpointObserver
    .observe(['(min-width: 768px)'])
    .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobile=false;
        } else {
          this.isMobile=true;        }
    })

    this.currentMember = this.token.getUser();

  }

  logout(){
    this.authService.logout();
  }

}
