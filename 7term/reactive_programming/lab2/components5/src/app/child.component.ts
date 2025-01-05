import {
  Component,
  Input,
  OnInit,
  DoCheck,
  OnChanges,
  AfterContentInit,
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "child-comp",
  template: `<p>Hello, {{ name }}</p>`,
})
export class ChildComponent
  implements
    OnInit,
    DoCheck,
    OnChanges,
    AfterContentInit,
    AfterContentChecked,
    AfterViewChecked,
    AfterViewInit
{
  @Input() name: string = "";

  ngOnInit() {
    this.log("ngOnInit");
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const inputName in changes) {
      const inputValues = changes[inputName];
      const curr = inputValues.currentValue;
      const prev = inputValues.previousValue;
      this.log(`OnChanges[${inputName}]: ${prev} -> ${curr}`);
    }
  }

  ngDoCheck() {
    this.log("ngDoCheck");
  }

  ngAfterViewInit() {
    this.log("ngAfterViewInit");
  }

  ngAfterViewChecked() {
    this.log("ngAfterViewChecked");
  }

  ngAfterContentInit() {
    this.log("ngAfterContentInit");
  }

  ngAfterContentChecked() {
    this.log("ngAfterContentChecked");
  }

  count = 1;
  private log(msg: string) {
    console.log(this.count + ". " + msg);
    this.count++;
  }
}
