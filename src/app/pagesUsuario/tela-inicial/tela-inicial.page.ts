import { Component, OnInit } from '@angular/core';
import { collection, doc, setDoc, Firestore, getDoc, query, where, getDocs, } from '@angular/fire/firestore';

@Component({
  selector: 'app-tela-inicial',
  templateUrl: './tela-inicial.page.html',
  styleUrls: ['./tela-inicial.page.scss'],
})
export class TelaInicialPage implements OnInit {
  selecaoEsportes: any = []
  selecaoBairros: any = []
  infosEmpresas: any = []
  indice: number = -1

  constructor(private firestore: Firestore) { }

  ngOnInit() {
    this.categoriasEsportes()
    this.categoriasBairros()
  }


  async buscarEmpresas(esporte: any = '', bairro: any = '', idade: any = '', valor: any = '', turno: any = '') {
    this.infosEmpresas = []
    this.indice = -1

    let tamanhoArray = [esporte.length, bairro.length, idade.length, valor.length, turno.length]

    let maior = tamanhoArray[0]

    for (let i in tamanhoArray) {
      if (tamanhoArray[i] > maior) {
        maior = tamanhoArray
      }
    }

    for (let i = 0; i <= maior; i++) {
      const userQuery = query(
        collection(this.firestore, 'Usuarios'),
        where('esportes', 'array-contains', `${esporte[i]}`),
        /* where('bairro', '==', `${bairro[i]}`),
        where('faixaEtaria', 'array-contains', `${idade[i]}`),
        where('mensalidade', '==', `${valor[i]}`),
        where('turnos', 'array-contains', `${turno[i]}`) */
      );
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((doc: any) => {
  
        let turnoDesejado = []

        let verificarTurnos = doc.data()['turnos']

        for (let t in verificarTurnos) {
          turnoDesejado.push(verificarTurnos[t])
        }

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
            turno: turnoDesejado,
          },]
      });
    }

    document.getElementById('filterMenu')?.click()
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


