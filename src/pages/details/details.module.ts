import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsPage } from './details';

@NgModule({
  declarations: [
    DetailsPageModule,
  ],
  imports: [
    IonicPageModule.forChild(DetailsPage),
  ],
})
export class DetailsPageModule {}
