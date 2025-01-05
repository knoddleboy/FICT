import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "child-comp",
  template: `
    <!-- Option 7: setter binding -->
    <p>User name: {{ userName }}</p>
    <p>User age: {{ userAge }}</p>
    <br />

    <!-- Option 8:  -->
    <!-- <button (click)="change(true)">+</button>
    <button (click)="change(false)">-</button> -->
  `,
})
export class ChildComponent {
  @Input() userName: string = "";

  // Option 7
  private _userAge: number = 0;

  @Input()
  set userAge(age: number) {
    if (age < 0) this._userAge = 0;
    else if (age > 100) this._userAge = 100;
    else this._userAge = age;
  }

  get userAge() {
    return this._userAge;
  }

  // Option 8
  @Output() onChanged = new EventEmitter<boolean>();
  change(increased: any) {
    this.onChanged.emit(increased);
  }
}
