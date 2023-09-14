
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ServerResponse } from 'http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const isObject = (data: any) => {
  return (typeof data === 'object' &&
    !Array.isArray(data) &&
    data !== null
  )
}

const isArray = (data: any) => {
  return (Array.isArray(data) && data !== null)
}

// Exclude "hash" property recursively
const excludeHash = (data: any) => {
  if (isObject(data)) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = excludeHash(data[key]); // Recursively traverse the object
      }
    }
    delete data.hash;
    delete data.hashedRt;
    delete data.secret;
  } else if (isArray(data)) {
    data = data.map((item) => excludeHash(item)); // Recursively traverse the array
  }
  return data;
};

//Exclude hashes from returns to client
@Injectable()
export class ExcludeSensitiveData implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof ServerResponse) {
          return data;
        } else {
          return excludeHash(data);
        }
      })
    );
  }
}
