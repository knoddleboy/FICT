import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { PostComponent } from "./post/post.component";
import { PostFormComponent } from "./post-form/post-form.component";
import { SearchPipe } from "./search.pipe";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, PostComponent, PostFormComponent, SearchPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
