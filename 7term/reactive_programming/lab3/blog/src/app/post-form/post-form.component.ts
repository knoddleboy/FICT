import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Post } from "../app.component";
import { Observable } from "rxjs";

@Component({
  selector: "app-post-form",
  templateUrl: "./post-form.component.html",
})
export class PostFormComponent implements OnInit {
  @Output() onAdd: EventEmitter<Post> = new EventEmitter<Post>();

  title = "";
  text = "";

  myDate$: Observable<Date> = new Observable((obs) => {
    setInterval(() => {
      obs.next(new Date());
    }, 1000);
  });

  postDate!: Date;
  ngOnInit() {
    this.myDate$.subscribe((date) => {
      this.postDate = date;
    });
  }

  addPost() {
    if (this.title.trim() && this.text.trim()) {
      const post: Post = {
        title: this.title,
        text: this.text,
        date: this.postDate,
      };

      this.onAdd.emit(post);

      this.title = this.text = "";
    }
  }
}
