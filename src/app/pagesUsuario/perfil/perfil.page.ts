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
  dadosUser: any = [];
  isMenuOpen = false;
  isModalOpen = false;

  constructor(private sessionService: SessionDataService, private firestore: Firestore) { }


  ngOnInit() {
    this.listarDados()
  }


  add() {
    this.produtos = [
      ...this.produtos,
      {
        n: 2,
      },
    ];
  }




  async listarDados() {
    let email = this.sessionService.get('email')
    const docRef = doc(this.firestore, "Usuarios", await email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let dataConverted = this.convertDate(docSnap.data()['dataNasc'])
      let idade = this.calculateAge(dataConverted)
      this.dadosUser = [
        ...this.dadosUser, {
          nome: docSnap.data()['nome'],
          apelido: docSnap.data()['apelido'],
          dataNasc: dataConverted,
          idade: idade,
          email: docSnap.data()['email'],
          nivelAcesso: docSnap.data()['nivelAcesso'],
        },]
    }
  }


  /* Função para deslogar, limpando os dados do storage e mudando a variavel de login */
  async sair() {
    this.openMenu()
    await this.sessionService.clear();
    this.sessionService.setMyVariable(0);
  }


  /* Funções relacionadas a abrir o menu e o modal */
  openMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  openModal() {
    this.isModalOpen = !this.isModalOpen
  }

  private convertDate(date: string): string {
    const parts = date.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birthDateObject = new Date(birthDate);

    let years = today.getFullYear() - birthDateObject.getFullYear();
    let months = today.getMonth() - birthDateObject.getMonth();
    let days = today.getDate() - birthDateObject.getDate();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (days < 0) {
      months--;
      days += 31;
    }

    return years + months / 12 + days / 365.25;
  }
}
