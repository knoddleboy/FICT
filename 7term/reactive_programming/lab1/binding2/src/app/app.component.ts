import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <!-- Option 6: class bindings -->
    <div [class.isredbox]="isRed"></div>
    <div [class.isredbox]="!isRed"></div>
    <input type="checkbox" [(ngModel)]="isRed" />
    <div [class]="blueClass"></div>
    <br /><br />

    <!-- Option 7: CSS styles bindings -->
    <div [style.backgroundColor]="isYellow ? 'yellow' : 'blue'"></div>
    <div [style.background-color]="!isYellow ? 'yellow' : 'blue'"></div>
    <input type="checkbox" [(ngModel)]="isYellow" />
  `,
  styles: [
    `
      div {
        width: 50px;
        height: 50px;
        border: 1px solid #ccc;
      }
      .isredbox {
        background-color: red;
      }
      .isbluebox {
        background-color: blue;
      }
    `,
  ],
})
export class AppComponent {
  isRed = false;
  isYellow = false;
  blueClass = "isbluebox";
}
