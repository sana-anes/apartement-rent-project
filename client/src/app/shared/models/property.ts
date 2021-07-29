export class Property {
    constructor(
        
       public title: string,
       public type: string,
       public address: string,
       public country: string,
       public state: string,
       public city: string,
       public rooms: number,
       public beds: number,
       public baths: number,
       public price: number,
       public activities: [{
            name:string,
            distance:number,
        }]
     
     ) {}
   }