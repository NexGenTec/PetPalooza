import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-asistente',
  templateUrl: './asistente.page.html',
  styleUrls: ['./asistente.page.scss'],
})
export class AsistentePage implements OnInit {

  chatUrl: SafeResourceUrl;
  isLoading: boolean = true;

  constructor(private sanitizer: DomSanitizer) {
    const chatUrlWithSpanish = 'https://vetassistantai.com/embed/cmobnrjkl0003qr08dmzhwoq2?' +
      'pet-care-language=es&' +
      'language=es&' +
      'locale=es-ES&' +
      'i18nextLng=es&' +
      'preferredLanguage=es&' +
      'defaultLanguage=es&' +
      'setLocalStorage=true';
    
    this.chatUrl = this.sanitizer.bypassSecurityTrustResourceUrl(chatUrlWithSpanish);
  }

  ngOnInit() {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'es';
    }
    
    setTimeout(() => {
      this.isLoading = false;
    }, 10000);
  }

  onIframeLoad() {
    this.isLoading = false;
    
    try {
      const iframe = document.querySelector('.chat-frame') as HTMLIFrameElement;
      if (iframe) {
        iframe.style.pointerEvents = 'auto';
        iframe.style.touchAction = 'auto';
        
      }
    } catch (error) {
    }
  }

}
