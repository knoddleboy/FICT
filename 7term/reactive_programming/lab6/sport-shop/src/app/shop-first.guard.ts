import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { ShopComponent } from "./shop/shop.component";

@Injectable()
export class ShopFirstGuard implements CanActivate {
  private firstNavigation = true;

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (this.firstNavigation) {
      this.firstNavigation = false;

      if (route.component !== ShopComponent) {
        this.router.navigateByUrl("/");
        return false;
      }
    }

    return true;
  }
}
