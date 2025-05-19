import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { IndexUserComponent } from './user/index/index.component';
import { IndexCategoriaComponent } from './categorias/index/index.component';
import { CreateCategoriaComponent } from './categorias/create/create.component';
import { EditCategoriaComponent } from './categorias/edit/edit.component';
import { IndexEventoComponent } from './eventos/index/index.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'users', component: IndexUserComponent },
      { path: 'categorias', component: IndexCategoriaComponent },
      { path: 'categorias/create', component: CreateCategoriaComponent },
      { path: 'categorias/edit/:id', component: EditCategoriaComponent },
      { path: 'eventos', component: IndexEventoComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}