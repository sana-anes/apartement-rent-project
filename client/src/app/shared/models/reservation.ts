import { Property } from './property';
import{User} from './user'
export class Reservation {
    constructor(
        public _id:string,
        public user:User,
        public property:Property,
        public check_in:Date,
        public check_out:Date,
        public total_price:Number,
        public status:string,
        public created_at:Date,
        ){}
    }
