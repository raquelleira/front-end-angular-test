import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { DeactivateRouteGuard } from '../guards/deactive-route-guard.service';

const routes = [
	{ path: '', component: UsersComponent, pathMatch: 'full' },
	{ path: 'user-details/:id', canDeactivate: [DeactivateRouteGuard], component: UserDetailsComponent, pathMatch: 'full' }
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ],
	providers: [ DeactivateRouteGuard ],
})
export class UsersRoutingModule {}
