import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CreateEventoComponent } from './evento/create/create.component';
import { EditEventoComponent } from './evento/edit/edit.component';
import { IndexComponent } from './evento/index/index.component';
import { TodoComponent } from './evento/todo/todo.component';
import { MineComponent } from './evento/mine/mine.component';
import { MinecreatedComponent } from './evento/minecreated/minecreated.component';
import { ViewEventoComponent } from './evento/view/view.component';
import { ContactoComponent } from './otros/contacto/contacto.component';
import { UserProfileEditComponent } from './components/user-profile-edit/user-profile-edit.component';
import { AdminModule } from './admin/admin.module';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: SigninComponent },
  { path: 'register', component: SignupComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'profile/edit', component: UserProfileEditComponent },
  { path: 'evento/create', component: CreateEventoComponent },
  { path: 'evento/edit/:id', component: EditEventoComponent },
  { path: 'evento/index', component: IndexComponent },
  { path: 'evento/todo', component: TodoComponent},
  { path: 'evento/mine', component: MineComponent },
  { path: 'evento/minecreated', component: MinecreatedComponent },
  { path: 'evento/view/:id', component: ViewEventoComponent },
  { path: 'contacto', component: ContactoComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
];
