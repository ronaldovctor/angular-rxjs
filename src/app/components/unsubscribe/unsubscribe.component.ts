import { Component, OnInit } from '@angular/core';
import { fromEvent, interval, skipUntil, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent implements OnInit {
  isSubscriptionsActive: boolean = false
  subscriptions: Subscription[] = []
  unSubAll$: Subject<any> = new Subject()
  intervalSubs: Subscription = new Subscription()

  constructor() { }

  ngOnInit(): void {
    this.checkSubscriptions()
  }

  checkSubscriptions(): void {
    this.intervalSubs = interval(100).subscribe(
      ()=> {
        let active = false
        this.subscriptions.forEach((s)=> {
          if(!s.closed)
            active = true
        })
        this.isSubscriptionsActive = active
      }
    )
  }

  subscribe(): void {
    const subs1 = interval(100)
    .pipe(
      takeUntil(this.unSubAll$)
    )
    .subscribe((n) => {
      console.log(n)
    })
    const subs2 = fromEvent<MouseEvent>(document, 'mousemove')
    .pipe(
      takeUntil(this.unSubAll$)
    )
    .subscribe((e) => console.log(e))

    this.subscriptions.push(subs1)
    this.subscriptions.push(subs2)
  }

  unsubscribe(): void {
    this.unSubAll$.next('')
  }

  ngOnDestroy(): void {
    if(this.intervalSubs != null)
      this.intervalSubs.unsubscribe()
    console.log('Destroy')
  }
}
