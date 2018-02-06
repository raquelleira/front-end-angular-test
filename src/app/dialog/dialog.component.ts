import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

	@Input() title = null;
	@Input() message = null;

	@Input() cancel = 'Cancel';
	@Input() confirm = 'Confirm';

	constructor( public activeModal: NgbActiveModal ) {}

}
