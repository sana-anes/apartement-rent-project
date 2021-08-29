import { Reservation } from '../../shared/models/reservation';
import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/shared/services';
import { PAGNATION_PAGE, environment} from '../../../environments/environment';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { AfterPaymentModelComponent } from '../after-payment-model/after-payment-model.component';
import { TokenStorageService } from 'src/app/auth/services';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit  {
  errorMessage='';
  successMessage='';
  data: Reservation[] = [];
  statusArray:string[]=['not confirmed','confirmed'];
  pageN:number=1;
  total!:number;
  perPage=PAGNATION_PAGE;
  email!:string;

filterForm = new FormGroup({
  status: new FormControl('', [Validators.required]),
});
constructor(   
  private  reservationService:  ReservationService,
   private router: Router,
   private tokenStorage: TokenStorageService,
   public dialog: MatDialog

   ) { }
 ngOnInit(): void {

   this.reservationService.getReservationsByStatus('all')
   .subscribe((res: any) => {
    this.data = res.data;
    this.total=res.total;
     console.log(res);

   }, err => {
     console.log(err);
   });
   this.email = this.tokenStorage.getUser().email;
   this.loadStripe();
 }

get status(): AbstractControl {
  return this.filterForm.get('status')!;
}

changeStatus(e:any) {
  this.pageN=1;
  this.status.setValue(e.target.value, {
    onlySelf: true
  })

  this.reservationService.getReservationsByStatus(this.filterForm.value.status).subscribe(
    (res: any) => {
      this.data = res.data;
      this.total=res.total;
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

pay(id:string,cost:any,check_in:Date) {  
  var handler = (<any>window).StripeCheckout.configure({
    key: environment.stripe.testKey,
    locale: 'auto',
    token: (token: any) =>{
      this.reservationService.confirmReservation(id,this.email,token).subscribe(
        data => {
          this.openAfterPaymentModel(check_in);
          this.refresh();
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
    amount: cost*100,
    allowRememberMe: false,
    email:this.email ,
  });


}
 

  cancel(id:string){
    this.reservationService.cancelReservation(id)
    .subscribe((res: any) => {
      this.successMessage = res.message;
      setTimeout(() => {
        this.refresh();
      }, 1000)     
    }, err => {
      if (err.error.msg) {
        this.errorMessage = err.error.msg[0].message;
      }
      if (err.error.message) {
        this.errorMessage = err.error.message;
      } 
      setTimeout(() => {
        this.errorMessage ='';
      }, 6000)    }
    );
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
      let status;
      this.filterForm.value.status?status=this.filterForm.value.status:status='all'
      this.reservationService.getReservationsByStatus(status,page-1)
      .subscribe((res: any) => {
        this.data = res.data;
        this.total=res.total;
   
      }, err => {
        console.log(err);
      });
    }

    }

    forward(){
       let status;
      this.filterForm.value.status?status=this.filterForm.value.status:status='all'
        this.reservationService.getReservationsByStatus(status,this.pageN)
        .subscribe((res: any) => {
          if(res.data.length){
            this.pageN=this.pageN+1;
            this.data = res.data;
            this.total=res.total;
          }
          console.log(res);
     
        }, err => {
          console.log(err);
        });
      
  
      }
      openAfterPaymentModel(check_in:Date): void {
        const dialogRef = this.dialog.open(AfterPaymentModelComponent, {
          width: '400px',
          data: {name: this.tokenStorage.getUser().firstname,owner:'the owner',date:check_in}
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log("reservation confirmed")
          
        });
      }
  
}
