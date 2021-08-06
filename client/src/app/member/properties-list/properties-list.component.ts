import { Property } from '../../shared/models/property';
import { Component, OnInit } from '@angular/core';
import { PropertyService } from 'src/app/shared/services';
import { BASE_URL } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-property',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.css']
})
export class PropertiesListComponent implements OnInit {
  data: Property[] = [];
  isLoadingResults = true;
  base_url:string=BASE_URL;
  optionFilter:string="all";
  constructor(private propertyService: PropertyService,
    private router: Router,

    ) { }


  option(e:string){
    this.optionFilter=e;
    this.propertyService.getPropertiesByStatus(e)
    .subscribe((res: any) => {
      this.data = res;
      console.log(res);

    }, err => {
      console.log(err);
    });
  }

  ngOnInit(): void {

    this.propertyService.getPropertiesByStatus(this.optionFilter)
    .subscribe((res: any) => {
      this.data = res;
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

}
