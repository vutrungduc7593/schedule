<script setup lang="ts">
import { reactive, ref } from "vue";

import { storage, STORAGE_KEYS } from "@/modules/storage";
import { Schedule } from "@/models/Schedule";
import router from "@/router";

// Schedule
let currentTime = ref(0);

enum TimelineItemStatus {
  Over,
  Current,
  Upcomming,
}

let schedule = reactive(storage.get(STORAGE_KEYS.SCHEDULE, Schedule));

// Loop
setInterval(() => {
  update();
}, 1000);

function update() {
  const current = new Date();

  currentTime.value = current.getHours() + current.getMinutes() / 60;
}

update();

// Converters
function formatTime(time: number): string {
  const hour = Math.floor(time);
  const min = Math.round((time - hour) * 60);

  return `${hour}h${min < 10 ? "0" : ""}${min}`;
}

function parseTime(time: string): number {
  if (time == null) return 0;

  let hour = Number(time.split("h")[0]);
  let min = Number(time.split("h")[1]) / 60;

  return hour + min;
}

function timelineItemStatusAt(index: number): TimelineItemStatus {
  const currentItemTime = parseTime(schedule.items[index].startTime);
  const nextItemTime =
    index + 1 < schedule.items.length
      ? parseTime(schedule.items[index + 1].startTime)
      : 24;

  if (nextItemTime < currentTime.value) {
    return TimelineItemStatus.Over;
  } else if (currentItemTime < currentTime.value) {
    return TimelineItemStatus.Current;
  } else {
    return TimelineItemStatus.Upcomming;
  }
}

function timelineItemStatusClassAt(index: number): string | undefined {
  const status = timelineItemStatusAt(index);

  switch (status) {
    case TimelineItemStatus.Current:
      return "timeline-item__current";
    case TimelineItemStatus.Over:
      return "timeline-item__hidden";
  }
}

// Navigation
function goToEditor() {
  router.push("/editor");
}
</script>

<template>
  <img
    src="@/assets/icons/edit_note.svg"
    title="Edit Schedule"
    class="icon-button"
    style="position: fixed; top: 10px; right: 10px"
    @click="goToEditor"
  />

  <div style="text-align: center">
    <h1>{{ formatTime(currentTime) }}</h1>

    <table class="timeline-table">
      <tr
        v-for="(item, i) of schedule.items"
        :key="i"
        class="timeline-item"
        :class="[timelineItemStatusClassAt(i)]"
      >
        <td class="timeline-time">{{ item.startTime }}</td>
        <td class="timeline-task">{{ item.task }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.timeline-item {
  display: flex;
}

.timeline-table {
  width: 100%;
}

.timeline-item__hidden {
  opacity: 0.3;
}

.timeline-item__current {
  font-weight: bold;
  color: #388e3c;
}

.timeline-time {
  font-weight: bold;
  width: 64px;
}

.icon-button {
  cursor: pointer;
  color: white;
}
</style>
