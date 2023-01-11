import type { IStorageItem } from "@/modules/storage/Storage";
import { ScheduleItem } from "./ScheduleItem";

export class Schedule implements IStorageItem {
  public items: ScheduleItem[] = [];

  load(data: any): void {
    this.items = data.items.map((data: any) => {
      const i = new ScheduleItem();
      i.load(data);

      return i;
    });
  }
}
