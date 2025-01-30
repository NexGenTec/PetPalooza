import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MestizosService } from '../../service/mestizos.service';
import { Mestizos, Users } from '../../models/users.models';
import { UserSessionService } from '../../service/user-session.service';
import { of, switchMap } from 'rxjs';
import { TemperamentosMestizos } from '../../models/TemperamentosMestizos.models';
import { ModalController } from '@ionic/angular';
import { ImgModalPage } from 'src/app/components/img-modal/img-modal.page';
import { ModalSwiperPage } from 'src/app/components/modal-swiper/modal-swiper.page';

@Component({
  selector: 'app-perfil-mestizo',
  templateUrl: './perfil-mestizo.page.html',
  styleUrls: ['./perfil-mestizo.page.scss'],
})
export class PerfilMestizoPage implements OnInit {
  isLoading = true;
  mestizoId: string;
  mestizo: Mestizos;
  user: Users;
  isLoadingImg = true;
  selectedSegmentValue = 'caracteristicas';
  cardHeading = '';
  cardSubtitle = '';
  cardContent = '';
  showImagesContainer = false;
  mestizos: Mestizos[] = [];

  constructor(
    private route: ActivatedRoute,
    private mestizosService: MestizosService,
    private userSessionService: UserSessionService,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.mestizoId = params.get('id');
      if (this.mestizoId) {
        this.loadMestizo();
      }
    });
  }

  loadMestizoAndUser() {
    this.userSessionService.user$
      .pipe(
        switchMap((user) => {
          if (user) {
            this.user = user;
            return this.mestizosService.getMestizoByIdAndUser(user.id, this.mestizoId);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (mestizo) => {
          if (mestizo) {
            this.mestizo = mestizo;
            this.populateMestizoData();
          } else {
            console.error('Mestizo not found');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading mestizo:', error);
          this.isLoading = false;
        },
      });
  }

  loadMestizo() {
    this.mestizosService.getAllUsersWithMestizos().subscribe({
      next: (data) => {
        this.mestizos = data;
        this.mestizo = this.mestizos.find(mestizo => mestizo.id === this.mestizoId);
    
        if (this.mestizo) {
          this.populateMestizoData();
        } else {
          console.error('Mestizo no encontrado');
        }
    
        this.checkLoadingStatus(); // Verificar si ya se puede desactivar la carga
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
        this.checkLoadingStatus(); // Verificar si ya se puede desactivar la carga
      }
    });
  }
  
  checkLoadingStatus() {
    // Si ambas funciones ya han terminado, desactivar la carga
    if (this.mestizo && this.mestizos.length) {
      this.isLoading = false;
    }
  }
  
  getImagesArray(mestizo: Mestizos): string[] {
    return Array.isArray(mestizo?.imagenMascota) ? Object.values(mestizo.imagenMascota) : [];
  }

  populateMestizoData() {
    if (this.mestizo) {
      this.cardHeading = this.mestizo.nombre || 'Unnamed';
      this.cardContent = this.mestizo.historia || 'No story available';
      this.changeCardContent(this.selectedSegmentValue);
    }
  }

  changeCardContent(segmentValue: string) {
    if (!this.mestizo) return;
    this.isLoadingImg = true;

    switch (segmentValue) {
      case 'caracteristicas':
        this.setCardContent(
          'Características Físicas',
          this.mestizo.nombre,
          this.formatCharacteristics(this.mestizo)
        );
        this.showImagesContainer = false;
        break;
      case 'temperamento':
        this.setCardContent(
          'Temperamento',
          '',
          this.formatTemperamento(this.mestizo.temperamentos)
        );
        this.showImagesContainer = false;
        break;
      case 'images':
        this.setCardContent('Imágenes', this.mestizo.nombre, '');
        this.showImagesContainer = true;
        setTimeout(() => {
          this.isLoadingImg = false;
        }, 1000);
        break;
      default:
        this.changeCardContent('caracteristicas');
        break;
    }
  }

  formatCharacteristics(characteristics: any): string {
    if (!characteristics) {
      return '<p>No se han proporcionado características.</p>';
    }
  
    const { tamano, peso, pelaje, color, ojos } = characteristics;
  
    return `
      <p class="text-lg">
      <span class="font-bold ">Tamaño:</span> ${tamano || 'N/A'}
      </p>
      <hr class="my-3">
      <p class="text-lg"><span class="font-bold">Peso:</span> ${peso || 'N/A'}</p>
      <hr class="my-3">
      <p class="text-lg"><span class="font-bold ">Pelaje:</span> ${pelaje || 'N/A'}</p>
      <hr class="my-3">
      <p class="text-lg"><span class="font-bold ">Color:</span> ${color || 'N/A'}</p>
      <hr class="my-3">
      <p class="text-lg"><span class="font-bold">Ojos:</span> ${ojos || 'N/A'}</p>
      <hr class="my-3">
    `;
  }  

  formatTemperamento(temperamento: any): string {
    if (!temperamento || !Array.isArray(temperamento)) {
      return '<p>No se ha proporcionado temperamento.</p>';
    }
  
    return temperamento
      .map((temp: any) => {
        const foundTemperamento = TemperamentosMestizos.find(t => t.nombre === temp);
        return foundTemperamento 
          ? `<p><span class="font-bold">${foundTemperamento.nombre}:</span> ${foundTemperamento.descripcion}</p>` 
          : '';
      })
      .join('<hr class="my-3">');
  }

  setCardContent(heading: string, subtitle: string, content: string) {
    this.cardHeading = heading;
    this.cardSubtitle = subtitle;
    this.cardContent = content;
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

  async openModalSwiper(mestizo: Mestizos) {
    const modal = await this.modalController.create({
      component: ModalSwiperPage,
      componentProps: { images: this.getImagesArray(mestizo), initialSlide: 0 }
    });
    await modal.present();
  }
}