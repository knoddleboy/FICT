import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <label>Enter your name:</label>
    <input [(ngModel)]="name" placeholder="Your name" />
    <h1>Welcome, {{ name }}!</h1>
  `,
})
export class AppComponent {
  name = "";
}
