import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private likeAction = new BehaviorSubject<boolean>(false);
  
  likeAction$ = this.likeAction.asObservable();

  triggerLike() {
    this.likeAction.next(true);
  }

  resetLike() {
    this.likeAction.next(false);
  }
}
