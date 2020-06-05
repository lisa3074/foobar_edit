const HTML = {};

const Queue = {
  queueLength: "",
  loggedAt: "",
  servedToday: "",
  orderNumber: "",
  order: "",
  beerCount: "",
  serving1: "",
  serving2: "",
  serving3: "",
};

export function indexDelegation() {
  console.log("indexDelegation");
  HTML.url = "https://foobar3exam2.herokuapp.com";
  HTML.array = [];
  HTML.jsonData;
  HTML.beforeLastServed;
  HTML.lastTime = 0;
  loadJson();
}

async function loadJson() {
  console.log("loadJson");
  let response = await fetch(HTML.url);
  HTML.jsonData = await response.json();
  makeObjects();
}
function makeObjects() {
  let now;
  console.log("makeObjects");
  const foobarObject = Object.create(Queue);
  foobarObject.queueLength = HTML.jsonData.queue.length;
  foobarObject.serving1 = JSON.parse(HTML.jsonData.bartenders[0]["servingCustomer"]);
  foobarObject.serving2 = JSON.parse(HTML.jsonData.bartenders[1]["servingCustomer"]);
  foobarObject.serving3 = JSON.parse(HTML.jsonData.bartenders[2]["servingCustomer"]);
  foobarObject.servedToday = Math.max(foobarObject.serving1, foobarObject.serving2, foobarObject.serving3);
  now = new Date().getTime();
  if (now - HTML.lastTime > 1000) {
    setData(foobarObject.servedToday);
  }
  if (now - HTML.lastTime > 5000) {
    loops(foobarObject);
    HTML.lastTime = now;
  }
}
function loops(foobarObject) {
  console.log("loops");
  const queue = foobarObject.queueLength;
  HTML.array.unshift(queue);
  if (HTML.array.length <= 1) {
    console.log("under 10");
  } else {
    console.log("over 10");
    HTML.array.pop();
  }
  displayQueue(foobarObject);
}
function displayQueue(foobarObject) {
  document.querySelector(".wrap:nth-child(1) > .q_bar").classList.remove("fullHeight");
  for (let number = 0; number < 5; number++) {
    console.log("displayQueue");
    const timeStamp = document.querySelectorAll(".time");
    const queueNow = document.querySelectorAll(".queue_num");
    const served = document.querySelectorAll(".served_today");
    const wins = document.querySelectorAll(".wins_today");

    //Convert time from milliseconds
    const time = new Date().getTime();
    const date = new Date(time);
    const rightTime = date.toString();
    //Make sure I only get the time
    const theRightIime = rightTime.substring(15, 21);

    //The first bar (for animation)
    document.querySelectorAll(".wrap:nth-child(1) > .q_bar").forEach((firstBar) => {
      firstBar.classList.add("nullHeight");
    });
    //The other bars
    const bars = document.querySelectorAll(`.queue_box > .wrap:nth-child(${number + 1}) > .q_bar`);
    const barNum = document.querySelectorAll(`.queue_box > .wrap:nth-child(${number + 1}) > .q_num`);
    if (HTML.array[number] == "0") {
      HTML.array[number] = "0.5";
    }
    bars.forEach((bar) => {
      bar.style.setProperty("--height", HTML.array[number]);
    });

    const winsNow = Math.floor(foobarObject.servedToday / 100);
    if (foobarObject.servedToday == 0) {
      foobarObject.servedToday = HTML.beforeLastServed;
    }
    timeStamp.forEach((time) => {
      time.textContent = theRightIime;
    });
    queueNow.forEach((queue) => {
      queue.textContent = foobarObject.queueLength;
    });
    barNum.forEach((num) => {
      num.textContent = Math.floor(HTML.array[number]) + " IN LINE";
    });
    wins.forEach((win) => {
      win.textContent = winsNow;
    });
    served.forEach((served) => {
      served.textContent = foobarObject.servedToday;
    });
    HTML.beforeLastServed = foobarObject.servedToday;
  }
  setTimeout(() => {
    loadJson();
    document.querySelectorAll(".wrap:nth-child(1) > .q_bar").forEach((firstBar) => {
      firstBar.classList.remove("nullHeight");
    });
    document.querySelectorAll(".wrap:nth-child(1) > .q_bar").forEach((firstWrap) => {
      firstWrap.classList.add("fullHeight");
    });
  }, 10000);
}
function setData(servedToday) {
  console.log("setData");
  let percentUntilWin;

  if (servedToday == 0) {
    servedToday = HTML.beforeLastServed;
  }
  if (servedToday < 100) {
    percentUntilWin = servedToday;
  } else if (servedToday < 1000) {
    const thePercentage = servedToday.toString();
    percentUntilWin = thePercentage.substring(1, 3);
  } else {
    const thePercentage = servedToday.toString();
    percentUntilWin = thePercentage.substring(2, 4);
  }

  const ordersLeft = 100 - percentUntilWin;
  displayProgress(percentUntilWin);
  displayData(ordersLeft);
}
function displayProgress(percentUntilWin) {
  console.log("displayProgress");
  const path = document.querySelectorAll("div > svg > circle:nth-child(2)");
  path.forEach((path) => {
    path.style.setProperty("--progress", percentUntilWin);
  });
  document.querySelectorAll(".win_number").forEach((number) => {
    number.textContent = percentUntilWin;
  });
}
function displayData(ordersLeft) {
  document.querySelector(".beernumber").textContent = ordersLeft;
  setTimeout(() => {
    loadJson();
  }, 1000);
}
