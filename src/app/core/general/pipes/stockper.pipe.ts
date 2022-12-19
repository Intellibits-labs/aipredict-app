import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockper',
})
export class StockperPipe implements PipeTransform {
  transform(value: any): any {
    console.log(value);
    let flag = false;
    if (value.includes('-')) {
      flag = true;
    } else {
      flag = false;
    }
    return flag;
  }
}
