
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
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
      if (data.hasOwnProperty(key)) {
        data[key] = excludeHash(data[key]); // Recursively traverse the object
      }
    }
    delete data.hash;
    delete data.hashedRt;
  } else if (isArray(data)) {
    data = data.map((item) => excludeHash(item)); // Recursively traverse the array
  }
  return data;
};

//Exclude hashes from returns to client
@Injectable()
export class ExcludeSensitiveDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return excludeHash(data);
      })
    );
  }
}

// @Injectable()
// export class ExcludeSensitiveDataInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next
//         .handle()
//         .pipe(map(data => {
//           if (isObject(data)) {
//             Object.keys(data).forEach((key) => {
//               if (isArray(data[key])) {
//                 data[key].map(e => {
//                   if (isObject(e))
//                     delete e.hash;
//                 })
//               }
//             });
//             delete data.hash;
//             return data
//           }
//         }));
//   }
// }
