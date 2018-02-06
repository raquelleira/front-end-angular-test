import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonsModule } from '../commons/commons.module';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { HttpClientModule }    from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
//Contains the users.json data as a database mockup.
import { InMemoryDataService }  from './../in-memory-data.service';
import { UsersService } from './users.service';
import { UserDetailsComponent } from './user-details/user-details.component';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgbModule,
		UsersRoutingModule,
		HttpClientModule,
		CommonsModule,
		// TO DO: Remove the InMemoryWebApiModule once database and
		// api endpoints are done. We're using it to mock http calls
		// to manipulate users info.
		HttpClientInMemoryWebApiModule.forRoot(
			InMemoryDataService, { dataEncapsulation: false }
		)
	],
	declarations: [UsersComponent, UserDetailsComponent],
	providers: [UsersService]
})
export class UsersModule { }
