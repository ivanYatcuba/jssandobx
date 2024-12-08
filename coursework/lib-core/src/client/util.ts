import { RpcException } from '@nestjs/microservices'
import { Observable, catchError, firstValueFrom, throwError, timeout } from 'rxjs'

export function clientCall<T>(o: Observable<T>): Promise<T> {
  return firstValueFrom(
    o.pipe(timeout(5000)).pipe(catchError((error) => throwError(() => new RpcException({ ...error.error })))),
  )
}
