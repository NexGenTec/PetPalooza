import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from '../../service/firestore.service';
import { InfoImage } from '../../interface/InfoImage.models';
import { ImgModalPage } from '../../components/img-modal/img-modal.page';

@Component({
  selector: 'app-mestizo',
  templateUrl: './mestizo.page.html',
  styleUrls: ['./mestizo.page.scss'],
})
export class MestizoPage implements OnInit {

  img: InfoImage[] = [];

  originalImg: InfoImage[] = [];
  constructor(
    private firestores: FirestoreService,
    private modalController: ModalController,
  ) {
    
   }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.firestores.getCollectionChanges<InfoImage>('InfoImage').subscribe(img => {
      if (img) {
        this.originalImg = img;
        this.img = img
      }
    });
  }


  async openModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImgModalPage,
      componentProps: {
        imageUrl: imageUrl
      }
    })
    return await modal.present();
  }

}
