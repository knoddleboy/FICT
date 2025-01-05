import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../model/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(): boolean {
    if (!this.auth.authenticated) {
      this.router.navigateByUrl("/admin/auth");
      return false;
    }
    return true;
  }
}
