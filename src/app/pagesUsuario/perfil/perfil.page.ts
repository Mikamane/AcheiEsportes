import { Component, OnInit } from '@angular/core';
import { SessionDataService } from 'src/app/Services/session-data.service';
import { collection, doc, setDoc, Firestore, getDoc, query, where, updateDoc, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  produtos: any = [];
  dadosUser: any = {};
  isMenuOpen = false;
  isModalOpen = false;
  readOnly = true

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




  /* Função que busca os dados do usuário no BD e joga pro objeto declarado acima, que então mostra os dados na página */
  async listarDados() {
    let email = this.sessionService.get('email')
    const userQuery = query(collection(this.firestore, "Usuarios"), where("email", "==", `${email}`));
    const querySnapshot = await getDocs(userQuery);
    querySnapshot.forEach((doc) => {
      let idade = this.calculateAge(doc.data()['dataNasc'])
      this.dadosUser = {
        id: doc.id,
        nome: doc.data()['nome'],
        apelido: doc.data()['apelido'],
        dataNasc: doc.data()['dataNasc'],
        idade: idade.toFixed(0),
        email: doc.data()['email'],
        nivelAcesso: doc.data()['nivelAcesso'],
      }
      console.log(doc.id) //Continuar daqui 10:00 - 16/01/2024
    });
    console.log(this.dadosUser.nome)

  }

  editarOn() {
    this.readOnly = !this.readOnly
  }

  async editarDados() {
    let dadosEdit: any = {
      nome: this.dadosUser.nome,
      apelido: this.dadosUser.apelido,
      dataNasc: this.dadosUser.dataNasc,
    }
    let email = this.sessionService.get('email')
    const docRef = doc(this.firestore, "Usuarios", await email);
    updateDoc(docRef, dadosEdit);
    this.listarDados()
    this.editarOn()

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


  /* Funções relacionada à troca do formato BR para o americano, e o calculo de idade */

  /* 
  INÚTIL ATUALMENTE
  private convertDate(date: string): string {
    const parts = date.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  } */

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
