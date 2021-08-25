import { Component, OnInit   } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService, ReservationService } from 'src/app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL , environment } from '../../../environments/environment';
import { Property } from '../../shared/models/property';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {

  data!: Property;
  pictures:string[]=[];
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
    private activatedRoute: ActivatedRoute,
  ) { 
    const currentDate = new Date(); 
    this.minDate = currentDate;
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
book(){
  if(! this.range.value.start || ! this.range.value.end ){
    this.valid=false;
  }
  else{
    const { start, end } = this.range.value;
    this.reservationService.book(start,end,this.id).subscribe(

      data => {
        console.log(data);
        this.reservationID=data.id;
        this.fees=data.fees;

      },
      error=>{}
    )

  }
}
confirm(){
    this.reservationService.confirmReservation(this.reservationID).subscribe(
      data => {
        console.log(data);
      },
      error=>{}
)
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
    token: function (token: any) {
      console.log(token)   
      this.token=token; 
       alert('Payment Success!!');
    }  
  });

  handler.open({
    name: 'AtypicHouse',
    description: 'Reservations details in the booking area on our site',
    amount: this.fees*100
  });
  if(this.token){
    this.confirm();

  }

}
  ngOnInit(): void {
    this.loadStripe();
    this.id = this.activatedRoute.snapshot.params.id;
    this.propertyService.getPropertiesById(this.id)
    .subscribe((res: any) => {
      this.pictures=res.property.picture;
      this.data=res.property;


      console.log(this.data);

    }, err => {
      console.log(err);
    });
  }


}
