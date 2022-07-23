import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, fromEvent, map, mergeAll, mergeMap, Observable, Observer, of, switchAll, switchMap, takeUntil } from 'rxjs';
import { Person } from 'src/app/models/Person';

@Component({
  selector: 'app-switch-merge',
  templateUrl: './switch-merge.component.html',
  styleUrls: ['./switch-merge.component.scss']
})
export class SwitchMergeComponent implements OnInit {
  @ViewChild('searchBy') searchInput: ElementRef = {} as ElementRef
  searchString?: string
  people$!: Observable<Person[]>
  private readonly url: string = 'http://localhost:9000'

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //this.firstOption()
    //this.secondOption()
    this.thirdOption()
  }

  filterPeople(searchInput: string): Observable<Person[]> {
    if(searchInput.length === 0){ return of<Person[]>([]) }
    let newUrl: string = `${this.url}/${searchInput}`
    return this.http.get<Person[]>(newUrl)
  }

  firstOption() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
    .pipe(
      debounceTime(700)
    )
    .subscribe(
      () => {
        this.filterPeople(this.searchString!)
        .subscribe((result) => console.log(result))
      }
    )
  }

  secondOption(){
    let keyUp$: Observable<Event> = fromEvent<Event>(this.searchInput.nativeElement, 'keyup')
    // let fetch$: Observable<Person[]> = keyUp$.pipe(
      //   debounceTime(700),
      //   map(() => this.filterPeople(this.searchString!)),
      //   mergeAll()
      // )
      
    let fetch$: Observable<Person[]> = keyUp$.pipe(
      debounceTime(700),
      mergeMap(() => this.filterPeople(this.searchString!))
    )

    this.people$ = fetch$
  }

  thirdOption() {
    let keyUp$: Observable<Event> = fromEvent<Event>(this.searchInput.nativeElement, 'keyup')
    
    // let fetch$: Observable<Person[]> = keyUp$.pipe(
    //   debounceTime(700),
    //   map(() => this.filterPeople(this.searchString!)),
    // ).pipe(switchAll())

    let fetch$: Observable<Person[]> = keyUp$.pipe(
      debounceTime(700),
      switchMap(() => this.filterPeople(this.searchString!))
    )
    this.people$ = fetch$
  }

}
