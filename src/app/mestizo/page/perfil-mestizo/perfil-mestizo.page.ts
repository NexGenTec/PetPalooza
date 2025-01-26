import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MestizosService } from '../../service/mestizos.service';
import { Mestizos, Users } from '../../models/users.models';
import { UserSessionService } from '../../service/user-session.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-perfil-mestizo',
  templateUrl: './perfil-mestizo.page.html',
  styleUrls: ['./perfil-mestizo.page.scss'],
})
export class PerfilMestizoPage implements OnInit  {
  isLoading: boolean = false;
  mestizoId: string;
  mestizo: Mestizos;
  user: Users;
  

  constructor(
    private route: ActivatedRoute,
    private mestizosService: MestizosService,
    private userSessionService: UserSessionService
    
  ) {

  }

  ngOnInit() {
    this.getMestizoId();
    this.route.paramMap.subscribe(params => {
      this.mestizoId = params.get('id');
      if (this.mestizoId) {
        this.loadMestizoAndUser();
      }
    });
  }

  private getMestizoId(): void {
    this.route.paramMap.subscribe(params => {
      this.mestizoId = params.get('id');
    });
  }

  loadMestizoAndUser() {
    this.userSessionService.user$.pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.mestizosService.getMestizoByIdAndUser(user.id, this.mestizoId);
        }
        return of(null);
      })
    ).subscribe({
      next: (mestizo) => {
        if (mestizo) {
          this.mestizo = mestizo;
          console.log('Mestizo y usuario cargados:', this.mestizo, this.user);
        } else {
          console.log('Mestizo no encontrado');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar el mestizo:', error);
        this.isLoading = false;
      },
    });
  }
  
  
}
