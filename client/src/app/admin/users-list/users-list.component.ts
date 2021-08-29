import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/user';
import { UserService } from 'src/app/shared/services';
import { PAGNATION_PAGE} from '../../../environments/environment';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  data: User[] = [];
  pageN:number=1;
  total!:number;
  perPage:number=PAGNATION_PAGE;
filterForm = new FormGroup({
  search: new FormControl('', [Validators.required]),
});
get search(): AbstractControl {
  return this.filterForm.get('search')!;
}

searchUser(){
  this.pageN=1;
  this.userService.search(this.filterForm.value.search)
  .subscribe((res: any) => {
   this.data = res.data;
   this.total=res.total;
    console.log(res);

  }, err => {
    console.log(err);
  });
}
constructor(   
  private  userService:UserService,
   private router: Router,
   private http: HttpClient

   ) { }

  
 ngOnInit(): void {
   this.userService.getAllUsers()
   .subscribe((res: any) => {
    this.data = res.data;
    this.total=res.total;
    //this.properties=res.properties;
     console.log(res);

   }, err => {
     console.log(err);
   });
 }




  delete(id:string){
    this.userService.deleteUser(id)
    .subscribe((res: any) => {
      this.data = res;
      console.log(this.data);
     this.refresh();
    }, err => {
      console.log(err);
    });
  }

  refresh(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }


  back(){
    let page=this.pageN-1
    if(page>0){
      this.pageN=page;
      this.userService.getAllUsers(page-1)
      .subscribe((res: any) => {
        this.data = res.data;
        this.total=res.total;
   
      }, err => {
        console.log(err);
      });
    }

    }

    forward(){
       this.userService.getAllUsers(this.pageN)
        .subscribe((res: any) => {
          if(res.data.length){
            this.pageN=this.pageN+1;
            this.data = res.data;
            this.total=res.total;
          }
          console.log(res);
     
        }, err => {
          console.log(err);
        });
      
  
      }
 
  

}
