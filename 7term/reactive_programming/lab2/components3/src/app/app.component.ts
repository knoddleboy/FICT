import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <child-comp [(userName)]="name"></child-comp>
    <div>Chosen name: {{ name }}</div>
  `,
})
export class AppComponent {
  name: string = "Tom";
}
