import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { vtubers } from "vtubers";

@Injectable({ providedIn: "root" })
export class ConfigService {
  vtuber: Set<string>;
  theme: string;

  constructor(@Inject(DOCUMENT) private document: Document) {
    if (window.localStorage.getItem("vtuber")) {
      this.vtuber = new Set(
        window.localStorage
          .getItem("vtuber")
          .split(",")
          .filter((id) => id in vtubers)
      );
    }
    this.theme = window.localStorage.getItem("theme");

    this.theme ??= "default";
    this.vtuber ??= new Set(
      Object.values(vtubers)
        .filter((v) => v.default)
        .map((v) => v.id)
    );

    this.document.body.classList.add(this.theme);
  }

  addVtubers(ids: string[]) {
    for (const id of ids) {
      this.vtuber.add(id);
    }
    this.setItem("vtuber", [...this.vtuber].join(","));
  }

  deleteVTubers(ids: string[]) {
    for (const id of ids) {
      this.vtuber.delete(id);
    }
    this.setItem("vtuber", [...this.vtuber].join(","));
  }

  setTheme(newTheme: string) {
    this.document.body.classList.replace(this.theme, newTheme);

    this.setItem("theme", newTheme);
    this.theme = newTheme;
  }

  setLang(newLang: string) {
    this.setItem("lang", newLang);
    location.reload();
  }

  private setItem(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }
}
