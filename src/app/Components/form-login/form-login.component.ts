import { Component, OnInit } from '@angular/core';
import { SessionDataService } from 'src/app/Services/session-data.service';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import { collection, doc, setDoc, Firestore, getDoc, query, where, getDocs, } from '@angular/fire/firestore';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss'],
})
export class FormLoginComponent implements OnInit {
  /* Declarações de variaveis */
  clearInputs: boolean = false;
  wantsCad: boolean = false
  cadType: String = ''
  dadosUsuario: any = {}

  constructor(private sessionService: SessionDataService, private auth: Auth, private firestore: Firestore) { }

  ngOnInit() {

  }


  /* Função para login com email e senha */
  async loginPadrao(email: any, pass: any) {
    if (email == '' || pass == '') {
      console.log('Preencha todos os campos!')
    } else {
      signInWithEmailAndPassword(this.auth, email, pass)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          if (user) {
            this.buscarUsuario(email)
            /* Limpar os campos dos formularios */
            this.clearInputs = true;
            /* Ir para o aplicativo */
            this.sessionService.setMyVariable(1);
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          console.log('Usuário incorreto ou inexistente')
        });
    }
  }





  /* Função para cadastro de pessoas físicas */
  async cadUser(email: any, pass: any, rePass: any) {
    /*  Verificações de campo vazio */
    if (email == '' || pass == '' || rePass == '') {
      console.log('Preencha todos os campos!');
    } else if (pass != rePass) {
      console.log('As senha precisam ser iguais!');
    } else {
      const userQuery = query(collection(this.firestore, "Usuarios"), where("email", "==", `${email}`));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        console.log('Usuário já existe')
      } else {
        /* Mandar alguns dados para o ionic Storage */
        console.log('Usuário cadastrado com sucesso!');
        /* Cadastrar no Auth */
        createUserWithEmailAndPassword(this.auth, email, pass)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });

        /* Cadastrar no Firestore */
        const User = {
          email: email,
          nivelAcesso: 'PF',
        }
        const document = doc(collection(this.firestore, 'Usuarios'));
        setDoc(document, User);
        this.buscarUsuario(email)
        /* Limpar os campos dos formularios */
        this.clearInputs = true;
        /* Ir para o aplicativo */
        this.sessionService.setMyVariable(1);
      }
    }
  }

  /* Função para cadastro de empresas */
  async cadEmpresa(email: any, pass: any, rePass: any) {
    /*  Verificações de campo vazio */
    if (email == '' || pass == '' || rePass == '') {
      console.log('Preencha todos os campos!');
    } else if (pass != rePass) {
      console.log('As senha precisam ser iguais!');
    } else {
      const userQuery = query(collection(this.firestore, "Usuarios"), where("email", "==", `${email}`));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        console.log('Empresa já cadastrada')
      } else {
        console.log('Empresa cadastrada com sucesso!');
        /* Cadastrar no Auth */
        createUserWithEmailAndPassword(this.auth, email, pass)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });

        /* Cadastrar no Firestore */
        const User = {
          email: email,
          nivelAcesso: 'PJ',
        }
        const document = doc(collection(this.firestore, 'Usuarios'));
        setDoc(document, User);
        this.buscarUsuario(email)
        /* Limpar os campos dos formularios */
        this.clearInputs = true;
        /* Ir para o aplicativo */
        this.sessionService.setMyVariable(1);
      }
    }
  }


  /* Função para login com o Google 
   async loginGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log(credential);
        result.user.displayName; 
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage);
        console.log(email, credential);
      });
  } */

  /* Função que busca no firestore um documento pelo email cadastrado */
  async buscarUsuario(email: any) {
    /* const docRef = doc(this.firestore, "Usuarios", email);
    const docSnap = await getDoc(docRef); */
    const userQuery = query(collection(this.firestore, "Usuarios"), where("email", "==", `${email}`));
    const querySnapshot = await getDocs(userQuery);
    querySnapshot.forEach((doc) => {
      this.dadosUsuario = {
        email: doc.data()['email'],
        privilege: doc.data()['nivelAcesso'],
        id: doc.id
      }
    });
    /* Armazenar na sessão */
    await this.sessionService.set('email', this.dadosUsuario.email);
    await this.sessionService.set('privilege', this.dadosUsuario.privilege);
    await this.sessionService.set('id', this.dadosUsuario.id);
  }

  /* Funções para a troca de componentes. Entre Login, escolha de cadastro e formulário de cadastro */
  goToCadChoice() {
    this.wantsCad = !this.wantsCad
  }

  chooseCad(choice: boolean) {
    if (choice) {
      this.cadType = 'PF'
    } else {
      this.cadType = 'PJ'
    }
  }


}
