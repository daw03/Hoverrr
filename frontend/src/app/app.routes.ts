import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CreateEventoComponent } from './evento/create/create.component';
import { EditEventoComponent } from './evento/edit/edit.component';
import { IndexComponent } from './evento/index/index.component';
import { MineComponent } from './evento/mine/mine.component';
import { ViewEventoComponent } from './evento/view/view.component';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: SigninComponent },
  { path: 'register', component: SignupComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'evento/create', component: CreateEventoComponent },
  { path: 'evento/edit/:id', component: EditEventoComponent },
  { path: 'evento/index', component: IndexComponent },
  { path: 'evento/mine', component: MineComponent },
  { path: 'evento/view/:id', component: ViewEventoComponent },
];
