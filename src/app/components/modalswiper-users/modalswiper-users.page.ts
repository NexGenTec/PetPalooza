import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImgUser } from 'src/app/interface/InfoGato.models';

@Component({
  selector: 'app-modalswiper-users',
  templateUrl: './modalswiper-users.page.html',
  styleUrls: ['./modalswiper-users.page.scss'],
})
export class ModalswiperUsersPage implements OnInit {

  @Input() images: ImgUser[] = [];
  @Input() initialSlide: number = 0;

  slideOpts = {
    initialSlide: this.initialSlide,
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true }
  };

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log('Images in modal:', this.images);
    console.log('Initial slide:', this.initialSlide);
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

}
