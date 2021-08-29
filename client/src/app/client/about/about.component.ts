import { ContentService } from './../../shared/services/content.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
users!:number;
properties!:number;
reservations!:number;
  constructor(
    private contentService:ContentService,
  ) { }

  ngOnInit(): void {
    this.contentService.getCount()
      .subscribe(
        (res:any) =>{
          this.users=res.users;
          this.properties=res.properties;
          this.reservations=res.reservations;


        } );
    
  }

}
