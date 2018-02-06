import { Component, OnInit, AfterViewInit, ElementRef, HostListener, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from './user';
import { UsersService } from './users.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../dialog/dialog.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {

	loaded: any[] = [];
	users: User[] = [];
	selection: Array<User> = [];
	fileDownloadHref: SafeUrl = null;

	filterNameChanged: Subject<string> = new Subject<string>();

	viewWidth;

	constructor( private usersService: UsersService,
				 private router: Router,
				 private route: ActivatedRoute,
				 private modalService: NgbModal,
				 private sanitizer: DomSanitizer,
				 private elementRef: ElementRef ) {
					this.viewWidth = ( window.innerWidth );
				}

	ngOnInit() {
		this.listUsers();
	}

	ngAfterViewInit() {
		// Filter users based on search by term
		this.filterNameChanged
			.debounceTime(300) // wait 300ms after the last event before emitting last event
			.distinctUntilChanged() // only emit if value is different from previous value
			.subscribe( filterName => {
				if ( filterName == null || filterName == '' ){
					// Using a preloaded list in order to save calls to the api
					this.users = Object.assign( [], this.loaded );
				} else {
					//TO DO: Replace using backend method
					this.users = this.loaded.filter(v => v.fullName.toLowerCase().indexOf(filterName.trim().toLowerCase()) > -1).slice(0);
				}

			});
	}

	//Listens resizing of the window to updatelayout
	@HostListener( 'window:resize', ['$event'] )

	onResize( event ) {
		this.viewWidth = event.target.innerWidth;
	}

	// List all users
	listUsers() {
		this.usersService.getUsers().subscribe(
			data => {
				this.users = Object.assign( [], data );;
				this.loaded = Object.assign( [], data );
				// TO DO: remove once sql based backend is done
				this.loaded.forEach ( user => {
					user.fullName = `${user.firstName} ${user.lastName}`;
				})
			},
			error => {
				console.error( error );
			}
		);
	}

	// Fired on search keyup. Add entered text to waitlist
	search ( text: string ) {
		this.filterNameChanged.next( text );
	}

	// Shows clicked user in a new view
	showUser( user: User ) {
		this.router.navigate( ['users','user-details', user.id ] );
	}

	// Select users in table
	selectUser( user: User ) {
		if ( this.selection.includes( user ) ){
			let index = this.selection.indexOf( user );
			this.selection.splice( index, 1 );
		} else {
			this.selection.push( user );
		}
	}

	// Delete all selected users from table - confirm modal
	deleteSelected() {
		( this.selection && this.selection.length > 0 ) ? this.deleteUserConfirm( this.selection ) : [] ;
	}

	// Delete single user - confirm modal
	deleteUserConfirm( user: User | Array<User> ) {
		const modalRef = this.modalService.open( DialogComponent )
		modalRef.componentInstance.title =  'User Delete Confirm';

		if ( user instanceof Array ) {
			modalRef.componentInstance.message =  'Are you sure you want to delete the selected users?';
		} else {
			modalRef.componentInstance.message =  `Are you sure you want to delete this user - ${user.firstName} ${user.lastName}`;
		}

		return modalRef.result.then( ( result ) => {
			this.deleteUser( result, user );
		}, ( reason )  => {
			this.deleteUser( reason, user );
		});
	}

	// Delete user
	deleteUser( modalResponse: string, user: User | Array<User> ) {
		if ( modalResponse && modalResponse == 'confirm' ) {

			if ( user instanceof Array ) {
				this.refreshList( user );
				// Delete user list
				// Method below is comments, since we don't have a back end and
				// we're using angular in-memory data service.
				/*this.usersService.deleteUserList( user ).subscribe(
					result => {
						// Remove user from users array.
						// TO DO: Remove this method when backend is done


						// TO DO: reload users from API when list users endpoint is done.
						//this.listUsers();
					},
					error => {
						console.error( error );
					}
				);*/
			} else {
				// Delete single user
				this.usersService.deleteUser( user ).subscribe(
					result => {
						// Remove user from users array.
						this.loaded = this.loaded.filter( u => u !== user );
						this.users = Object.assign( [], this.loaded );

						// TO DO: reload users from API when list users endpoint is done.
						this.listUsers();
					},
					error => {
						console.error( error );
					}
				);
			}
		} else {
			return;
		}
	}

	// Refresh user list
	// TO DO: Remove method once backend is done. This is just to handle in memory data.
	refreshList( users: Array<User> ) {
		// TO DO: This methos will be removed once api backend is done.
		for ( var user in users ) {
			this.usersService.deleteUser( users[user] ).subscribe(
				result => {
					// Remove user from users array.
					this.loaded = this.loaded.filter( u => u !== users[user] );
					this.users = Object.assign( [], this.loaded );
				},
				error => {
					console.error( error );
				}
			);
		}
		this.selection = [];
		this.listUsers();
	}

	selectionJson(){
		return JSON.stringify( this.selection );
	}

	isAllSelected() {
		const numSelected = this.selection.length;
		const numRows = this.users.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ?
		this.selection = [] :
		this.users.forEach( row => {
			if ( ! this.selection.includes ( row ) ) {
				this.selectUser( row );
			}
		});
	}

	download() {
		// Check if any users were select. If so, downloads only the selected users. Otherwise, download all users.
		let data = ( this.selection && this.selection.length > 0 ) ? JSON.stringify( this.selection ) : JSON.stringify( this.users );
		// Sanitize
		let uri = this.sanitizer.bypassSecurityTrustUrl( 'data:text/json;charset=UTF-8,' + encodeURIComponent( data ) );
		this.fileDownloadHref = uri;
	}
}
