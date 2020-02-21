import { MenuComponent } from './Components/menu/menu.component';
import { ResturantsComponent } from './Components/resturants/resturants.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '',     component: ResturantsComponent},
  { path: 'menu',     component: MenuComponent},
  { path: 'rest',     component: ResturantsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
