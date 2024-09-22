import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../service/firestore.service';
import { ImgUsers } from '../../interface/ImgUsers.model';

@Component({
  selector: 'app-img-users',
  templateUrl: './img-users.page.html',
  styleUrls: ['./img-users.page.scss'],
})
export class ImgUsersPage implements OnInit {

  imgUsers:ImgUsers[]

  constructor(
    private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.loadImgUsers();
  }

  loadImgUsers() {
    // this.firestoreService.getCollectionChanges<ImgUsers>('ImgUsers').subscribe(data => {
    //   this.imgUsers = data;
    //   console.log('Datos cargados:', this.imgUsers);
    // });
  }

}
