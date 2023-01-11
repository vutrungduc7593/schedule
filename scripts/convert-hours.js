const hours = [
  "6h",
  "6h45",
  "7h45",
  "8h",
  "9h",
  "11h00",
  "11h30",
  "11h55",
  "12h30",
  "13h00",
  "13h30",
  "15h30",
  "16h00",
  "18h00",
  "19h30",
  "21h30",
  "23h00",
];

const hourNums = hours.map((h) => {
  var hour = Number(h.split("h")[0]);
  var min = Number(h.split("h")[1]);

  if (isNaN(min)) {
    min = 0;
  } else {
    min = min / 60;
  }

  return hour + min;
});

console.log(hourNums);
