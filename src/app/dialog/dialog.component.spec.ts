import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DialogComponent } from './dialog.component';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('DialogComponent', () => {
	let component: DialogComponent;
	let fixture: ComponentFixture<DialogComponent>;

	beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ DialogComponent ],
		providers: [ NgbModal, NgbActiveModal ]
	})
	.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent( DialogComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	});

	it( 'should display input title', () => {
		component.title = 'Modal Title Test'
		fixture.detectChanges();

		let modalTitleEl = fixture.debugElement.query(By.css('.modal-title'));
		expect( modalTitleEl.nativeElement.textContent ).toContain(component.title);
	});

	it( 'should display input message', () => {
		component.message = 'This is the modal message'
		fixture.detectChanges();

		let modalMessageEl = fixture.debugElement.query(By.css('.modal-body p'));
		expect( modalMessageEl.nativeElement.textContent ).toContain(component.message);
	});

	it( 'should display cancel button text', () => {
		component.cancel = 'Leave'
		fixture.detectChanges();

		let modalCancelButtonEl = fixture.debugElement.query(By.css('.cancel-button'));
		expect( modalCancelButtonEl.nativeElement.textContent ).toContain(component.cancel);
	});

	it( 'should display confirm button text', () => {
		component.confirm = 'Save'
		fixture.detectChanges();

		let modalConfirmButtonEl = fixture.debugElement.query(By.css('.confirm-button'));
		expect( modalConfirmButtonEl.nativeElement.textContent ).toContain(component.confirm);
	});

});
