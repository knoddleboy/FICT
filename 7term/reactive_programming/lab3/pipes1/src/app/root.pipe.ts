import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "root",
})
export class RootPipe implements PipeTransform {
  transform(value: number): number {
    if (value < 0) {
      return NaN;
    }

    return Math.sqrt(value);
  }
}
