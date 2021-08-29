import { Component, OnInit } from '@angular/core';
import { Property } from '../../shared/models/property';
import {  PropertyService,} from 'src/app/shared/services';
import { BASE_URL ,PAGNATION_PAGE} from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved-properties',
  templateUrl: './saved-properties.component.html',
  styleUrls: ['./saved-properties.component.css']
})
export class SavedPropertiesComponent implements OnInit {
  data: Property[] = [];
  base_url:String=BASE_URL;
  pageN:number=1;
  total!:number;
  perPage=PAGNATION_PAGE;
  constructor(
    private propertyService: PropertyService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.propertyService.getSavedProperties().subscribe(
      (res:any) => { 
        this.data=res.data;
        this.total=res.total;
       },
      err =>{
        console.log(err);

      }
    )
  }

  
  unsave(id:any){
   
      this.propertyService.unsaveProperty(id)
      .subscribe((res: any) => {
        console.log(res);
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
      this.propertyService.getSavedProperties(page-1)
      .subscribe((res: any) => {
        this.data = res.data;
        this.total=res.total;
   
      }, err => {
        console.log(err);
      });
    }

    }

    forward(){
      this.propertyService.getSavedProperties(this.pageN)
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
