export class Comment{
    constructor(
      public _id:string,
      public name:string,
      public email:string,
      public comment:string,
      public replies:Comment[],
      public created_at:Date,
    ){}
  };