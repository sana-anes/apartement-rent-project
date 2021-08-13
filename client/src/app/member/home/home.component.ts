import { Component, OnInit } from '@angular/core';
import { Property } from '../../shared/models/property';
import { PropertyService, UserService } from 'src/app/shared/services';
import { BASE_URL } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
const API_URL = BASE_URL+'/api/property/';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  data: Property[] = [];
  base_url:String=BASE_URL;
  savedProperties:string[]=[];
  types=["apartement","house","townhome","condos"]
  countries=["tunisia","france","canada"];
  rentby=["night","week","month"];
  bedrooms=[1,2,3,4];
  bathrooms=[1,2,3];
  

  searchForm = new FormGroup({
    type: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    rooms: new FormControl('', [Validators.required]),
    baths: new FormControl('', [Validators.required]),
    rentPer: new FormControl('', [Validators.required]),
  
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
  get rentPer(): AbstractControl {
    return this.searchForm.get('rentPer')!;
  }

  constructor(
    private propertyService: PropertyService,
    private userService: UserService, 
    private router: Router,
    private http: HttpClient

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

  changeRentPer(e:any) {
    this.rentPer.setValue(e.target.value, {
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
 console.log(this.searchForm.value);
const {type,country,rentPer,rooms,baths}=this.searchForm.value;

const httpOptions = {
  headers: { 'Content-Type': 'application/json' },
  params: { 
    type:type,
    country: country,
    rentPer:rentPer,
    rooms: rooms,
    baths :baths
  }
};

this.http.get(API_URL +'filter',httpOptions
      ).subscribe(
  (data :any)=> {
    this.data = data;
    console.log(data)
  }
);

}
  ngOnInit(): void {

    // this.propertyService.getOtherProperties()
    this.propertyService.getAllProperties()
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
