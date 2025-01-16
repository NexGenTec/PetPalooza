import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mestizo',
  templateUrl: './mestizo.page.html',
  styleUrls: ['./mestizo.page.scss'],
})
export class MestizoPage implements OnInit {



  constructor(
    private router: Router
  ) {

   }

  //  navigateToTargetPageForm(segment: string) {
  //   this.router.navigate([segment]);
  // }

  ngOnInit() {
  }

}
