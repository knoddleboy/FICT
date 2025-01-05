import { Injectable } from "@angular/core";
import { RestDataSource } from "./rest.datasource";
import { Observable } from "rxjs";

@Injectable()
export class AuthService {
  constructor(private datasource: RestDataSource) {}

  authenticate(name: string, password: string): Observable<boolean> {
    return this.datasource.authenticate(name, password);
  }

  get authenticated(): boolean {
    return !!this.datasource.auth_token;
  }

  clear() {
    this.datasource.auth_token = undefined;
  }
}
