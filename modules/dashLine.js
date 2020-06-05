export function lineDelegation() {
  loadJson();
}

async function loadJson() {
  console.log("loadJson");
  let response = await fetch("https://foobar3exam2.herokuapp.com/");
  let jsonData = await response.json();
  queueLoops(jsonData.queue);
  serveLoop(jsonData.serving);
}

function queueLoops(queue) {
  console.log("queueLoops");
  document.querySelector(".line .in_line").innerHTML = "";
  queue.forEach(displayQueue);
}
function serveLoop(serving) {
  console.log("serveLoop");
  document.querySelector(".pickup .in_line").innerHTML = "";
  serving.forEach(displayServed);
}

function displayQueue(queue) {
  console.log("displayQueue");
  let latestQueue;
  const clone = document.querySelector("article.line > template").content.cloneNode(true);
  clone.querySelector(".line_number").textContent = queue.id;
  document.querySelector("article.line > div.in_line.grid").appendChild(clone);
  latestQueue = queue.id;
  displayLatestQueue(latestQueue);
}

function displayLatestQueue(latestQueue) {
  console.log("displayLatestQueue");
  document.querySelector(".newest_num").textContent = latestQueue;
}

function displayServed(serving) {
  console.log("displayServed");
  const clone = document.querySelector("article.pickup > template").content.cloneNode(true);
  clone.querySelector(".pickup_number").textContent = serving.id;
  document.querySelector("article.pickup > div.in_line.grid").appendChild(clone);
  document.querySelector(".pickup .newest_num").textContent = serving.id;
}
