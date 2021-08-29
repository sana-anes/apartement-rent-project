import { Property } from '../../shared/models/property';
import { Component, OnInit } from '@angular/core';
import { PropertyService } from 'src/app/shared/services';
import { BASE_URL ,PAGNATION_PAGE} from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-property',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.css']
})
export class PropertiesListComponent implements OnInit {
  data: Property[] = [];
  base_url:string=BASE_URL;
  optionFilter:string="all";
  pageN:number=1;
  total!:number;
  perPage=PAGNATION_PAGE;
  constructor(
    private propertyService: PropertyService,
    private router: Router,
    ) { }


  option(e:string){
    this.optionFilter=e;
    this.pageN=1;
    this.propertyService.getPropertiesByStatus(e)
    .subscribe((res: any) => {
      this.data = res.data;
      this.total=res.total;
      console.log(res);

    }, err => {
      console.log(err);
    });
  }

  ngOnInit(): void {

    this.propertyService.getPropertiesByStatus(this.optionFilter)
    .subscribe((res: any) => {
      this.data = res.data;
    this.total=res.total;
      console.log(res);

    }, err => {
      console.log(err);
    });
  }

  delete(id:string){
    this.propertyService.deleteProperty(id)
    .subscribe((res: any) => {
      this.data = res;
      console.log(this.data);
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);    
    }, err => {
      console.log(err);
    });
  }

  
  back(){
    let page=this.pageN-1

    if(page>0){
      this.pageN=page;
      this.propertyService.getPropertiesByStatus(this.optionFilter,page-1)
      .subscribe((res: any) => {
        this.data = res.data;
        this.total=res.total;
   
      }, err => {
        console.log(err);
      });
    }

    }

    forward(){
      this.propertyService.getPropertiesByStatus(this.optionFilter,this.pageN)
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
