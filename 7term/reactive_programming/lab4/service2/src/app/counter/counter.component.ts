import { Component } from "@angular/core";
import { AppCounterService } from "../services/app-counter.service";
import { LocalCounterService } from "../services/local-counter.service";

@Component({
  selector: "counter-comp",
  template: `
    <h1>Компонент counter.component.ts</h1>

    <h2>Сервіс глобального рівня App Counter {{ appCounterService.counter }}</h2>

    <button (click)="appCounterService.increase()">+</button>
    <button (click)="appCounterService.decrease()">-</button>

    <h2>Сервіс рівня компоненту Local Counter {{ localCounterService.counter }}</h2>

    <button (click)="localCounterService.increase()">+</button>
    <button (click)="localCounterService.decrease()">-</button>
  `,
  providers: [LocalCounterService],
})
export class CounterComponent {
  constructor(
    protected appCounterService: AppCounterService,
    protected localCounterService: LocalCounterService
  ) {}
}
