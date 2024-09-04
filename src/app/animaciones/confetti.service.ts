import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {

  
  private heartConfetti() {
    let scalar = 2;
    let hearts = confetti.shapeFromText({ text: '❤️', scalar });
    let pets = confetti.shapeFromText({ text: '🐾', scalar });

    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 1 },
      // shapes: ['heart'],
      shapes: [pets],
      scalar
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 1 },
      // shapes: ['heart'],
      shapes: [hearts],
      scalar
    });
  }

  public triggerHeartConfetti() {
    this.heartConfetti();
  }
}
