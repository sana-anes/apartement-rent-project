import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
export interface DialogData {
  name: string;
  owner:string;
  date:Date;
}
@Component({
  selector: 'app-after-payment-model',
  templateUrl: './after-payment-model.component.html',
  styleUrls: ['./after-payment-model.component.css']
})
export class AfterPaymentModelComponent  {

  constructor(
    public dialogRef: MatDialogRef<AfterPaymentModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DialogData ) {}
  
    onOkClick()
    {
      this.dialogRef.close('ok');
    }

}
