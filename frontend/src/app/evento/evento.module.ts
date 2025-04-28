import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateEventoComponent } from './create/create.component';
import { EditEventoComponent } from './edit/edit.component';
import { ViewEventoComponent } from './view/view.component';
import { IndexComponent } from './index/index.component';
import { MineComponent } from './mine/mine.component';
import { EventoRoutingModule } from './evento-routing.module';


@NgModule({
  declarations: [
    CreateEventoComponent,
    EditEventoComponent,
    ViewEventoComponent,
    IndexComponent,
    MineComponent,
  ],
  imports: [
    CommonModule,
    EventoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class EventoModule { }
