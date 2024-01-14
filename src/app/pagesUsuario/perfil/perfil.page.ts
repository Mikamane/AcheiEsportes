import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  constructor() {}

  ngOnInit() {}

  produtos: any = [];

  add() {
    this.produtos = [
      ...this.produtos,
      {
        n: 2,
      },
    ];
  }
}
