<script setup lang="ts">
import { Schedule } from "@/models/Schedule";
import { ScheduleItem } from "@/models/ScheduleItem";
import { storage, STORAGE_KEYS } from "@/modules/storage";
import { reactive } from "vue";

import router from "@/router";

// Data
const error = reactive({ message: "" });
const schedule = reactive(storage.get(STORAGE_KEYS.SCHEDULE, Schedule));

function addNew() {
  schedule.items.push(new ScheduleItem());
}

function insertAt(i: number) {
  schedule.items.splice(i, 0, new ScheduleItem());
}

function removeAt(i: number) {
  schedule.items.splice(i, 1);
}

function save() {
  if (!storage.set(STORAGE_KEYS.SCHEDULE, schedule)) {
    error.message = "Could not save data";
    return;
  }

  goBack();
}

// Navigation
function goBack() {
  router.back();
}
</script>

<template>
  <img
    src="@/assets/icons/arrow_back.svg"
    title="Go back"
    class="icon-button"
    style="position: fixed; top: 10px; left: 10px"
    @click="goBack"
  />

  <img
    src="@/assets/icons/save.svg"
    title="Save Schedule"
    style="position: fixed; top: 10px; right: 10px"
    class="icon-button"
    @click="save"
  />

  <div class="container">
    <h1>Editor</h1>

    <h4 v-if="error.message" style="color: white; background-color: #c62828">
      {{ error.message }}
    </h4>

    <button
      style="padding: 4px; font-weight: bold; margin-bottom: 10px"
      @click="addNew"
    >
      ADD NEW ITEM
    </button>

    <table class="timeline-table">
      <tr v-for="(item, i) of schedule.items" :key="i" class="timeline-item">
        <td class="timeline-insert">
          <button @click="insertAt(i)">+</button>
        </td>
        <td class="timeline-time">
          <input type="text" v-model="item.startTime" />
        </td>
        <td class="timeline-task">
          <input type="text" v-model="item.task" />
        </td>
        <td class="timeline-actions">
          <button @click="removeAt(i)">Remove</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
}

.timeline-table {
  width: 100%;
  table-layout: fixed;
}

@media only screen and (min-width: 768px) {
  .timeline-table {
    max-width: 400px;
  }
}

.timeline-insert {
  width: 24px;
  font-weight: bold;
}

.timeline-time {
  width: 48px;
}

.timeline-actions {
  width: 68px;
}

.icon-button {
  cursor: pointer;
  color: white;
}

input,
button {
  width: 100%;
}

button {
  cursor: pointer;
}
</style>
