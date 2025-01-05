import { Component, OnInit } from "@angular/core";
import { UserService } from "./services/user.service";
import { Observable } from "rxjs";
import { User } from "./shared/types/user.type";

@Component({
  selector: "app-root",
  template: `
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead class="text-left">
          <tr>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Id</th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Username</th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Phone</th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Website</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr *ngFor="let user of users$ | async">
            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{{ user.id }}</td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ user.name }}</td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ user.username }}</td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ user.email }}</td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ user.phone }}</td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ user.website }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class AppComponent implements OnInit {
  users$: Observable<User[]> | undefined;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users$ = this.userService.getUsers();
  }
}

// -
// <tbody class="divide-y divide-gray-200">
//   <tr *ngFor="let user of users">
//     <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{{ user.id }}</td>
//     <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ user.name }}</td>
//     <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ user.username }}</td>
//     <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ user.email }}</td>
//     <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ user.phone }}</td>
//     <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ user.website }}</td>
//   </tr>
// </tbody>

// users: User[] = [];

// this.userService.getUsers().subscribe((data) => {
//   this.users = data;
// });
