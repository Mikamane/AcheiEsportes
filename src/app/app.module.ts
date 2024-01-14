import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Import do storage (parte da sessão do login) */
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
/* Imports do Firebase */
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB7WNdUjZAt3p8X09LXIm_AVL55RJahGdw',
  authDomain: 'achei--esportes.firebaseapp.com',
  projectId: 'achei--esportes',
  storageBucket: 'achei--esportes.appspot.com',
  messagingSenderId: '621937119519',
  appId: '1:621937119519:web:b899cd07ae0db945e8202a',
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: 'testdb',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
