import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContentService, PropertyService } from 'src/app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../../../environments/environment';
import { Category ,Country} from 'src/app/shared/models/content';

const API_URL = BASE_URL+'/api/property/';
const params = new HttpParams();
const options = {
  params,
  reportProgress: true,
};
@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent implements OnInit {
  errorMessage:string='';
  successMessage:string='';
  typeHasError = true;
  countryHasError = true;
  types:Category[]=[];
  countries:Country[]=[];
  files:File[]=[];

  filesName :string= 'Choose pictures';
  validateFile:boolean=false;
  isFileTouched:boolean=false;
  areImages:boolean=true;
  step=1;

  constructor(
    private  contentService:  ContentService,
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient

  ) {}

  ngOnInit(): void {


    this.contentService.getContent()
    .subscribe((res: any) => {
     this.countries = res.country;
     this.types=res.category;
      console.log(res);
 
    }, err => {
      console.log(err);
    });
  }
  moveTo(step:number){
  this.step=step;
}

  propertyForm = new FormGroup({
    title: new FormControl('', [Validators.required,Validators.minLength(3)]),
    type: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required,Validators.minLength(3)]),
    country: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    rooms: new FormControl('', [Validators.required]),
    baths: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    activities: new FormArray([]),
  
  });

  get title(): AbstractControl {
    return this.propertyForm.get('title')!;
  }
  get type(): AbstractControl {
    return this.propertyForm.get('type')!;
  }

  get address(): AbstractControl {
    return this.propertyForm.get('address')!;
  }

  get country(): AbstractControl {
    return this.propertyForm.get('country')!;
  }
  get state(): AbstractControl {
    return this.propertyForm.get('state')!;
  }
  get rooms(): AbstractControl {
    return this.propertyForm.get('rooms')!;
  }
  get baths(): AbstractControl {
    return this.propertyForm.get('baths')!;
  }
  get price(): AbstractControl {
    return this.propertyForm.get('price')!;
  }


  get form() { return this.propertyForm.controls; }
  get activities() { return this.form.activities as FormArray; }
  get activitiesFormGroups() { return this.activities.controls as FormGroup[]; }

  addActivity() {
    this.activities.push(this.formBuilder.group({
        name: ['', Validators.required],
        distance: ['', [Validators.required]]
    }));
  }

  resetActivity(){
    this.activities.clear();
  }

  changeType(e:any) {
    if(e.target.value==='default') this.typeHasError=true;
    else this.typeHasError=false;
    this.type.setValue(e.target.value, {
      onlySelf: true
    })
  }

  changeCountry(e:any) {
    if(e.target.value==='default') this.countryHasError=true;
    else this.countryHasError=false;
    this.country.setValue(e.target.value, {
      onlySelf: true
    })
  }


  uploadFiles(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.validateFile=true;
      this.filesName="";
      this.areImages=true;
      this.files=[];
      for (let i = 0; i < event.target.files.length; i++) { 
        this.files.push(event.target.files[i]);
        this.filesName=`${this.filesName}  ${event.target.files[i].name}`;
        this.areImages=this.areImages && event.target.files[i].type.startsWith("image");
      }
      if(!this.areImages){
        this.filesName="";
        this.files=[];

      }

    } else {
      this.areImages=true;
      this.validateFile=false;
      this.filesName = 'Choose pictures';
    }
  }


  touched(){
    this.isFileTouched=true;
  }

 

submit(){

    if(this.propertyForm.valid){
      const formData: FormData = new FormData();
      formData.append("title", this.propertyForm.value.title);
      formData.append("type", this.propertyForm.value.type);
      formData.append("address", this.propertyForm.value.address);
      formData.append("country", this.propertyForm.value.country);
      formData.append("state", this.propertyForm.value.state);
      formData.append("rooms", this.propertyForm.value.rooms);
      formData.append("baths", this.propertyForm.value.baths);
      formData.append("price", this.propertyForm.value.price);
      formData.append("activities", JSON.stringify(this.propertyForm.value.activities));

      for (let i = 0; i < this.files.length; i++) {
            formData.append("file", this.files[i]);
      }
    this.http.post(API_URL + 'add',formData, options).subscribe(
    
        data => {
          this.step=1;
          this.propertyForm.reset();
          this.errorMessage = '';
          this.successMessage = "Property created sucessfully.";
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigateByUrl('/member/properties');

          }, 1000)
      
        },
        err => {
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
      );

    }  
  
  }




}
