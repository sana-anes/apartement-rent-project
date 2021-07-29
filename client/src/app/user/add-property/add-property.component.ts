import { Property } from './../../shared/models/property';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from 'src/app/shared/services';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent implements OnInit {
  errorMessage:string=''
  typeHasError = true;
  countryHasError = true;
  types=["apartement","house","hotel"]
  countries=["tunisia","usa","england"]
  files?:FileList;

  filesName :string= 'Choose pictures';
  validateFile:boolean=false;
  isFileTouched:boolean=false;
  areImages:boolean=true;
  step=1;

  constructor(
    private propertyService: PropertyService,
    private router: Router,
    private formBuilder: FormBuilder,

  ) {}

  ngOnInit(): void {

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
    city: new FormControl('', [Validators.required]),
    rooms: new FormControl('', [Validators.required]),
    beds: new FormControl('', [Validators.required]),
    baths: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    activities: new FormArray([])


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
  get city(): AbstractControl {
    return this.propertyForm.get('city')!;
  }
  get rooms(): AbstractControl {
    return this.propertyForm.get('rooms')!;
  }
  get beds(): AbstractControl {
    return this.propertyForm.get('beds')!;
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
      this.files=event.target.files;

      for (let i = 0; i < event.target.files.length; i++) { 
        this.filesName=`${this.filesName}  ${event.target.files[i].name}`;
        this.areImages=this.areImages && event.target.files[i].type.startsWith("image");

    }
    console.log(this.files)
 
    this.propertyService.upload(this.files!).subscribe(
      data => {
        console.log(data)
      },
   
    );

    } else {
      this.validateFile=false;
      this.filesName = 'Choose pictures';
    }
  }
  touched(){
    this.isFileTouched=true;
  }

  addActivity() {
            this.activities.push(this.formBuilder.group({
                name: ['', Validators.required],
                distance: ['', [Validators.required]]
            }));
}

resetActivity(){
  this.activities.clear();

}

  submit(){
    const property:Property=this.propertyForm.value;

    if(this.propertyForm.valid){
      // this.propertyService.addProperty(this.files,property).subscribe(
      //   data => {
      //     this.errorMessage='';
      //     console.log(data)
      //     // setTimeout(() => {
      //     //   this.router.navigateByUrl('/user/properties');
      //     // }, 3000);
  
      //     // console.log(data);
      
      //   },
      //   err => {
      //     if (err.error.msg) {
      //       this.errorMessage = err.error.msg[0].message;
      //     }
      //     if (err.error.message) {
      //       this.errorMessage = err.error.message;
      //     }    
      //     setTimeout(() => {
      //       this.errorMessage ='';
      //     }, 6000)
        
        
      //   }
      // );

    }  }

}
