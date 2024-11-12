import { of, interval, pipe } from 'rxjs'

import { mergeMap, take } from 'rxjs/operators';

const firstObservable = of(5);

const secondObservable = (data1) => interval(1000).pipe(take(data1));

firstObservable.subscribe(data1 => {
  secondObservable(data1).subscribe(data2 => {
    console.log('Вкладений subscribe:', data2);
  });
});

firstObservable.pipe(
  mergeMap((data1) => secondObservable(data1))
).subscribe(data2 => {
  console.log('merge map:', data2);
})
