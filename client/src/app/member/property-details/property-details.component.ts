import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from 'src/app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../../../environments/environment';
import { Property } from '../../shared/models/property';
@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {

  data!: Property;
  pictures:string[]=[];
  id!:string;
  base_url:String=BASE_URL;
  carouselHeight:number=300;
  constructor(
    private propertyService: PropertyService,
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.id = this.activatedRoute.snapshot.params.id;
    this.propertyService.getPropertiesById(this.id)
    .subscribe((res: any) => {
      this.data = res.property;
      this.pictures=res.property.picture;

      console.log(this.data);

    }, err => {
      console.log(err);
    });
  }

}
