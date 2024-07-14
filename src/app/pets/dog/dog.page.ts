import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../service/firestore.service';
import { Dog } from '../../interface/Dog.models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dog',
  templateUrl: './dog.page.html',
  styleUrls: ['./dog.page.scss'],
})
export class DogPage implements OnInit {
  dogs: Dog[] = [];

  constructor(
  private firestoreService: FirestoreService,
  private router: Router,
  private route: ActivatedRoute

  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.firestoreService.getCollectionChanges<Dog>('InfoPerro').subscribe(dogs => {
      this.dogs = dogs;
      console.log(dogs)
    });
  }

  navigateToTargetPage(dog: Dog) {
    this.router.navigate(['/profile-dog', dog.id], { state: { data: dog } });
  }
  
}
