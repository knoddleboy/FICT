import { Component } from "@angular/core";
import { Product } from "../model/product.model";
import { ProductRepository } from "../model/product.repository";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  templateUrl: "./product-editor.component.html",
})
export class ProductEditorComponent {
  editing = false;
  product = new Product();

  constructor(
    private repository: ProductRepository,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editing = route.snapshot.params["mode"] === "edit";
    if (this.editing) {
      const productId = +route.snapshot.params["id"];
      Object.assign(this.product, repository.getProduct(productId));
    }
  }

  save() {
    this.repository.saveProduct(this.product);
    this.router.navigateByUrl("/admin/main/products");
  }
}
