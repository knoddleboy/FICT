import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <!-- Option 7 -->
    <child-comp [userName]="name" [userAge]="age"></child-comp>
    <input type="number" [(ngModel)]="age" />
    <br /><br />

    <!-- Option 8 -->
    <!-- <h2>Clicks: {{ clicks }}</h2>
    <child-comp (onChanged)="onChanged($event)"></child-comp> -->
  `,
})
export class AppComponent {
  // Option 7
  name: string = "Tom";
  age: number = 24;

  // Option 8
  clicks: number = 0;
  onChanged(increased: any) {
    increased == true ? this.clicks++ : this.clicks--;
  }
}
