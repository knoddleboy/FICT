import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "join",
  pure: false,
})
export class JoinPipe implements PipeTransform {
  transform(array: any[]): string {
    return array.join(", ");
  }
}
