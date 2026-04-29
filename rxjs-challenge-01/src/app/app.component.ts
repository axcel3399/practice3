import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { fromEvent, merge, Observable } from "rxjs";
import { distinctUntilChanged, map, shareReplay, startWith } from "rxjs/operators";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  @ViewChild("focusArea", { static: true })
  private focusArea!: ElementRef<HTMLElement>;

  focusInside$!: Observable<boolean>;

  ngOnInit(): void {
    const area = this.focusArea.nativeElement;

    this.focusInside$ = merge(
      fromEvent<FocusEvent>(area, "focusin").pipe(map(() => true)),
      fromEvent<FocusEvent>(area, "focusout").pipe(
        map(event => area.contains(event.relatedTarget as Node))
      ),
      fromEvent<MouseEvent>(document, "mousedown").pipe(
        map(event => area.contains(event.target as Node))
      )
    ).pipe(
      startWith(false),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
