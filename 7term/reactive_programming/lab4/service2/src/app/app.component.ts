import { Component } from "@angular/core";
import { AppCounterService } from "./services/app-counter.service";
import { LocalCounterService } from "./services/local-counter.service";

@Component({
  selector: "app-root",
  template: `
    <h1>Компонент app.component.ts</h1>

    <h2>Сервіс глобального рівня App Counter {{ appCounterService.counter }}</h2>

    <button (click)="appCounterService.increase()">+</button>
    <button (click)="appCounterService.decrease()">-</button>

    <h2>Сервіс рівня компоненту Local Counter {{ localCounterService.counter }}</h2>

    <button (click)="localCounterService.increase()">+</button>
    <button (click)="localCounterService.decrease()">-</button>

    <hr />

    <counter-comp></counter-comp>
  `,
  providers: [LocalCounterService],
})
export class AppComponent {
  constructor(
    protected appCounterService: AppCounterService,
    protected localCounterService: LocalCounterService
  ) {}
}
