import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthComponent } from "./auth.component";
import { AdminComponent } from "./admin.component";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth.guard";
import { MaterialFeatures } from "./material.module";
import { ProductEditorComponent } from "./product-editor.component";
import { ProductTableComponent } from "./product-table.component";
import { OrderTableComponent } from "./order-table.component";

const routes: Routes = [
  { path: "auth", component: AuthComponent },
  {
    path: "main",
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "products/:mode/:id", component: ProductEditorComponent },
      { path: "products/:mode", component: ProductEditorComponent },
      { path: "products", component: ProductTableComponent },
      { path: "orders", component: OrderTableComponent },
      { path: "**", redirectTo: "products" },
    ],
  },
  { path: "**", redirectTo: "auth" },
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), MaterialFeatures],
  declarations: [
    AuthComponent,
    AdminComponent,
    ProductTableComponent,
    ProductEditorComponent,
    OrderTableComponent,
  ],
  providers: [AuthGuard],
})
export class AdminModule {}
