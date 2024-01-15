import { Component, OnInit } from '@angular/core';
import { SessionDataService } from 'src/app/Services/session-data.service';
import { collection, doc, setDoc, Firestore, getDoc, query, where, } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  produtos: any = [];
  isMenuOpen = false;
  isModalOpen = false;

  constructor(private sessionService: SessionDataService, private firestore: Firestore) { }

  
  ngOnInit() {
  }


  add() {
    this.produtos = [
      ...this.produtos,
      {
        n: 2,
      },
    ];
  }


  /* Função para deslogar, limpando os dados do storage e mudando a variavel de login */
  async sair() {
    this.openMenu()
    await this.sessionService.clear();
    this.sessionService.dadosSessao.email = '';
    this.sessionService.dadosSessao.privilege = '';
    this.sessionService.setMyVariable(0);
  }


  /* Funções relacionadas a abrir o menu e o modal */
  openMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  openModal() {
    this.isModalOpen = !this.isModalOpen
  }
}
