import {
  AfterViewInit,
  Component,
  DoCheck,
  IterableDiffer,
  IterableDiffers,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "../model/product.model";
import { ProductRepository } from "../model/product.repository";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  templateUrl: "./product-table.component.html",
})
export class ProductTableComponent implements DoCheck, AfterViewInit {
  displayedColumns: string[] = ["id", "name", "category", "price", "buttons"];
  dataSource: MatTableDataSource<Product>;
  differ: IterableDiffer<Product>;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private repository: ProductRepository, differs: IterableDiffers) {
    this.dataSource = new MatTableDataSource(this.repository.getProducts());
    this.differ = differs.find(this.repository.getProducts()).create();
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.repository.getProducts());
    if (changes) {
      this.dataSource.data = this.repository.getProducts();
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  deleteProduct(id: number) {
    this.repository.deleteProduct(id);
  }
}
