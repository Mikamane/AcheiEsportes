import { Component, OnInit } from '@angular/core';
import { SessionDataService } from 'src/app/Services/session-data.service';

@Component({
  selector: 'app-tela-inicial',
  templateUrl: './tela-inicial.page.html',
  styleUrls: ['./tela-inicial.page.scss'],
})
export class TelaInicialPage implements OnInit {
  constructor(private sessionService: SessionDataService) {}

  ngOnInit() {}

  async sair() {
    await this.sessionService.clear();
    this.sessionService.setMyVariable(0);
  }
}
