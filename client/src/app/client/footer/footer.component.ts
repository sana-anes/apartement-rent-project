import { Component, OnInit } from '@angular/core';
import { BreakpointObserver,  BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isMobile:boolean=false;

  constructor(
    private breakpointObserver: BreakpointObserver,

  ) { }

  ngOnInit(): void {
    this.breakpointObserver
    .observe(['(min-width: 768px)'])
    .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobile=false;
        } else {
          this.isMobile=true;        }
    })
  }

}
