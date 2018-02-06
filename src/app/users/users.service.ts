import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from './../../environments/environment';
import { User } from './user';

const URL = environment.apiUrl + 'users';

const httpOptions = {
	headers: new HttpHeaders( { 'Content-Type': 'application/json' } )
};


@Injectable()
export class UsersService {

	constructor( private http: HttpClient ) { }

	public getUsers(): Observable<User[]> {
		return this.http.get<User[]>( URL );
	}

	public deleteUser ( user: User ): Observable<any> {
		let url = `${URL}/${user.id}`;
		return this.http.delete<any>( url, httpOptions );
	}

	public deleteUserList ( users: User[] ): Observable<any> {
		return this.http.post<any>( URL, users, httpOptions );
	}

	public getUserById( id: number ): Observable<User>{
		return this.http.get<User>( `${URL}/${id}` );
	}

	public updateUser ( user: User ): Observable<any> {
		return this.http.put<any>( URL, user, httpOptions );
	}


}
