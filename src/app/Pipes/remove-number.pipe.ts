import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeNumber'
})
export class RemoveNumberPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    value = value.replace(/[0-9]/g, '');
    return value;
  }

}
