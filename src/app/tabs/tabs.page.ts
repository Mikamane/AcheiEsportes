import { Component, OnInit } from '@angular/core';
import { SessionDataService } from 'src/app/Services/session-data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  isLogged: boolean = false;

  constructor(private sessionService: SessionDataService) {}

  ngOnInit() {
    this.sessionService.myVariable$.subscribe((value) => {
      this.doSomethingWhenVariableChanges(value);
    });
  }

  doSomethingWhenVariableChanges(newValue: any) {
    if (newValue != 0) {
      this.isLogged = true;
    }
    else{
      this.isLogged = false;
    }
  }
}
