import { Pipe, PipeTransform } from "@angular/core";
import { Post } from "./app.component";

@Pipe({
  name: "search",
  pure: false,
})
export class SearchPipe implements PipeTransform {
  transform(posts: Post[], searchString: string): Post[] {
    if (!searchString.trim()) {
      return posts;
    }

    searchString = searchString.toLowerCase();

    return posts.filter((post) => post.title.toLowerCase().includes(searchString));
  }
}
