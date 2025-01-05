import { Component } from "@angular/core";

export interface Post {
  id?: number;
  title: string;
  text: string;
  date?: Date;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  posts: Post[] = [
    {
      title: "Вивчаю компоненти",
      text: 'Створюю проект "Блог"',
      id: 1,
      date: new Date("2024-10-22T23:27:18"),
    },
    {
      title: "Вивчаю директиви",
      text: 'Все ще створюю "Блог"',
      id: 2,
      date: new Date("2024-10-22T23:24:23"),
    },
  ];

  nextId = 3;
  updatePosts(post: Post) {
    post.id = this.nextId++;
    this.posts.unshift(post);
    console.log("Created post:", post);
  }

  deletePost(id: number) {
    this.posts = this.posts.filter((post) => post.id !== id);
  }

  search = "";
}
