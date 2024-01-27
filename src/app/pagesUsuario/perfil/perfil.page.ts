import { Component, OnInit } from '@angular/core';
import { SessionDataService } from 'src/app/Services/session-data.service';
import {
  collection,
  doc,
  setDoc,
  Firestore,
  getDoc,
  query,
  where,
  updateDoc,
  getDocs,
} from '@angular/fire/firestore';
import {
  uploadBytes,
  ref,
  Storage,
  listAll,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  imagensPerfil: any = [];
  fotoPerfil: any = {}
  dadosUser: any = {};
  isMenuOpen = false;
  isModalOpen = false;
  readOnly = true;
  bioReadOnly = true
  loading = false;

  constructor(
    private sessionService: SessionDataService,
    private firestore: Firestore,
    private storage: Storage,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.listarDados();
    this.listarFotos();
    this.listarFotoPerfil();
  }

  async listarFotos() {
    this.loading = true;
    let idUsuario = await this.sessionService.get('id');
    const listRef = ref(this.storage, `fotosUsuarios/${idUsuario}`);
    listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          getDownloadURL(itemRef).then((res) => {
            this.imagensPerfil = [
              ...this.imagensPerfil,
              {
                imgName: itemRef.name,
                imgURL: res,
              },
            ];
            setTimeout(() => {
              this.loading = false;
            }, 1000);
          });
        });
      })
      .catch((error) => { });
  }

  async listarFotoPerfil() {
    this.loading = true;

    let idUsuario = await this.sessionService.get('id');
    const listRef = ref(this.storage, `fotosUsuarios/${idUsuario}/FotosPerfil/`);
    listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          getDownloadURL(itemRef).then((res) => {
            this.fotoPerfil =
            {
              imgName: itemRef.name,
              imgURL: res,
            },

              setTimeout(() => {
                this.loading = false;
              }, 1000);
          });
        });
      })
      .catch((error) => { });
  }

  async cadastrarFotoPerfil(e: any) {
    this.loading = true;

    let idUsuario = await this.sessionService.get('id');
    let foto = e.target.files[0];
    /* const newName = uuidv4(foto.name); */
    const imageRef = ref(this.storage, `fotosUsuarios/${idUsuario}/FotosPerfil/foto1`);
    uploadBytes(imageRef, foto);
    this.fotoPerfil = {};

    setTimeout(() => {
      this.listarFotoPerfil();
      this.loading = false;
    }, 1000);
  }

  async cadastrarFoto(e: any) {
    this.loading = true;

    let idUsuario = await this.sessionService.get('id');
    let foto = e.target.files[0];
    const newName = uuidv4(foto.name);
    const imageRef = ref(this.storage, `fotosUsuarios/${idUsuario}/${newName}`);
    uploadBytes(imageRef, foto);
    this.imagensPerfil = [];

    setTimeout(() => {
      this.listarFotos();
      this.loading = false;
    }, 1000);
  }

  ativarInput2() {
    document.getElementById('inputFile2')?.click();
  }
  ativarInput() {
    document.getElementById('inputFile')?.click();
  }

  async apagarImg(img: any) {
    this.loading = true;
    let idUsuario = await this.sessionService.get('id');
    const imageRef = ref(this.storage, `fotosUsuarios/${idUsuario}/${img}`);
    deleteObject(imageRef)
      .then(() => {
        this.imagensPerfil = [];
        this.listarFotos();
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
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
            modal.dismiss();
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
        sobrenome: doc.data()['sobrenome'],
        apelido: doc.data()['apelido'],
        bio: doc.data()['bio'],
        dataNasc: doc.data()['dataNasc'],
        idade: idade.toFixed(0),
        email: doc.data()['email'],
        telefone: doc.data()['telefone'],
        nivelAcesso: doc.data()['nivelAcesso'],
      };
    });
  }

  editarBioOn() {
    this.bioReadOnly = !this.bioReadOnly
  }

  async editarBio(bio: any) {
    this.bioReadOnly = !this.bioReadOnly
    let dadosEdit: any = {
      bio: bio,
    };
    let id = await this.sessionService.get('id');
    const document = doc(collection(this.firestore, 'Usuarios'), id);
    updateDoc(document, dadosEdit);
  }

  editarOn() {
    this.readOnly = !this.readOnly;
    this.listarDados();
  }

  async editarDados() {
    let dadosEdit: any = {
      nome: this.dadosUser.nome,
      sobrenome: this.dadosUser.sobrenome,
      apelido: this.dadosUser.apelido,
      telefone: this.dadosUser.telefone,
      dataNasc: this.dadosUser.dataNasc,
    };

    if (dadosEdit.nome === '' || dadosEdit.sobrenome === '' || dadosEdit.dataNasc === '') {
      console.log('Preencha os campos com "*"');
    } else {
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
