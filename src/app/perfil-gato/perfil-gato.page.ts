import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from '../img-modal/img-modal.page';

@Component({
  selector: 'app-perfil-gato',
  templateUrl: './perfil-gato.page.html',
  styleUrls: ['./perfil-gato.page.scss'],
})
export class PerfilGatoPage implements OnInit {

  selectedSegmentValue: string = 'caracteristicas';
  cardHeading: string = '';
  cardSubtitle: string = '';
  cardContent: string = '';

  infoName: string = '';
  infoOrigin: string = '';
  infoHistory: string = '';
  infoImage: string = '';
  selectedGatoId!: number;

  showImagesContainer: boolean = false;

  constructor(private route: ActivatedRoute, private modalController: ModalController) {


  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
