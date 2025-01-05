import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "format",
})
export class FormatPipe implements PipeTransform {
  transform(value: number): string {
    return value.toString().replace(".", ",");
  }
}
