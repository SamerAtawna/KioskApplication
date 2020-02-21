import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "newLine"
})
export class NewLinePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value.replace(/nl/g, '<br>');
  }
}
