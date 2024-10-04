import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <!-- Option 1: text interpolation -->
    <p>Name: {{ name }}</p>
    <p>Age: {{ age }}</p>
    <br />

    <!-- Option 2: property bindings -->
    <input type="text" [value]="name" />
    <input type="text" [value]="age" />
    <p [textContent]="name"></p>
    <br />

    <!-- Option 3: attribute bindings -->
    <table border="1">
      <tr>
        <td [attr.colspan]="colspan">One-Two</td>
      </tr>
      <tr>
        <td>Three</td>
        <td>Four</td>
      </tr>
      <tr>
        <td>Five</td>
        <td>Six</td>
      </tr>
    </table>
    <br />

    <!-- Option 4: event bindings -->
    <p>Clicks: {{ count }}</p>
    <button (click)="increase()">Click</button>

    <p>Clicks(2): {{ count2 }}</p>
    <button (click)="increase2($event)">Click</button>
    <br /><br />

    <!-- Option 5: two-way bindings -->
    <!-- <p>Hello, {{ name }}</p>
    <input type="text" [(ngModel)]="name" /><br /><br />
    <input type="text" [(ngModel)]="name" /> -->

    <!-- Input
      - do not change the 'name' variable or introduce new variables
      - first input updates all elements with {{name}}
      - last input updates only the last paragraph with {{name}}
    -->

    <p>First, {{ name }}</p>
    <p>Second, {{ secondName }}</p>
    <input type="text" [ngModel]="name" (ngModelChange)="updateSecondName($event)" /><br /><br />
    <input type="text" [(ngModel)]="secondName" />
  `,
})
export class AppComponent {
  name = "Tom";
  age = 25;
  colspan = 2;

  count = 0;
  increase() {
    this.count++;
  }

  count2 = 0;
  increase2($event: any) {
    this.count++;
    this.count2++;
    console.log($event);
  }

  // Input problem

  private _secondName = "Tom";

  get secondName() {
    return this._secondName;
  }

  set secondName(value: string) {
    this._secondName = value;
  }

  updateSecondName(value: string) {
    this.name = value;
    this.secondName = value;
  }
}
