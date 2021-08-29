import { Component, OnInit ,Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
export interface DialogData {
  name: string;
  cost:number;
}
@Component({
  selector: 'before-payment-model',
  templateUrl: './before-payment-model.component.html',
  styleUrls: ['./before-payment-model.component.css']
})
export class BeforePaymentModelComponent {

  constructor(
    public dialogRef: MatDialogRef<BeforePaymentModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DialogData ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
  onOkClick()
{
  this.dialogRef.close('done');

}
}
