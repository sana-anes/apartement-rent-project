import { Component, OnInit } from '@angular/core';
import { Property } from '../../shared/models/property';
import { PropertyService, UserService } from 'src/app/shared/services';
import { BASE_URL } from '../../../environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  data: Property[] = [];
  base_url:String=BASE_URL;
  savedProperties:string[]=[];
  constructor(
    private propertyService: PropertyService,
    private userService: UserService, 
    private router: Router,

  ) { }

  ngOnInit(): void {

    this.propertyService.getOtherProperties()
    .subscribe((res: any) => {
      this.data = res;
      console.log(this.data);
    }, err => {
      console.log(err);
    });

  
    this.userService.getSavedProperties().subscribe(
      data => { 
        this.savedProperties=data.savedProperties;
        console.log(this.savedProperties);

       },
      err =>{
        console.log(err);

      }
    )
  }


  save(id:any){
    if(this.savedProperties.includes(id)){
      this.propertyService.unsaveProperty(id)
      .subscribe((res: any) => {
        this.data = res;
        console.log(this.data);



        
      }, err => {
        console.log(err);
      });

    }else{
      this.propertyService.saveProperty(id)
      .subscribe((res: any) => {
        this.data = res;
        console.log(this.data);
      }, err => {
        console.log(err);

    });
    }
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }


}
