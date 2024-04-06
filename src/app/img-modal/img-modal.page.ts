import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-img-modal',
  templateUrl: './img-modal.page.html',
  styleUrls: ['./img-modal.page.scss'],
})
export class ImgModalPage implements OnInit {

  @Input() imageUrl!: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  closeModal() {
    this.modalController.dismiss();
  }

}
