import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { FormatPipe } from "./format.pipe";
import { JoinPipe } from "./join.pipe";
import { RootPipe } from "./root.pipe";

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent, FormatPipe, JoinPipe, RootPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
