import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () =>
          import('../pagesUsuario/tela-inicial/tela-inicial.module').then(
            (m) => m.TelaInicialPageModule
          ),
      },
      {
        path: 'turmas',
        loadChildren: () =>
          import('../pagesUsuario/turmas/turmas.module').then(
            (m) => m.TurmasPageModule
          ),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../pagesUsuario/perfil/perfil.module').then(
            (m) => m.PerfilPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/inicio',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
