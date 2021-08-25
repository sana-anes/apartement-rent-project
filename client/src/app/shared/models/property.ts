import{User} from './user'

export class Property {
    constructor(
       public _id: string,
       public title: string,
       public type: string,
       public picture: string[],
       public address: string,
       public country: string,
       public state: string,
       public rooms: number,
       public baths: number,
       public price: number,
       public rentPer: string,
       public status: string,
       public activities: [{
            name:string,
            distance:number,
        }],
        public created_at:Date,
        public updated_at:Date,
        public user: User,
     
     ) {}
   }