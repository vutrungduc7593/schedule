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

setInterval(() => {
  update();
}, 1000);

function update() {
  const current = new Date();

  currentTime.value =
    current.getHours() +
    current.getMinutes() / 60 +
    current.getSeconds() / 3600;
}

function saveSchedule() {
  if (!storage.set(STORAGE_KEYS.SCHEDULE, schedule)) {
    alert("Could not save data");
  }
}

update();

// Converters
function formatTime(time: number): string {
  const hour = Math.floor(time);
  const min = Math.floor((time - hour) * 60);
  const sec = Math.round((time - hour - min / 60) * 3600);

  return `${hour}:${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
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

  if (nextItemTime <= currentTime.value) {
    return TimelineItemStatus.Over;
  } else if (currentItemTime <= currentTime.value) {
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

// Download
function saveAs(
  content: string,
  fileName: string,
  mimeType: string = "text/plain"
) {
  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(new Blob([content], { type: mimeType }));
  a.download = fileName;
  a.click();
}

function currentDateFileName() {
  const now = new Date();
  now.setHours(now.getHours() - now.getTimezoneOffset() / 60);

  return now.toISOString().split(".")[0].replace(/[-:T]/g, "");
}

function download() {
  saveAs(
    JSON.stringify(schedule),
    `schedule-${currentDateFileName()}.json`,
    "application/json"
  );
}

// Upload
async function pickFile(): Promise<File> {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json,application/json";
    fileInput.click();

    fileInput.onchange = () => {
      if (!fileInput.files) return reject("Not found files in input");

      const result = fileInput.files?.length > 0 ? fileInput.files[0] : null;

      if (!result) return reject("Not select any file");

      resolve(result);
    };
  });
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    reader.onload = (e) => {
      if (!e.target) return reject("Not found target");

      if (typeof e.target.result !== "string")
        return reject("Result is not a string");

      resolve(e.target.result);
    };

    reader.onerror = (e) => {
      reject(e.target?.error);
    };
  });
}

async function upload() {
  try {
    const file = await pickFile();

    const content = await readFile(file);

    const data = JSON.parse(content);

    schedule = reactive(data);

    saveSchedule();

    alert("Uploaded data");
  } catch (error) {
    alert(error);
  }
}
</script>

<template>
  <!-- Upload -->
  <img
    src="@/assets/icons/upload.svg"
    title="Upload"
    class="icon-button"
    style="position: fixed; top: 10px; right: 126px"
    @click="upload"
  />

  <!-- Download -->
  <img
    src="@/assets/icons/download.svg"
    title="Download"
    class="icon-button"
    style="position: fixed; top: 10px; right: 68px"
    @click="download"
  />

  <!-- Edit -->
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
