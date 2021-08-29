import { Component, OnInit } from '@angular/core';
import { Property } from '../../shared/models/property';
import { ContentService,PropertyService, UserService } from 'src/app/shared/services';
import { BASE_URL ,PAGNATION_PAGE} from '../../../environments/environment';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient,  } from '@angular/common/http';
import { Category ,Country} from 'src/app/shared/models/content';

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.css']
})
export class PropertiesListComponent implements OnInit {
  data: Property[] = [];
  base_url:String=BASE_URL;
  types:Category[]=[];
  countries:Country[]=[];
  properties=["pending","accepted"];
  bedrooms=[1,2,3,4];
  bathrooms=[1,2,3];
  pageN:number=1;
  total!:number;
  perPage:number=PAGNATION_PAGE;

  searchForm = new FormGroup({
    type: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    rooms: new FormControl('', [Validators.required]),
    baths: new FormControl('', [Validators.required]),
    property: new FormControl('', [Validators.required]),
  
  });

  get type(): AbstractControl {
    return this.searchForm.get('type')!;
  }
  get country(): AbstractControl {
    return this.searchForm.get('country')!;
  }
  get rooms(): AbstractControl {
    return this.searchForm.get('rooms')!;
  }
  get baths(): AbstractControl {
    return this.searchForm.get('baths')!;
  }
  get property(): AbstractControl {
    return this.searchForm.get('property')!;
  }

  constructor(
    private propertyService: PropertyService,
    private  contentService:  ContentService,
    private router: Router,

  ) { }

  changeType(e:any) {
    this.type.setValue(e.target.value, {
      onlySelf: true
    })
  }

  changeCountry(e:any) {
    this.country.setValue(e.target.value, {
      onlySelf: true
    })
  }

  changeProperty(e:any) {
    this.property.setValue(e.target.value, {
      onlySelf: true
    })
  }
  changeRooms(e:any) {
    this.rooms.setValue(e.target.value, {
      onlySelf: true
    })
  }
  changeBaths(e:any) {
    this.baths.setValue(e.target.value, {
      onlySelf: true
    })
  }

  search(){
    this.pageN=1;
    const {type,country,property,rooms,baths}=this.searchForm.value;
    this.propertyService.getAllProperties(type,country,property,rooms,baths).subscribe(
      (res :any)=> {
          this.data = res.data;
          this.total=res.total;
      }, err => {
        console.log(err);
      }
    );
  }
  ngOnInit(): void {
    this.propertyService.getAllProperties()
    .subscribe(
      (res :any)=> {
        this.data = res.data;
        this.total=res.total;
      }, err => {
        console.log(err);
      }
    );
    this.contentService.getContent()
    .subscribe((res: any) => {
     this.countries = res.country;
     this.types=res.category;
    }, err => {
      console.log(err);
    });
  }

  accepte(id:string){
      this.propertyService.accepteProperty(id)
      .subscribe((res: any) => {
        this.data = res;
        this.refresh();
      }, err => {
        console.log(err);
      });
  }

  delete(id:string){
    this.propertyService.deleteProperty(id)
    .subscribe((res: any) => {
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
        const {type,country,property,rooms,baths}=this.searchForm.value;
        this.propertyService.getAllProperties(type,country,rooms,property,baths,page-1)
        .subscribe((res: any) => {
          this.data = res.data;
          this.total=res.total;
        }, err => {
          console.log(err);
        });
      }
  }

  forward(){
    const {type,country,property,rooms,baths}=this.searchForm.value;
    this.propertyService.getAllProperties(type,country,property,rooms,baths,this.pageN)
      .subscribe((res: any) => {
          if(res.data.length){
            this.pageN=this.pageN+1;
            this.data = res.data;
            this.total=res.total;
          }   
      }, err => {
        console.log(err);
      });
    }
}
