import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ParamMap, ActivatedRoute } from '@angular/router';
import { UserDetailsComponent } from './user-details.component';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from '../users.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalStack } from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';
import { User } from '../user';
import { Observable } from 'rxjs/Observable';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import 'rxjs/add/observable/of';

describe('UserDetailsComponent', () => {

	let user: User =
		{
			'id': 1,
			'firstName': 'John',
			'lastName': 'Doe',
			'age': 15,
			'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquam varius enim, mollis tincidunt velit. Donec dolor sem, mattis vel tristique eu, fringilla vel mauris. In hac habitasse platea dictumst. Ut aliquet libero quis urna interdum scelerisque. Donec gravida mi nec luctus venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
		};
	let expectedUser;
	let component: UserDetailsComponent;
	let fixture: ComponentFixture<UserDetailsComponent>;
	let activatedRoute: ActivatedRoute;
	let spy;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule, NgbModule, HttpClientTestingModule, RouterTestingModule],
			declarations: [ UserDetailsComponent ],
			providers: [ UsersService, NgbModal, NgbModalStack,  { provide: ActivatedRoute, useValue: {  params: Observable.of( {id: user.id} ) } }, ]
		})
		.compileComponents();
	}));

	beforeEach(() => {

		expectedUser = user;
		fixture = TestBed.createComponent( UserDetailsComponent );
		component = fixture.componentInstance;


		spy = spyOn( component, 'getUser' ).and.callThrough().and.returnValue( Observable.of( user ) );

	});

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	});

	it( 'should load user from route parameter', () => {
		fixture.detectChanges();
		expect( component.getUser ).toHaveBeenCalled();

		spy.calls.mostRecent().returnValue.subscribe( data => {
			expect( expectedUser ).toEqual( data );
		}
	)
	});
});

