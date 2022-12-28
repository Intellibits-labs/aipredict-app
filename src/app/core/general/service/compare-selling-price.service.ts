import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CompareSellingPriceService {
  constructor() {}
  smallerThan(otherControlName: string) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.parent) {
        return null;
      }
      const thisValue = control.value;
      const otherValue = control?.parent?.get(otherControlName)?.value;
      if (thisValue < otherValue) {
        return null;
      }

      return {
        smallerthan: true,
      };
    };
  }
  greaterThan(otherControlName: string) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.parent) {
        return null;
      }
      const thisValue = control.value;
      const otherValue = control.parent.get(otherControlName)?.value;
      if (thisValue >= otherValue) {
        return null;
      }

      return {
        greaterthan: true,
      };
    };
  }
}
