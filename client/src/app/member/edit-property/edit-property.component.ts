import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService, PropertyService } from 'src/app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../../../environments/environment';
import { Property } from '../../shared/models/property';
import { Category ,Country} from 'src/app/shared/models/content';

const API_URL = BASE_URL+'/api/property/';
const params = new HttpParams();
const options = {
  params,
  reportProgress: true,
};
@Component({
  selector: 'app-edit',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit {
  errorMessage:string='';
  successMessage:string='';
  typeHasError = false;
  countryHasError =  false;
  types:Category[]=[];
  countries:Country[]=[];
  files:File[]=[];
  data!: Property;
  pictures:string[]=[];
  id!:string;
  base_url:String=BASE_URL;
  filesName :string= 'Choose pictures';
  areImages:boolean=true;

  constructor(
    private propertyService: PropertyService,
    private  contentService:  ContentService,
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.contentService.getContent()
    .subscribe((res: any) => {
     this.countries = res.country;
     this.types=res.category;
      console.log(res);
 
    }, err => {
      console.log(err);
    });

     this.id = this.activatedRoute.snapshot.params.id;
    this.propertyService.getPropertiesById(this.id)
    .subscribe((res: any) => {
      this.data = res.property;
      this.pictures=res.property.picture;
      this.editPropertyForm.patchValue(res.property)
      for(const activity of res.property.activities) {
        this.activities.push(this.formBuilder.group({
          name: [activity.name, Validators.required],
          distance: [activity.distance, [Validators.required]],
  
      }));
      }

    }, err => {
      console.log(err);
    });


  


  }
  editPropertyForm = new FormGroup({
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
    return this.editPropertyForm.get('title')!;
  }
  get type(): AbstractControl {
    return this.editPropertyForm.get('type')!;
  }

  get address(): AbstractControl {
    return this.editPropertyForm.get('address')!;
  }

  get country(): AbstractControl {
    return this.editPropertyForm.get('country')!;
  }
  get state(): AbstractControl {
    return this.editPropertyForm.get('state')!;
  }
  get rooms(): AbstractControl {
    return this.editPropertyForm.get('rooms')!;
  }
  get baths(): AbstractControl {
    return this.editPropertyForm.get('baths')!;
  }
  get price(): AbstractControl {
    return this.editPropertyForm.get('price')!;
  }


  get form() { return this.editPropertyForm.controls; }
  get activities() { return this.form.activities as FormArray; }
  get activitiesFormGroups() { return this.activities.controls as FormGroup[]; }

  addActivity() {
    this.activities.push(this.formBuilder.group({
        name: ['', Validators.required],
        distance: ['', [Validators.required]],

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
      this.filesName = 'Choose pictures';
      this.areImages=true;

    }
  }

 deleteImage(image:string){
    const index = this.pictures.indexOf(image);
    if (index > -1) {
      this.pictures.splice(index, 1);
    }
 }

edit(){
console.log(this.editPropertyForm.value)

if(this.editPropertyForm.valid){
  const formData: FormData = new FormData();
  formData.append("title", this.editPropertyForm.value.title);
  formData.append("type", this.editPropertyForm.value.type);
  formData.append("address", this.editPropertyForm.value.address);
  formData.append("country", this.editPropertyForm.value.country);
  formData.append("state", this.editPropertyForm.value.state);
  formData.append("rooms", this.editPropertyForm.value.rooms);
  formData.append("baths", this.editPropertyForm.value.baths);
  formData.append("price", this.editPropertyForm.value.price);
  formData.append("activities", JSON.stringify(this.editPropertyForm.value.activities));
  formData.append("picture", JSON.stringify(this.pictures));

  for (let i = 0; i < this.files.length; i++) {
        formData.append("file", this.files[i]);
  }
this.http.patch(API_URL + `update/${this.id}`,formData, options).subscribe(

    data => {
      this.errorMessage = '';
      this.successMessage = "Property edit sucessfully.";
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
