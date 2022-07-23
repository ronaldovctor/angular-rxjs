import { Component, OnInit, ViewChild } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { from, map, take, delay, fromEvent, filter, interval, tap, Observable, Observer, Subscription, first, last, debounceTime, Subject, concatMapTo, takeWhile, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss']
})
export class OperatorsComponent implements OnInit {
  @ViewChild(MatRipple) ripple?: MatRipple

  centered: boolean = false
  radius: number = 40
  searchInput?: string
  searchEntry$: Subject<string> = new Subject<string>()

  constructor() { }

  ngOnInit(): void {
  }

  mapClick() {
    from([1,2,3,4,5,6,7])
    .pipe(
      map(i => i*2),
      map(i => i*10),
      delay(2000)
    )
    .subscribe(x => console.log(x))

    fromEvent<MouseEvent>(document, 'click')
    .pipe(
      map((e: MouseEvent) => ({x: e.screenX, y: e.screenY}))
    )
    .subscribe(pos => console.log(pos))
  }

  filterClick(){
    from([1,2,3,4,5,6,7])
    .pipe(
      filter(i => i%2 == 1),
      map(i => i*10)
    )
    .subscribe(x => console.log(x))

    interval(1000)
    .pipe(
      filter(i => i%2 == 0),
      map(i => `Value: ${i}`),
      delay(1000)
    )
    .subscribe(x => console.log(x))
  }

  tapClick(){
    const observable = new Observable(
      (observer: Observer<any>) => {
        let i: number
        for(i = 0; i < 20; i++)
          setTimeout(() => observer.next(Math.floor(Math.random()*100)), i*100)
        setTimeout(() => observer.complete(), (i*100))
      }
    )
    const s: Subscription = observable
    .pipe(
      tap(i => console.log(i)),
      //take(10)
      //first()
      last()
    )
    .subscribe({
      next:(v) => console.log(`Output: ${v}`),
      complete: () => console.log('Completed...')
    })

    const interval = setInterval(() => {
      console.log('Checking...')
      if(s.closed){
        console.warn('Subscription CLOSED!')
        clearInterval(interval)
      }
    }, 200)
  }

  launchRipple(){
    const rippleRef = this.ripple?.launch({
      persistent:false,
      centered: true
    })
    rippleRef?.fadeOut()
  }

  debounceTimeClick(){
    fromEvent<MouseEvent>(document, 'click')
    .pipe(
      tap(e => console.log('Click')),
      debounceTime(1000)
    )
    .subscribe((e: MouseEvent) => {
      console.log(`Click with debounce time: ${e}`)
    })
  }

  searchBy_UsingDebounce(e: any){
    this.searchEntry$.next(this.searchInput!)
  }

  debounceTimeSearch() {
    this.searchEntry$
    .pipe(
      debounceTime(500)
    )
    .subscribe((v) => console.log(v))
  }

  takeWhileClick(){
    interval(500)
    .pipe(
      takeWhile((value, index) => (value < 5))
    )
    .subscribe({
      next: (i) => console.log(`takeWhile: ${i}`),
      error: (error) => console.log(),
      complete: () => console.log('Completed!')
    })
  }

  takeUntilClick(){
    let dueTime$ = timer(5000)

    interval(500)
    .pipe(
      takeUntil(dueTime$)
    )
    .subscribe({
      next: (i) => console.log(i),
      error: (error) => console.log(error),
      complete: () => console.log('Completed!')
    })
  }
}
