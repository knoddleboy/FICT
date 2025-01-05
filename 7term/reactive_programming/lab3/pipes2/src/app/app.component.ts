import { Component } from "@angular/core";
import { interval, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-root",
  template: `
    <!-- Option 1: pure pipes -->
    <input [(ngModel)]="num" name="fact" />
    <div>Результат: {{ num | format }}</div>
    <br />

    <!-- Option 2: impure pipes -->
    <input #user name="user" />
    <button (click)="users.push(user.value)">Add</button>
    <p>{{ users | join }}</p>
    <br />

    <!-- Option 3: async pipe -->
    <p>Модель: {{ phone | async }}</p>
    <button (click)="showPhones()">Переглянути моделі</button>
  `,
})
export class AppComponent {
  num = 15.45;

  users = ["Tom", "Alice", "Sam", "Kate", "Bob"];

  phones = ["iPhone 7", "LG G 5", "Honor 9", "Idol S4", "Nexus 6P"];
  phone: Observable<string> | undefined;
  showPhones() {
    this.phone = interval(500).pipe(map((i: number) => this.phones[i]));
  }
}
