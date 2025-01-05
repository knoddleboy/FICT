import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  // Option 1: explicitly provided template
  // template: `
  //   <label>Enter your name:</label>
  //   <input [(ngModel)]="name" placeholder="Your name" />
  //   <h1>Welcome, {{ name }}!</h1>

  //   <h2>Hello Angular</h2>
  //   <p>Angular представляє модульну архітектуру додатку</p>
  // `,
  // Option 2: explicitly provided styles
  // styles: [
  //   `
  //     h2,
  //     h3 {
  //       color: navy;
  //     }
  //     p {
  //       font-size: 13px;
  //       font-family: Verdana;
  //     }
  //   `,
  // ],

  // Option 4: path to the html template
  templateUrl: "./app.component.html",
  // Option 3: path to the stylesheet files
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  name = "Peter";
  name2: string = "Tom";
  age: number = 24;
}
