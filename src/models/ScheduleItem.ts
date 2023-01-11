import type { IStorageItem } from "@/modules/storage/Storage";

export class ScheduleItem implements IStorageItem {
  public startTime!: string;
  public task!: string;

  load(data: any): void {
    this.startTime = data.startTime;
    this.task = data.task;
  }
}
