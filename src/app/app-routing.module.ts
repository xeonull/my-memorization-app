import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GoComponent } from './go/go.component';
import { SettingsComponent } from './settings/settings.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/home', pathMatch:'full'},
  { path: 'go', component: GoComponent},
  { path: 'start', redirectTo: '/go', pathMatch:'full'},
  { path: 'settings', component: SettingsComponent},
  { path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
