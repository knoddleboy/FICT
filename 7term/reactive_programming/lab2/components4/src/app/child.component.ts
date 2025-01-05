import { Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";

@Component({
  selector: "child-comp",
  template: `<p>Hello, {{ name }}</p>`,
})
export class ChildComponent implements OnInit, OnChanges {
  @Input() name: string = "";

  constructor() {
    console.log("Child Component: constructor");
  }

  ngOnInit() {
    console.log("Child Component: onInit");
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const inputName in changes) {
      const inputValues = changes[inputName];
      const curr = inputValues.currentValue;
      const prev = inputValues.previousValue;
      console.log(`Child Component: ngOnChanges[${inputName}]: curr == ${curr} prev == ${prev}`);
    }
  }
}
