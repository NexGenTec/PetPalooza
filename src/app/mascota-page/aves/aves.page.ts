import { Component, OnInit } from '@angular/core';
import { InfoAve } from 'src/app/interface/InfoAve.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aves',
  templateUrl: './aves.page.html',
  styleUrls: ['./aves.page.scss'],
})
export class AvesPage implements OnInit {

  aves: InfoAve[] = [];
  filteredAves: InfoAve[] = [];

  breakpointsRegisteredAnimals = {
    0: { slidesPerView: 1.15 },
    340: { slidesPerView: 2.15 },
    480: { slidesPerView: 3.15 },
    640: { slidesPerView: 4.15 },
    768: { slidesPerView: 5.15 },
  };

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {

  }

  navigateToTargetPage(segment: string, ave: InfoAve) {
    this.router.navigate([segment, ave.id], { state: { data: ave } });
  }
}
