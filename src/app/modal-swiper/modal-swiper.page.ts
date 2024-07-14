import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-swiper',
  templateUrl: './modal-swiper.page.html',
  styleUrls: ['./modal-swiper.page.scss'],
})
export class ModalSwiperPage implements OnInit {

  @Input() images: string[];
  @Input() initialSlide: number = 0;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log('Imagenes Recividas:', this.images);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
