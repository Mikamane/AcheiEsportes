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
  turnoDesejado: any = []
  indice: number = -1

  constructor(private firestore: Firestore) { }

  ngOnInit() {
    this.categoriasEsportes()
    this.categoriasBairros()
  }


  async buscarEmpresas(bairro: any) {
    this.infosEmpresas = []
    for(let i = 0; i <= bairro.length ; i++){
      /* console.log(bairro[i]) */
      const userQuery = query(
        collection(this.firestore, 'Usuarios'),
        where('bairro', '==', `${bairro[i]}`)
      );
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((doc: any) => {
        
        this.turnoDesejado = []
  
        let verificarTurnos = doc.data()['horarioFuncionamento']
        console.log(`Verificar turnos${verificarTurnos}`)
  
        if (verificarTurnos[0] >= '05:00' && verificarTurnos[1] <= '12:00') {
          this.turnoDesejado = ['Manhã']
        } else if (verificarTurnos[0] >= '05:00' && verificarTurnos[1] <= '18:00') {
          this.turnoDesejado = ['Manhã', 'Tarde']
        } else {
          this.turnoDesejado = ['Manhã', 'Tarde', 'Noite']
        }
        
        this.infosEmpresas = [
          ...this.infosEmpresas,
          {
            indice: this.indice + 1,
            id: doc.id,
            nomeLocal: doc.data()['nomeEstabelecimento'],
            cep: doc.data()['cep'],
            bairro: doc.data()['bairro'],
            rua: doc.data()['rua'],
            numero: doc.data()['numero'],
            mensalidade: doc.data()['mensalidade'],
            idade: doc.data()['faixaEtaria'],
            esportes: doc.data()['esportes'],
            turno: this.turnoDesejado,
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


