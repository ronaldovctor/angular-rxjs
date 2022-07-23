import { Conditional } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, takeUntil } from 'rxjs';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {
  @ViewChild('myRect') myRect!: ElementRef

  top: number = 40
  left: number = 40

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    let mousedown = fromEvent<MouseEvent>(this.myRect.nativeElement, 'mousedown')
    let mousemove = fromEvent<MouseEvent>(document, 'mousemove')
    let mouseup = fromEvent(document, 'mouseup')

    mousedown.subscribe(
      (event:MouseEvent) => {
        let x = event.pageX
        console.log(x)
        let y = event.pageY
        console.log(y)

        mousemove
        .pipe(
          takeUntil(mouseup)
        )
        .subscribe(
          (event: MouseEvent) => {
            let offSetX = x - event.pageX
            console.log(offSetX)
            let offSetY = y - event.pageY
            console.log(offSetY)

            this.top -= offSetY
            this.left -= offSetX

            x = event.pageX
            y = event.pageY
          }
        )
      }
    )
  }

}
