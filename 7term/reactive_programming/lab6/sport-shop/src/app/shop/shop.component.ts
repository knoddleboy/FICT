import { Component } from "@angular/core";
import { ProductRepository } from "../model/product.repository";
import { Product } from "../model/product.model";
import { Cart } from "../model/cart.model";

@Component({
  selector: "shop",
  templateUrl: "./shop.component.html",
})
export class ShopComponent {
  selectedCategory?: string;

  productsPerPage = 4;
  selectedPage = 1;

  constructor(private repository: ProductRepository, private cart: Cart) {}

  get products(): Product[] {
    const pageIndex = (this.selectedPage - 1) * this.productsPerPage;
    const filteredProducts = this.repository.getProducts(this.selectedCategory);
    return filteredProducts.slice(pageIndex, pageIndex + this.productsPerPage);
  }

  get categories(): string[] {
    return this.repository.getCategories();
  }

  changeCategory(category?: string) {
    this.selectedCategory = category;
    this.changePage(1);
  }

  changePage(page: number) {
    this.selectedPage = page;
  }

  changePageSize(size: number) {
    this.productsPerPage = +size;
    this.changePage(1);
  }

  get pageCount(): number {
    const numberOfProductsInCategory = this.repository.getProducts(this.selectedCategory).length;
    const productsInCategoryPerPage = Math.ceil(numberOfProductsInCategory / this.productsPerPage);
    return productsInCategoryPerPage;
  }

  addProductToCart(product: Product) {
    this.cart.addLine(product);
  }
}
