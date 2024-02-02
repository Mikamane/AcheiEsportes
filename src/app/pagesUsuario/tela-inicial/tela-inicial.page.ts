import { Component, OnInit } from '@angular/core';
import { collection, doc, setDoc, Firestore, getDoc, query, where, getDocs, } from '@angular/fire/firestore';
import {
  uploadBytes,
  ref,
  Storage,
  listAll,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';

@Component({
  selector: 'app-tela-inicial',
  templateUrl: './tela-inicial.page.html',
  styleUrls: ['./tela-inicial.page.scss'],
})
export class TelaInicialPage implements OnInit {
  selecaoEsportes: any = []
  selecaoBairros: any = []
  infosEmpresas: any = []
  infosFiltradas: any = []
  indice: number = -1

  constructor(private firestore: Firestore, private storage: Storage,) { }

  ngOnInit() {
    this.categoriasEsportes()
    this.categoriasBairros()
  }


  async buscarEmpresas(esporte: any = '') {
    this.infosEmpresas = []
    this.indice = -1

    for (let i = 0; i <= esporte.length; i++) {
      const userQuery = query(
        collection(this.firestore, 'Usuarios'),
        where('esportes', 'array-contains', `${esporte[i]}`));

      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((doc: any) => {
        this.indice += 1
        this.infosEmpresas = [
          ...this.infosEmpresas,
          {
            indice: this.indice,
            id: doc.id,
            nomeLocal: doc.data()['nomeEstabelecimento'],
            cep: doc.data()['cep'],
            bairro: doc.data()['bairro'],
            rua: doc.data()['rua'],
            numero: doc.data()['numero'],
            mensalidade: doc.data()['mensalidade'],
            idade: doc.data()['faixaEtaria'],
            esportes: doc.data()['esportes'],
            turno: doc.data()['turnos'],
            logoURL: '',
            fotos: []
          },]
      });
    }
    this.buscarFotoPerfil()
    this.buscarFotosSlide()
    document.getElementById('filterMenu')?.click()

  }

  async buscarFotosSlide() {

    for (let i = 0; i < this.infosEmpresas.length; i++) {
      let id = this.infosEmpresas[i].id
      const listRef = ref(this.storage, `fotosUsuarios/${id}`);
      listAll(listRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            getDownloadURL(itemRef).then((res) => {
              this.infosEmpresas[i].fotos.push(res)
            });
          });
        })
    }
  }

  async buscarFotoPerfil() {

    for (let i = 0; i < this.infosEmpresas.length; i++) {
      let id = this.infosEmpresas[i].id
      const listRef = ref(this.storage, `fotosUsuarios/${id}/FotosPerfil/`);
      listAll(listRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            getDownloadURL(itemRef).then((res) => {
              this.infosEmpresas[i].logoURL = res
            });
          });
        })
    }
  }

  async categoriasEsportes() {
    const esportesSearch = doc(collection(this.firestore, 'infosPesquisas'), 'Esportes');
    const esportesBusca: any = await getDoc(esportesSearch);
    const esportesArray = esportesBusca.data().Esportes

    for (let i in esportesArray) {
      this.selecaoEsportes.push(esportesArray[i])
    }
    this.selecaoEsportes.sort()
  }

  async categoriasBairros() {
    const bairrosSearch = doc(collection(this.firestore, 'infosPesquisas'), 'Bairros');
    const bairrosBusca: any = await getDoc(bairrosSearch);
    const bairrosArray = bairrosBusca.data().Bairros

    for (let i in bairrosArray) {
      this.selecaoBairros.push(bairrosArray[i])
    }
    this.selecaoBairros.sort()
  }

}


