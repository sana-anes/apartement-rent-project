import { Component, OnInit ,Inject  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService, ReservationService } from 'src/app/shared/services';
import { BASE_URL , environment } from '../../../environments/environment';
import { Property } from '../../shared/models/property';
import { Comment } from '../../shared/models/comment';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/auth/services';
import {MatDialog} from '@angular/material/dialog';
import { BeforePaymentModelComponent } from '../before-payment-model/before-payment-model.component';
import { AfterPaymentModelComponent } from '../after-payment-model/after-payment-model.component';
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
  email!:string;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  minDate: Date;
  new_reservation!:any;
  cost!:number;
  commentHasError:boolean=false;
  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required]),
  });

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
    public dialog: MatDialog

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
    this.email = this.tokenStorage.getUser().email;
    this.loadStripe();
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
book(){
  if(! this.range.value.start || ! this.range.value.end ){
    this.valid=false;
  }
  else{
    const { start, end } = this.range.value;
    this.reservationService.book(start,end,this.id).subscribe(
      data => {
        this.new_reservation=data.new_reservation;

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


loadStripe() {
      
  if(!window.document.getElementById('stripe-script')) {
    var s = window.document.createElement("script");
    s.id = "stripe-script";
    s.type = "text/javascript";
    s.src = "https://checkout.stripe.com/checkout.js";
    window.document.body.appendChild(s);
  }
}

pay() {  
  this.book();
  var handler = (<any>window).StripeCheckout.configure({
    key: environment.stripe.testKey,
    locale: 'auto',
    token: (token: any) =>{
      this.reservationService.confirmReservation(this.new_reservation._id,this.email,token).subscribe(
        data => {
          this.openAfterPaymentModel();
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
  });

  handler.open({
    name: 'AtypicHouse',
    description: 'payment proccess',
    amount: this.cost*100,
    allowRememberMe: false,
    email:this.email ,
  });


}
 
  openBeforePaymentModel(): void {
    const dialogRef = this.dialog.open(BeforePaymentModelComponent, {
      width: '400px',
      data: {name: this.tokenStorage.getUser().firstname,cost:this.cost}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result==='done'){
        this.pay();
      }
    });
  }
  openAfterPaymentModel(): void {
    const dialogRef = this.dialog.open(AfterPaymentModelComponent, {
      width: '400px',
      data: {name: this.tokenStorage.getUser().firstname,owner:this.data.user.firstname,date:this.new_reservation.check_in}
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log("reservation confirmed")
      
    });
  }

  addComment(){  
    const{comment}=this.commentForm.value;
    console.log(comment);
    if(this.commentForm.valid){
      this.commentHasError=false;
      const name= this.tokenStorage.getUser().firstname +' '+this.tokenStorage.getUser().lastname;
      this.commentService.addComment(this.data._id,name,this.email,comment)
      .subscribe((res: any) => {
        console.log(res);
      this.refresh();

      }, err => {
        console.log(err);
      });
    }else this.commentHasError=true;


  }
  addReply(event:any,comment:string){
    const reply=event.target.value;
    const name= this.tokenStorage.getUser().firstname +' '+this.tokenStorage.getUser().lastname;
    this.commentService.addReply(name,this.email,reply,comment)
    .subscribe((res: any) => {
        this.refresh();
     }, err => {
        console.log(err);
    });
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
