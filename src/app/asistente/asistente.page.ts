import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-asistente',
  templateUrl: './asistente.page.html',
  styleUrls: ['./asistente.page.scss'],
})
export class AsistentePage implements OnInit {

  chatUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.chatUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://vetassistantai.com/embed/cmobnrjkl0003qr08dmzhwoq2'
    );
  }

  ngOnInit() {}
}
