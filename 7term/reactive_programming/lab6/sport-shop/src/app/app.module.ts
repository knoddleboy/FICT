import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { ShopModule } from "./shop/shop.module";
import { RouterModule, Routes } from "@angular/router";
import { ShopComponent } from "./shop/shop.component";
import { CartDetailComponent } from "./shop/cart-detail.component";
import { CheckoutComponent } from "./shop/checkout.component";
import { ShopFirstGuard } from "./shop-first.guard";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const routes: Routes = [
  { path: "shop", component: ShopComponent, canActivate: [ShopFirstGuard] },
  { path: "cart", component: CartDetailComponent, canActivate: [ShopFirstGuard] },
  { path: "checkout", component: CheckoutComponent, canActivate: [ShopFirstGuard] },
  {
    path: "admin",
    loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule),
  },
  { path: "**", redirectTo: "/shop" },
];

@NgModule({
  imports: [BrowserModule, ShopModule, RouterModule.forRoot(routes)],
  providers: [ShopFirstGuard, provideAnimationsAsync()],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
