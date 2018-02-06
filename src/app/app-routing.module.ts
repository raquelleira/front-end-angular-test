import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
	{ path: '', redirectTo: 'users', pathMatch: 'full' },
	//Lazy loading users module
	{ path: 'users', loadChildren: 'app/users/users.module#UsersModule' },
];

@NgModule({
	imports: [
		RouterModule.forRoot( routes )
	],
	declarations: [],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }
