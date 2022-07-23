import { Component, OnInit } from '@angular/core';
import { delay, map, Observable, Observer, toArray } from 'rxjs';
import { User } from '../../models/User'

@Component({
  selector: 'app-async',
  templateUrl: './async.component.html',
  styleUrls: ['./async.component.scss']
})
export class AsyncComponent implements OnInit {
  options$?: Observable<string[]>
  user$?: Observable<User>

  constructor() { }

  ngOnInit(): void {
    this.options$ = new Observable<string[]>(
      (observer: Observer<any>) => {
        for(let i = 0; i<10; i++){
          observer.next(`This is my ${i}th option.`)
        }
        observer.complete()
      }
    )
    .pipe(
      map(x => x+'..'),
      toArray(),
      delay(2000)
    )
    //this.options$.subscribe((x) => console.log(x))
    this.user$ = new Observable<User>(
      (observer: Observer<any>) => {
        let names = ['Mr. James', 'Mr. John', 'Mr. Ray', 'Ms. Angel']
        let logins = ['james', 'john', 'ray', 'angel']
        let i = 0
        setInterval(()=> {
          if(i == 4) observer.complete()
          else{
            observer.next({login: logins[i], name: names[i]})
          }
          i++
        }, 2000)
      }
    )
    this.user$.subscribe((x)=> console.log(x))
  }

}
