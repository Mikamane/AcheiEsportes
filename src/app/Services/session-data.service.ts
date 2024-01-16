import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionDataService {


  private myVariableSource = new BehaviorSubject<any>(0);
  myVariable$ = this.myVariableSource.asObservable();

  setMyVariable(newValue: any) {
    this.myVariableSource.next(newValue);
  }


  /* ############################## SESSION ########################################### */
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set(key: string, value: any) {
    let result = await this._storage?.set(key, value);
  }

  public async get(key: string) {
    let value = await this._storage?.get(key);
    return value;
  }

  public async clear() {
    let value = await this._storage?.clear();
  }

  /* Como chamar em outros componentes
import { SessionDataService } from 'src/app/Services/session-data.service';


  dadosSessao = {
    email: '',
    password: '',
    privilege: '',
  };

  constructor(private sessionService: SessionDataService) {}

  

  async armazenar(email: any, pass: any) {
    await this.sessionService.set('email', email);
    await this.sessionService.set('password', pass);
    this.buscar();
  }

  async buscar() {
    this.dadosSessao.username = await this.sessionService.get('email');
    this.dadosSessao.password = await this.sessionService.get('password');
  }

  async sair() {
    await this.sessionService.clear();
    this.dadosSessao.email: '';
    this.dadosSessao.password: '';
    this.dadosSessao.privilege: '';
  }
  
  */
}
