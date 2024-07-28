import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfoAve } from 'src/app/interface/InfoAve.models';
@Component({
  selector: 'app-page-ave',
  templateUrl: './page-ave.page.html',
  styleUrls: ['./page-ave.page.scss'],
})
export class PageAvePage implements OnInit {
  categoria: string;
  infoAve: InfoAve;
  favorites: any[] = [];
  currentDatoIndex: number = 0;
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoria = params['categoria'];
      this.infoAve = JSON.parse(params['info']);
    });
  }
}
