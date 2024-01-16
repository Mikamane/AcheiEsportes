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

  constructor(private sessionService: SessionDataService) {

  }

  ngOnInit() {
    this.sessionService.myVariable$.subscribe((value) => {
      this.doSomethingWhenVariableChanges(value);
    });
  }

  /* Verifica se há algum dado no storage quando a página é reiniciada */
  async ionViewWillEnter(event: ViewWillEnter) {
    let email = await this.sessionService.get('email');
    if (email != null) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  doSomethingWhenVariableChanges(newValue: any) {
    if (newValue != 0) {
      this.isLogged = true;
    }
    else {
      this.isLogged = false;
    }
  }
}
