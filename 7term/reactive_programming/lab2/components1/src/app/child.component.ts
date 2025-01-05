import { Component, Input } from "@angular/core";

@Component({
  selector: "child-comp",
  template: `
    <ng-content></ng-content>
    <h2>Hello, {{ name }}</h2>
    <p>User name: {{ userName }}</p>
    <p>User age: {{ userAge }}</p>
  `,
  styles: [
    `
      h2,
      p {
        color: red;
      }
    `,
  ],
})
export class ChildComponent {
  name = "Taras";
  @Input() userName: string = "";
  @Input() userAge: number = 0;
}
