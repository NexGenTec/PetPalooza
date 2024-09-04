import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {

  private heartConfetti() {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0 },
      shapes: ['heart'],
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0 },
      shapes: ['heart'],
    });
  }

  public triggerHeartConfetti() {
    this.heartConfetti();
  }
}
