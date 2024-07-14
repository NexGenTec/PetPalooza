import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.page.html',
  styleUrls: ['./pets.page.scss'],
})
export class PetsPage implements OnInit {

  constructor(private router: Router) {}

  goToPage(page: string) {
    this.router.navigate([`/pets/${page}`]);
  }

  ngOnInit() {
  }

}
