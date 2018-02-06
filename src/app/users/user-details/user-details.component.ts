import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../../dialog/dialog.component';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-user-details',
	templateUrl: './user-details.component.html',
	styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

	@ViewChild( 'userForm' ) userForm;

	model: User = null;
	viewLoaded: boolean = false;
	isSaving: boolean = false;
	message: any = null;

	constructor( private usersService : UsersService,
				 private route: ActivatedRoute,
				 private router: Router,
				 private modalService: NgbModal ) { }

	ngOnInit() {
		this.route.params.subscribe( ( params: Params ) => {
			let id = params['id'];
			this.getUser( id );
		});
	}

	canDeactivate(): Observable<boolean> | Promise<boolean> |  boolean {

		if ( this.userForm.submitted || this.userForm.pristine ){
			return true;
		} else {
			const modalRef = this.modalService.open( DialogComponent )
			modalRef.componentInstance.title = 'Are you sure you want to leave?';
			modalRef.componentInstance.message = 'You made changes to this user. If you leave, your changes will be lost.';
			modalRef.componentInstance.confirm = 'Leave';

			return modalRef.result.then( ( result ) => {
				return result == 'confirm' ? true : false;
			}, ( reason )  => {
				return reason == 'confirm' ? true : false;
			});
		}

	}

	getUser( id: number ) {
		this.usersService.getUserById( id ).subscribe(
			data => {
				this.model = Object.assign( {}, data );
				this.viewLoaded = true;
			},
			error => {
				console.error( error );
				this.message = <any> {
					type: 'danger',
					message: error
				}
				this.viewLoaded = true;
			}
		);
	}

	save ( valid: boolean ) {
		if ( !valid ) {
			return;
		}
		this.isSaving = true;
		this.usersService.updateUser( this.model ).subscribe(
			result => {
				this.isSaving = false;
				this.router.navigate( ['/users'] );
			},
			error => {
				this.isSaving = false;
				this.message = <any> {
					type: 'danger',
					message: error
				}
				console.error( error );
			}
		);
	}
}
