import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "child-comp",
  template: ` <input [ngModel]="userName" (ngModelChange)="onNameChange($event)" /> `,
})
export class ChildComponent {
  @Input() userName: string = "";

  @Output() userNameChange = new EventEmitter<string>();

  onNameChange(model: string) {
    this.userNameChange.emit(model);
  }
}
