import { Component, OnInit } from '@angular/core';
import { SessionDataService } from 'src/app/Services/session-data.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  produtos: any = [];
  isOpen = false
  constructor(private sessionService: SessionDataService) { }

  ngOnInit() { }

  add() {
    this.produtos = [
      ...this.produtos,
      {
        n: 2,
      },
    ];
  }

  async sair() {
    this.openPop()
    await this.sessionService.clear();
    this.sessionService.dadosSessao.email = '';
    this.sessionService.dadosSessao.privilege = '';
    this.sessionService.setMyVariable(0);
  }

  openPop() {
    this.isOpen = !this.isOpen
  }
}
