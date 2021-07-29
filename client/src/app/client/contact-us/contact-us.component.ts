import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FormGroup, FormControl, Validators, ValidationErrors,AbstractControl } from '@angular/forms';

const FEEDBACK_API ='http://localhost:3000/api/client/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  feedbackForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    
  });


  get name(): AbstractControl {
    return this.feedbackForm.get('name')!;
  }
  get message(): AbstractControl {
    return this.feedbackForm.get('message')!;
  }

  get email(): AbstractControl {
    return this.feedbackForm.get('email')!;
  }

  

  send(): void {
    const { name,message, email } = this.feedbackForm.value;
if(this.feedbackForm.valid){

  console.log(this.feedbackForm.value);
  this.http.post(FEEDBACK_API + 'send', {
    name,
    message,
    email
  }, httpOptions)
    .subscribe(
      data => {
       
        const message =`Thank you ${name}. for your Feedback`;
    alert(message);
        this.feedbackForm.reset();
        

        console.log(data);
    
      },
      
    );
  }
} 
  


   
 

   constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }
  
}
