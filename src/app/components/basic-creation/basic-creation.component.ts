import { Component, OnInit } from '@angular/core';
import { from, fromEvent, interval, Observable, Observer, of, Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-basic-creation',
  templateUrl: './basic-creation.component.html',
  styleUrls: ['./basic-creation.component.scss']
})
export class BasicCreationComponent implements OnInit {
  subscription: Subscription = new Subscription()

  constructor() { }

  ngOnInit(): void {
  }

  observableCreate() {
    const hello = new Observable(
      (observer: Observer<any>) => {
        observer.next('hello')
        observer.next('from')
        observer.next('observable')
        observer.complete()
      }
    )
    hello.subscribe((x) => console.log(x))
  }

  fromClick() {
    const source = from([1,2,3,4,5])
    source.subscribe((x) => console.log(x))
  }

  ofClick() {
    of([1,2,3,4,5]).subscribe((x) => console.log(x))
  }

  intervalClick() {
    const source: Observable<number> = interval(1000)
    const subscription: Subscription = source.subscribe(x => console.log(x))
    // setTimeout(()=> {
    //   subscription.unsubscribe()
    // }, 5000 )
    this.subscription.add(subscription)
  }

  timerClick() {
    const source: Observable<number> = timer(2000, 10)
    const subscription: Subscription = source.subscribe(x => console.log(x))
    // setTimeout(()=> {
    //   subscription.unsubscribe()
    // }, 4000 )
    this.subscription.add(subscription)
  }

  fromEventClick(){
    const subscription: Subscription = fromEvent(document, 'click').subscribe(x => console.log(x))
    this.subscription.add(subscription)
  }

  unsubscribeClick() {
    this.subscription.unsubscribe()
    this.subscription = new Subscription()
  }
}
