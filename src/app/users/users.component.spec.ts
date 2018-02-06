import { async, ComponentFixture, inject, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalStack } from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './../in-memory-data.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { User } from './user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('UsersComponent', () => {
	let component: UsersComponent;
	let fixture: ComponentFixture<UsersComponent>;
	let usersService : UsersService;
	let getUsersSpy;

	let users = [
		{
			"id": 1,
			"firstName": "John",
			"lastName": "Doe",
			"age": 15,
			"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquam varius enim, mollis tincidunt velit. Donec dolor sem, mattis vel tristique eu, fringilla vel mauris. In hac habitasse platea dictumst. Ut aliquet libero quis urna interdum scelerisque. Donec gravida mi nec luctus venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
		}, {
			"id": 2,
			"firstName": "Mary",
			"lastName": "Jane",
			"age": 24,
			"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquam varius enim, mollis tincidunt velit. Donec dolor sem, mattis vel tristique eu, fringilla vel mauris. In hac habitasse platea dictumst. Ut aliquet libero quis urna interdum scelerisque. Donec gravida mi nec luctus venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
		}, {
			"id": 3,
			"firstName": "Patrick",
			"lastName": "Jane",
			"age": 33,
			"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque aliquam varius enim, mollis tincidunt velit. Donec dolor sem, mattis vel tristique eu, fringilla vel mauris. In hac habitasse platea dictumst. Ut aliquet libero quis urna interdum scelerisque. Donec gravida mi nec luctus venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
		}
	];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ NgbModule, HttpClientTestingModule, RouterTestingModule, HttpClientInMemoryWebApiModule.forRoot(
				InMemoryDataService, { dataEncapsulation: false }
			) ],
			declarations: [ UsersComponent ],
			providers: [ UsersService, NgbModal, NgbModalStack ],
		})
		.compileComponents();

	 }));

	beforeEach(() => {
		fixture = TestBed.createComponent(UsersComponent);
		component = fixture.componentInstance;

		usersService = TestBed.get(UsersService);
		usersService = fixture.debugElement.injector.get(UsersService);

		getUsersSpy = spyOn( usersService, 'getUsers' ).and.callThrough().and.returnValue( Observable.of( users ) );
		spyOn( component, 'search' ).and.callThrough();
		spyOn( component, 'filterNameChanged' ).and.callThrough();
		spyOn( component, 'download' ).and.callThrough();
		spyOn( component, 'deleteSelected' ).and.callFake( () => { return true } );

	});

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	});

	it( 'should display default view when window.width >= 1024', () => {
		component.viewWidth = 1024
		fixture.detectChanges();
		let defaultViewEl = fixture.debugElement.query(By.css('.default-view'));
		expect( defaultViewEl.nativeElement ).toBeDefined();
	});

	it( 'should not display mobile view when window.width >= 1024', () => {
		component.viewWidth = 1024
		fixture.detectChanges();
		let mobileViewEl = fixture.debugElement.query(By.css('.mobile-view'));
		expect( mobileViewEl ).toBeNull();
	});

	it( 'should display mobile view when window.width <= 1023', () => {
		component.viewWidth = 1023
		fixture.detectChanges();
		let mobileViewEl = fixture.debugElement.query(By.css('.mobile-view'));
		expect( mobileViewEl.nativeElement ).toBeDefined();
	});

	it( 'should not display mobile view when window.width <= 1023', () => {
		component.viewWidth = 1023
		fixture.detectChanges();
		let defaultViewEl = fixture.debugElement.query(By.css('.default-view'));
		expect( defaultViewEl ).toBeNull();
	});

	it( 'should disable delete button if no users were selected', () => {
		component.selection = [];
		component.viewWidth = 1024
		fixture.detectChanges();
		let deleteSelectedEl = fixture.debugElement.query(By.css('.delete'));
		expect( deleteSelectedEl.nativeElement.disabled ).toBeTruthy();
	});

	it( 'should not call users service before component is initialized', () => {
		expect( getUsersSpy.calls.any() ).toBe( false, 'UsersService getUsers not called yet' );
		expect( component.loaded ).toEqual( [] );
		expect( component.users ).toEqual( [] );
	});

	it( 'should call users service on init', () => {
		fixture.detectChanges();
		expect( getUsersSpy.calls.any() ).toBe( true, 'UsersService getUsers called' );
		expect( component.loaded ).toEqual( users );
		expect( component.users ).toEqual( users );
	});

	it( 'should load users data asynchronous after init', () => {
		fixture.detectChanges();
		getUsersSpy.calls.mostRecent().returnValue.subscribe( data => {
				expect( data ).toEqual( users );
			}
		)
	});

	it( 'should select/unselect all users on mastertoggle clicked', () => {
		component.selection = [];
		component.viewWidth = 1024
		fixture.detectChanges();
		let deleteSelectedEl = fixture.debugElement.query(By.css('.delete'));
		let masterToggleEl = fixture.debugElement.query(By.css('.master-toggle'));

		click( masterToggleEl );
		fixture.detectChanges();

		expect( deleteSelectedEl.nativeElement.disabled ).toBeFalsy();

		click( masterToggleEl );
		fixture.detectChanges();

		expect( deleteSelectedEl.nativeElement.disabled ).toBeTruthy();
	});

	it( 'should search user on keyup', () => {
		component.viewWidth = 1024;
		fixture.detectChanges();

		let filterNameEl = fixture.debugElement.query(By.css('#filter-name'));
		filterNameEl.nativeElement.value  = 'Jo';
		fixture.detectChanges();
		filterNameEl.nativeElement.dispatchEvent( new Event( 'keyup' ) );
		fixture.detectChanges();

		expect( component.search ).toHaveBeenCalled();
	});

	it( 'should delete selected users', () => {
		component.selection = [];
		component.viewWidth = 1024
		fixture.detectChanges();
		let deleteSelectedEl = fixture.debugElement.query(By.css('.delete'));
		let masterToggleEl = fixture.debugElement.query(By.css('.master-toggle'));

		click( masterToggleEl );
		fixture.detectChanges();

		expect( deleteSelectedEl.nativeElement.disabled ).toBeFalsy();

		click( deleteSelectedEl );
		fixture.detectChanges();

		expect( component.deleteSelected ).toHaveBeenCalled();
	});

	it( 'should download json file', () => {
		component.selection = [];
		component.viewWidth = 1024
		fixture.detectChanges();

		let downloadEl = fixture.debugElement.query(By.css('.download'));

		click( downloadEl );
		fixture.detectChanges();

		expect( component.download ).toHaveBeenCalled();
	});

});

// Click function helpers
export function click(el: DebugElement | HTMLElement ): void {
	if (el instanceof HTMLElement) {
		el.click();
	} else {
		el.triggerEventHandler( 'click', 0 );
	}
}




