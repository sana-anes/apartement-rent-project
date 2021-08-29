import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category,Country } from 'src/app/shared/models/content';
import { ContentService } from 'src/app/shared/services';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  categories:Category[]=[];
  countries:Country[]=[];

  constructor(
    private  contentService:  ContentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.contentService.getContent()
    .subscribe((res: any) => {
     this.countries = res.country;
     this.categories=res.category; 
    }, err => {
      console.log(err);
    });
  }
  addCountry(event: any){
    const label=event.target.value;
    this.contentService.addCountry(label)
    .subscribe((res: any) => {
     this.refresh();
    }, err => {
      console.log(err);
    });
  }
  addCategory(event: any){
    const label=event.target.value;
    this.contentService.addCategory(label)
    .subscribe((res: any) => {
     this.refresh();
    }, err => {
      console.log(err);
    });
  }

  deleteCountry(id:string){
    this.contentService.deleteCountry(id)
    .subscribe((res: any) => {
     this.refresh();
    }, err => {
      console.log(err);
    });
  }
  deleteCategory(id:string){
    this.contentService.deleteCategory(id)
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
}
