import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-img-modal-swiper',
  templateUrl: './img-modal-swiper.page.html',
  styleUrls: ['./img-modal-swiper.page.scss'],
})
export class ImgModalSwiperPage implements OnInit {

  @Input() images: string[];

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  dismissModal() {
    this.modalController.dismiss();
  }
}
