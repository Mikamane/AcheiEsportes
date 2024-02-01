import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TelaInicialPageRoutingModule } from './tela-inicial-routing.module';

import { TelaInicialPage } from './tela-inicial.page';

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TelaInicialPageRoutingModule,
  ],
  declarations: [TelaInicialPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TelaInicialPageModule {}
