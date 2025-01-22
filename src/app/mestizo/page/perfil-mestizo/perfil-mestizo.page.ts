import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil-mestizo',
  templateUrl: './perfil-mestizo.page.html',
  styleUrls: ['./perfil-mestizo.page.scss'],
})
export class PerfilMestizoPage implements OnInit {
  isLoading: boolean = false;
  selectedSegmentValue: string = 'caracteristicas';

  constructor() { }

  ngOnInit() {
   
  }

}
