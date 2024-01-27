import { Component, OnInit } from '@angular/core';
import { SessionDataService } from 'src/app/Services/session-data.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  imagensPerfil: any = [];
  dadosUser: any = {};
  isMenuOpen = false;
  isModalOpen = false;
  readOnly = true;
  loading = false;
  constructor( private sessionService: SessionDataService) { }

  ngOnInit() {
  }


  async sair() {
    this.openMenu();
    await this.sessionService.clear();
    this.sessionService.setMyVariable(0);
  }

  /* Funções relacionadas a abrir o menu e o modal */
  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
