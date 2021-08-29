import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService, ReservationService } from 'src/app/shared/services';
import { BASE_URL  } from '../../../environments/environment';
import { Property } from '../../shared/models/property';
import { Comment } from '../../shared/models/comment';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/auth/services';
import { CommentService } from 'src/app/shared/services/comment.service';



@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  errorMessage='';
  successMessage='';
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
  new_reservation!:any;
  cost!:number;
  selectedComment:string='';
  replyTo:string='';
  commentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    comment: new FormControl('', [Validators.required]),
  });

  get name(): AbstractControl {
    return this.commentForm.get('name')!;
  }

  get email(): AbstractControl {
    return this.commentForm.get('email')!;
  }
  get comment(): AbstractControl {
    return this.commentForm.get('comment')!;
  } 


  constructor(
    private reservationService: ReservationService,
    private propertyService: PropertyService,
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private tokenStorage: TokenStorageService,

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
      if (err.error.msg) {
        this.errorMessage = err.error.msg[0].message;
      }
      if (err.error.message) {
        this.errorMessage = err.error.message;
      } 
      setTimeout(() => {
        this.errorMessage ='';
      }, 6000)
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
        this.result=true;
        this.message=data.message;
        if(data.available) {
          this.available=true;
        this.cost=data.cost;
        
        }else{
          this.available=false;
          this.cost=0;
        } 
      },
      err=>{
        if (err.error.msg) {
          this.errorMessage = err.error.msg[0].message;
        }
        if (err.error.message) {
          this.errorMessage = err.error.message;
        } 
        setTimeout(() => {
          this.errorMessage ='';
        }, 6000)
      }

    )

  }
}



  addComment(){  
    const { name,email,comment}=this.commentForm.value;
    if(this.commentForm.valid){

        if(this.selectedComment!==''){

          this.commentService.addReply(name,email,comment,this.selectedComment)
          .subscribe((res: any) => {
              this.refresh();
          }, err => {
              console.log(err);
          });

        }else{

            this.commentService.addComment(this.data._id,name,email,comment)
            .subscribe((res: any) => {
              console.log(res);
            this.refresh();

            }, err => {
              console.log(err);
            });

}

    }


  }
  addReply(parent_comment:string,name:string,element:any){
this.selectedComment=parent_comment;
this.replyTo=name;
element.scrollIntoView({ behavior: 'smooth', block: 'center' })  
}
undo(){
  console.log("undo");
  this.selectedComment='';
  this.replyTo=''; 
}

  refresh(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
