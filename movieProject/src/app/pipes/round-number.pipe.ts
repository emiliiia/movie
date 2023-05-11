import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundNumber'
})
export class RoundNumberPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'В';
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'М';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'К';
    } else {
      return value.toString();
    }
  }
}
