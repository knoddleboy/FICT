import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { DataComponent } from "./data.component";
import { DataService } from "./data.service";
import { LoggerService } from "./logger.service";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, DataComponent],
  providers: [DataService, LoggerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
