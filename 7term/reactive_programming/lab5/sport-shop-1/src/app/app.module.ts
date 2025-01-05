import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { ShopModule } from "./shop/shop.module";

@NgModule({
  imports: [BrowserModule, ShopModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
