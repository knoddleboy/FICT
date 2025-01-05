import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { Post } from "../app.component";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
})
export class PostComponent implements OnDestroy {
  @Input() myPost!: Post;
  @Output() onRemove = new EventEmitter<number>();

  ngOnDestroy(): void {
    console.log(`Destroy post #${this.myPost.id}`);
  }

  removePost() {
    this.onRemove.emit(this.myPost.id);
  }
}
