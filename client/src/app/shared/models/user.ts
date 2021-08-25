export class User{
    constructor(
      public _id:string,
      public firstname:string,
      public lastname:string,
      public email:string,
      public address:string,
      public phone:number,
      public created_at:Date,
      public updated_at:Date,
  
    ){}
  };