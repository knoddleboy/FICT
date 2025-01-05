import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "join",
})
export class JoinPipe implements PipeTransform {
  transform(array: any[], start?: number, end?: number): string {
    let result = array;

    start = start ?? 0;
    end = end ?? array.length;

    result = array.slice(start, end);
    return result.join(", ");
  }
}
