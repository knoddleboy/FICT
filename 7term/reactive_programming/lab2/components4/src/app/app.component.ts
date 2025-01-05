import { Component, OnInit, OnChanges, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <child-comp [name]="name"></child-comp>
    <input type="text" [(ngModel)]="name" />
    <input type="number" [(ngModel)]="age" />
  `,
})
export class AppComponent implements OnInit, OnChanges {
  name: string = "Tom";
  age: number = 25;

  constructor() {
    console.log("Parent Component: constructor");
  }

  ngOnInit() {
    console.log("Parent Component: ngOnInit");
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const inputName in changes) {
      const inputValues = changes[inputName];
      const curr = inputValues.currentValue;
      const prev = inputValues.previousValue;
      console.log(`Parent Component: ngOnChanges[${inputName}]: curr == ${curr} prev == ${prev}`);
    }
  }
}
