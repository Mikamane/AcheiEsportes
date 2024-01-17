import { Component, OnInit } from '@angular/core';
import { SessionDataService } from 'src/app/Services/session-data.service';
import {
  collection, doc, setDoc, Firestore, getDoc, query, where, updateDoc, getDocs,
} from '@angular/fire/firestore';
import { uploadBytes, ref, Storage, listAll, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';
import { AlertController } from '@ionic/angular';

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



  constructor(
    private sessionService: SessionDataService,
    private firestore: Firestore,
    private storage: Storage,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.listarDados();
    this.listarFotos();
  }



  async listarFotos() {
    let idUsuario = await this.sessionService.get('id');
    const listRef = ref(this.storage, `fotosUsuarios/${idUsuario}`);
    listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          getDownloadURL(itemRef).then((res) => {
            this.imagensPerfil = [
              ...this.imagensPerfil, {
                imgName: itemRef.name,
                imgURL: res
              }
            ]
          });
        });
      })
      .catch((error) => { });
  }


  async cadastrarFoto(e: any) {
    let idUsuario = await this.sessionService.get('id');
    let foto = e.target.files[0];
    const newName = uuidv4(foto.name);
    const imageRef = ref(this.storage, `fotosUsuarios/${idUsuario}/${newName}`);
    uploadBytes(imageRef, foto);
    setTimeout(() => {
      this.imagensPerfil = [];
      this.listarFotos();
    }, 2000);
  }

  ativarInput() {
    document.getElementById('inputFile')?.click();
  }


  async apagarImg(img: any) {
    let idUsuario = await this.sessionService.get('id');
    const imageRef = ref(this.storage, `fotosUsuarios/${idUsuario}/${img}`);
    deleteObject(imageRef).then(() => {
      setTimeout(() => {
        this.imagensPerfil = [];
        this.listarFotos();
      }, 2000);
    }).catch((error) => {
      console.log(error)
    });

  }

  async presentAlert(img: any, modal: any) {
    const alert = await this.alertController.create({
      header: 'Deseja apagar esta imagem?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('cancelou');
          },
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.apagarImg(img);
            modal.dismiss()
          },
        },
      ],
    });

    await alert.present();
  }


  /* Função que busca os dados do usuário no BD e joga pro objeto declarado acima, que então mostra os dados na página */
  async listarDados() {
    let emailSessao = await this.sessionService.get('email');
    const userQuery = query(
      collection(this.firestore, 'Usuarios'),
      where('email', '==', `${emailSessao}`)
    );
    const querySnapshot = await getDocs(userQuery);
    querySnapshot.forEach((doc: any) => {
      let idade = this.calculateAge(doc.data()['dataNasc']);
      this.dadosUser = {
        id: doc.id,
        nome: doc.data()['nome'],
        apelido: doc.data()['apelido'],
        dataNasc: doc.data()['dataNasc'],
        idade: idade.toFixed(0),
        email: doc.data()['email'],
        nivelAcesso: doc.data()['nivelAcesso'],
      };
    });
  }

  editarOn() {
    this.readOnly = !this.readOnly;
    this.listarDados();
  }

  async editarDados() {
    let dadosEdit: any = {
      nome: this.dadosUser.nome,
      apelido: this.dadosUser.apelido,
      dataNasc: this.dadosUser.dataNasc,
    };

    if (dadosEdit.nome === '' || dadosEdit.dataNasc === '') {
      console.log('Preencha os campos com "*"');
    } else {
      console.log('Nome:' + dadosEdit.nome);
      let id = await this.sessionService.get('id');
      const document = doc(collection(this.firestore, 'Usuarios'), id);
      updateDoc(document, dadosEdit);
      this.editarOn();

    }
  }

  /* Função para deslogar, limpando os dados do storage e mudando a variavel de login */
  async sair() {
    this.openMenu();
    await this.sessionService.clear();
    this.sessionService.setMyVariable(0);
  }

  /* Funções relacionadas a abrir o menu e o modal */
  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openModal() {
    this.isModalOpen = !this.isModalOpen;
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
