import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { isSameDay, parseISO } from "date-fns";
import { timer } from "rxjs";
import { map } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";

import { Stream } from "@holostats/libs/models";
import { VTUBERS } from "@holostats/libs/const";

import { ApiService, Config } from "../services";

@Component({
  selector: "hs-streams-list",
  templateUrl: "./streams-list.component.html",
  styleUrls: ["./streams-list.component.scss"]
})
export class StreamsListComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private config: Config,
    private spinnerService: NgxSpinnerService
  ) {}

  vtubers = VTUBERS;
  onAir: Stream[] = [];
  ended: { day: Date; streams: Stream[] }[] = [];
  updatedAt = "";
  showSpinner = false;

  everySecond$ = timer(0, 1000).pipe(map(() => new Date()));
  everyMinute$ = timer(0, 60 * 1000).pipe(map(() => new Date()));

  @ViewChild("spinner", { static: true, read: ElementRef })
  spinnerContainer: ElementRef;

  get lastId(): string {
    return this.ended[this.ended.length - 1].streams[
      this.ended[this.ended.length - 1].streams.length - 1
    ].id;
  }

  obs = new IntersectionObserver(entries => {
    if (entries.map(e => e.isIntersecting).some(e => e)) {
      this.obs.unobserve(this.spinnerContainer.nativeElement);

      this.apiService
        .getStreamsWithSkip(this.config.selectedVTubers, this.lastId)
        .subscribe(data => this.addStreams(data.streams));
    }
  });

  ngOnInit() {
    this.spinnerService.show();
    this.apiService.getStreams(this.config.selectedVTubers).subscribe(data => {
      this.addStreams(data.streams);
      this.updatedAt = data.updatedAt;
      this.spinnerService.hide();
    });
  }

  findVTuber(id: string) {
    return this.vtubers.find(v => v.id == id);
  }

  trackBy(_: number, stream: Stream): string {
    return stream.id;
  }

  addStreams(streams: Stream[]) {
    for (let stream of streams) {
      let start = parseISO(stream.start);
      if (
        this.ended.length > 0 &&
        isSameDay(this.ended[this.ended.length - 1].day, start)
      ) {
        this.ended[this.ended.length - 1].streams.push(stream);
      } else {
        this.ended.push({ day: start, streams: [stream] });
      }
    }

    if (streams.length < 24) {
      this.showSpinner = false;
    } else {
      this.showSpinner = true;
      this.obs.observe(this.spinnerContainer.nativeElement);
    }
  }
}