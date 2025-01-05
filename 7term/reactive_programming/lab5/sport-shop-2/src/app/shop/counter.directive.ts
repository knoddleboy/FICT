import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from "@angular/core";

class CounterContext {
  constructor(public $implicit: number) {}
}

@Directive({
  selector: "[counter]",
})
export class CounterDirective implements OnChanges {
  @Input() counter = 0;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private template: TemplateRef<CounterContext>
  ) {}

  ngOnChanges() {
    this.viewContainerRef.clear();
    for (let i = 0; i < this.counter; i++) {
      this.viewContainerRef.createEmbeddedView(this.template, new CounterContext(i + 1));
    }
  }
}
