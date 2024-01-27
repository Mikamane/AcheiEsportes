import { Component, OnInit } from '@angular/core';
import { SessionDataService } from 'src/app/Services/session-data.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  isLogged: boolean = false;
  sessionLevel: any = ''

  constructor(private sessionService: SessionDataService) {

  }

  ngOnInit() {
    this.sessionService.myVariable$.subscribe((value) => {
      this.doSomethingWhenVariableChanges(value);
    });
  }

  /* Verifica se há algum dado no storage quando a página é reiniciada */
  async ionViewWillEnter(event: ViewWillEnter) {
    let privilege = await this.sessionService.get('privilege');
    if (privilege != null) {
      this.isLogged = true;
      this.sessionLevel = privilege
    } else {
      this.isLogged = false;
    }
  }

  async doSomethingWhenVariableChanges(newValue: any) {
    if (newValue != 0) {
      this.isLogged = true;
      this.sessionLevel = await this.sessionService.get('privilege');
    }
    else {
      this.isLogged = false;
    }
  }
}
