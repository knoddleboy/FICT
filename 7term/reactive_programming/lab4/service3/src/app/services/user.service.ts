import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../shared/types/user.type";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private usersApiUrl = "https://jsonplaceholder.typicode.com/users";

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(this.usersApiUrl);
  }
}
