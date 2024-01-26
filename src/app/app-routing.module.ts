import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'tela-inicial',
    loadChildren: () =>
      import('./pagesUsuario/tela-inicial/tela-inicial.module').then(
        (m) => m.TelaInicialPageModule
      ),
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./pagesUsuario/perfil/perfil.module').then(
        (m) => m.PerfilPageModule
      ),
  },
  {
    path: 'turmas',
    loadChildren: () =>
      import('./pagesUsuario/turmas/turmas.module').then(
        (m) => m.TurmasPageModule
      ),
  },
  {
    path: 'perfilPJ',
    loadChildren: () => import('./pagesEmpresa/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'criar',
    loadChildren: () => import('./pagesEmpresa/criar/criar.module').then( m => m.CriarPageModule)
  },
  {
    path: 'turmas',
    loadChildren: () => import('./pagesEmpresa/turmas/turmas.module').then( m => m.TurmasPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
