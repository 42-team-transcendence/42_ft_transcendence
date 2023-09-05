import { PipeTransform, Injectable } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizePipe implements PipeTransform<any, any> {
  transform(value: any): any {
    if (typeof value === 'string') {// If the value is a string, sanitize it
      const sanitizedValue = sanitizeHtml(value);
      return sanitizedValue;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // If the value is an object (but not an array), recursively sanitize its properties
      const sanitizedObject: any = {};
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          sanitizedObject[key] = this.transform(value[key]);
        }
      }
      return sanitizedObject;
    } else if (Array.isArray(value)) {// If the value is an array, recursively sanitize its elements
      const sanitizedArray = value.map((element) => this.transform(element));
      return sanitizedArray;
    } else {// For other types, return the value as is
      return value;
    }
  }
}
