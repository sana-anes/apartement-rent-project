import { Component, OnInit   } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService, ReservationService } from 'src/app/shared/services';
import { BASE_URL } from '../../../environments/environment';
import { Property } from '../../shared/models/property';
import { Comment } from '../../shared/models/comment';
import { FormControl, FormGroup } from '@angular/forms';
import { CommentService } from 'src/app/shared/services/comment.service';
@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  data!: Property;
  pictures:string[]=[];
  comments:Comment[]=[];
  id!:string;
  result:boolean=false;
  message:string="";
  available:boolean=false;
  base_url:String=BASE_URL;
  valid:boolean=true;
  token!:string;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  minDate: Date;
  reservationID!:string;
  fees!:number;
  constructor(
    private reservationService: ReservationService,
    private propertyService: PropertyService,
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private router:Router,

  ) { 
    const currentDate = new Date(); 
    this.minDate = currentDate;
  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.propertyService.getPropertiesById(this.id)
    .subscribe((res: any) => {
      this.pictures=res.property.picture;
      this.comments=res.property.comments;
      this.data=res.property;


      console.log(this.data);

    }, err => {
      console.log(err);
    });
  }
  check(){
  this.valid=true;
this.available=false;
  if(! this.range.value.start || ! this.range.value.end ){
    this.valid=false;
  }
  else{
    const { start, end } = this.range.value;
    this.reservationService.checkAvailability(start,end,this.id).subscribe(

      data => {
        console.log(data);
        this.result=true;
        this.message=data.message;
        if(data.available) this.available=true;
      },
      error=>{}

    )

  }
  }
  deleteComment(id:string){  
    this.commentService.deleteComment(id,this.data._id)
    .subscribe((res: any) => {
   this.refresh();
      }, err => {
      console.log(err);
    });
  }
deleteReply(id:string,parent:string){  

      this.commentService.deleteReply(id,parent)
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
