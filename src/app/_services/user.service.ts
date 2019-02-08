import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';

// const httpOptions = {
//     headers: new HttpHeaders({
//         'Authorization': 'Bearer ' + localStorage.getItem('token')
//     })
// } //doesn't nessessary, we added config into app.module

@Injectable({
    providedIn: 'root'
})

export class UserService {
    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }

    getUsers(page? , pageSize?, userParams?, likesParams?): Observable<PaginatedResult<User[]>> {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
        //we need to create instance of it because its class
        let params = new HttpParams();

        if (page != null && pageSize != null) {
           params = params.append('pageNumber', page);
           params = params.append('pageSize', pageSize);
        }
        if (userParams != null)
        {
            params = params.append('minAge', userParams.minAge);
            params = params.append('maxAge', userParams.maxAge);
            params = params.append('gender', userParams.gender);
            params = params.append('orderBy', userParams.orderBy);

        }
        if (likesParams === 'Likers') {
            params = params.append('likers', 'true');
        }
        if (likesParams === 'Likees') {
            params = params.append('likees', 'true');
        }


        return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params: params})
        .pipe(
            map(response => {
                paginatedResult.result = response.body;
                console.log(params.getAll('pageNumber'));
                console.log(params.getAll('pageSize'));

                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                }
                return paginatedResult;
            })
        );
    }

    getUser(id): Observable<User> {
        return this.http.get<User>(this.baseUrl + 'users/' + id);
    }

    updateUser(id: number, user: User) {
        return this.http.put<User>(this.baseUrl + 'users/' + id, user);
    }

    setMainPhoto(userId: number, id: number) {
        return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
    }

    deletePhoto(userId: number, id: number) {
        return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
    }


    sendLike(id: number, recipientId: number) {
        return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
    }
}
