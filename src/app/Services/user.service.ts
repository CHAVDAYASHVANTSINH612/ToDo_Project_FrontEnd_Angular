import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, map, take, tap } from 'rxjs';
import {User} from '../models/user'
import { Tasks } from '../models/tasks';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private http : HttpClient) {}
  public getAllUserList(): Observable<User[]> {

  return  this.http.get<User[]>(environment.API_URL+"/ToDo/users")
    .pipe(
      catchError((err)=>{
        throw err;
      })
    );
   }

  public async getAllUserTasks(id:number): Promise<Observable<Tasks[]>> {
    return  this.http.get<Tasks[]>(environment.API_URL+"/ToDo/tasks/"+id)
     .pipe(
       tap(data=> {   
        console.log("tasks of user "+id+" : "+JSON.stringify(data)); 
        }),
        catchError((err)=>{
         throw err;
       })
     );
    }

  public  async getUserWithTasks(id:number): Promise<Observable<User>> {
      return  this.http.get<User>(environment.API_URL+"/ToDo/userwithtasks/"+id)
       .pipe(
         tap(data=> {   
          console.log("tasks of user "+id+" : "+JSON.stringify(data)); 
          }),
          catchError((err)=>{
           throw err;
         })
       );
  }

  public   addTask(task: any):Observable<any> {
        let response=  this.http.post( environment.API_URL+"/ToDo/task/", task);
        this.notifySubject.next();
        return response;
  }

  public addUser(user:any):Observable<any>{
      let response = this.http.post(environment.API_URL+"/ToDo/user/",user);
        this.notifySubject.next();
        return response;
  }

  public deleteTask(taskId:number):Observable<any>{
      return this.http.delete(environment.API_URL+"/ToDo/task/"+taskId);
  }

   private notifySubject = new Subject<void>();
   notify$ = this.notifySubject.asObservable();

   public deleteUser(userId:number):Observable<any>{
      let response = this.http.delete(environment.API_URL+"/ToDo/user?userId="+userId);
      this.notifySubject.next();
      return response;
   }

   updateTaskStatus(taskId:number,updatedTaskStatus:number){
    let response= this.http.put(environment.API_URL+"/ToDo/task/"+taskId+"?updatedStatus="+updatedTaskStatus,null);
    return response;           
   }
}
