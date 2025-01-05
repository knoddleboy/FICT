import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { CheckoutComponent } from "./shop/checkout.component";

@Injectable({
  providedIn: "root",
})
export class CheckoutGuard implements CanDeactivate<CheckoutComponent> {
  canDeactivate(component: CheckoutComponent): boolean {
    const { name, address, city, state, zip, country } = component.order;
    const isFormIncomplete = !(name && address && city && state && zip && country);

    if (isFormIncomplete) {
      return confirm("Some fields are not filled. Are you sure you want to proceed?");
    }

    return true;
  }
}
