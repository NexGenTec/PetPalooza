import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-favorite',
  templateUrl: './match-favorite.page.html',
  styleUrls: ['./match-favorite.page.scss'],
})
export class MatchFavoritePage implements OnInit {

  constructor( private router: Router,) { }

  ngOnInit() {
  }


}
