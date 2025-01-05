import { Injectable, Optional } from "@angular/core";
import { Phone } from "./phone";
import { LoggerService } from "./logger.service";

@Injectable()
export class DataService {
  private data: Phone[] = [
    { name: "Apple iPhone 7", price: 36000 },
    { name: "HP Elite x3", price: 38000 },
    { name: "Alcatel Idol S4", price: 12000 },
  ];

  constructor(@Optional() private logger: LoggerService) {}

  getData(): Phone[] {
    this.logger?.log("Get data");
    return this.data;
  }

  addData(name: string, price: number) {
    const phone = new Phone(name, price);
    this.data.push(phone);
    this.logger?.log("New phone added");
  }
}
