import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

@Component({
  selector: "app-root",
  template: `
    <ul>
      <li *ngFor="let user of users$ | async">{{ user.name }} - {{ user.email }}</li>
    </ul>
  `,
  providers: [UserService],
})
export class AppComponent implements OnInit {
  users$: Observable<any> | undefined;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users$ = this.userService.getUsers();
  }
}
