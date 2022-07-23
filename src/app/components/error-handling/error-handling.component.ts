import { Component, OnInit } from '@angular/core';
import { map, tap, retry, take, timeout, Observable, Observer, catchError, throwError, retryWhen, timer, delay, delayWhen } from 'rxjs';

@Component({
  selector: 'app-error-handling',
  templateUrl: './error-handling.component.html',
  styleUrls: ['./error-handling.component.scss']
})
export class ErrorHandlingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  startTest(){
    let obj: Observable<any> = new Observable<any>(
      (observer: Observer<any>)=>{
        for(let i=0; i<10; i++){
          if(i ==7) observer.error(`Error i = ${i}`)
          observer.next(i)
        }
      }
    )
    obj
    .pipe(
      map(i => i*10),
      tap(i => `Before error handling: ${i}`),
      catchError(error => {
        console.error(`Inside catch error: ${error}`)
        return throwError(() => new Error('throwError: Error'))
      }),
      //retry(2)
      retry({
        count: 2,
        delay: () => timer(4000)
      })
    )
    // .subscribe({
    //   next: i => console.log(`Normal output: ${i}`),
    //   error: error => console.log(error),
    //   complete: () => console.log('Completed!')
    // })

    let obj2: Observable<any> = new Observable(
      (observer) => {
        timer(2000).subscribe((n) => observer.next(n))
        timer(4000).subscribe(() => observer.complete())
      }
    )
    obj2.pipe(
      timeout(2000)
    )
    .subscribe({
      next: i => console.log(`N: ${i}`),
      error: error => console.log(error),
      complete: () => console.log('Completed!')
    })
  }
}
