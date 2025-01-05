import { NgModule } from "@angular/core";
import { ShopComponent } from "./shop.component";
import { ModelModule } from "../model/model.module";
import { CommonModule } from "@angular/common";
import { CounterDirective } from "./counter.directive";
import { CartSummaryComponent } from "./cart-summary.component";
import { CartDetailComponent } from "./cart-detail.component";
import { CheckoutComponent } from "./checkout.component";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CheckoutCompleteComponent } from "./checkout-complete.component";

@NgModule({
  imports: [CommonModule, FormsModule, ModelModule, RouterLink],
  declarations: [
    ShopComponent,
    CartSummaryComponent,
    CounterDirective,
    CartDetailComponent,
    CheckoutComponent,
    CheckoutCompleteComponent,
  ],
  exports: [ShopComponent, CartDetailComponent, CheckoutComponent, CheckoutCompleteComponent],
})
export class ShopModule {}
