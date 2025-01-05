import {
  AfterViewInit,
  Component,
  DoCheck,
  IterableDiffer,
  IterableDiffers,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Order } from "../model/order.model";
import { OrderRepository } from "../model/order.repository";
import { MatSort } from "@angular/material/sort";

@Component({
  templateUrl: "./order-table.component.html",
})
export class OrderTableComponent implements AfterViewInit, DoCheck {
  displayedColumns: string[] = ["name", "zip", "cartProduct", "cartQuantity", "buttons"];
  dataSource: MatTableDataSource<Order>;
  differ: IterableDiffer<Order>;

  selectedLetter: string = "";
  alphabet: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private repository: OrderRepository, differs: IterableDiffers) {
    this.dataSource = new MatTableDataSource<Order>(this.repository.getOrders());
    this.differ = differs.find(this.repository.getOrders()).create();

    // this.dataSource.filter = "true";
    // this.dataSource.filterPredicate = (order, includeShipped) => {
    //   return !order.shipped || includeShipped === "true";
    // };

    this.dataSource.filter = "true,";
    this.dataSource.filterPredicate = (order, filter) => {
      const [includeShipped, selectedLetter] = filter.split(",");
      const matchesShipped = !order.shipped || includeShipped === "true";
      const matchesFirstLetter = selectedLetter === "" || order.name?.startsWith(selectedLetter);
      return matchesShipped && !!matchesFirstLetter;
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.repository.getOrders());
    if (changes) {
      this.dataSource.data = this.repository.getOrders();
    }
  }

  selectLetter(letter: string) {
    this.selectedLetter = letter;
    this.dataSource.filter = `${this.includeShipped},${letter}`;
  }

  get includeShipped() {
    const [_includeShipped] = this.dataSource.filter.split(",");
    return _includeShipped === "true";
  }

  set includeShipped(include: boolean) {
    this.dataSource.filter = `${include},${this.selectedLetter}`;
  }

  toggleShipped(order: Order) {
    order.shipped = !order.shipped;
    this.repository.updateOrder(order);
  }

  delete(id: number) {
    this.repository.deleteOrder(id);
  }
}
