import { NgModule } from "@angular/core";
import { ShopComponent } from "./shop.component";
import { ModelModule } from "../model/model.module";
import { CommonModule } from "@angular/common";
import { CounterDirective } from "./counter.directive";

@NgModule({
  imports: [CommonModule, ModelModule],
  declarations: [ShopComponent, CounterDirective],
  exports: [ShopComponent],
})
export class ShopModule {}
