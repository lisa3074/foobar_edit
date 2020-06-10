const HTML = {};

const Win = {
  serveLength: "",
  serving1: "",
  serving3: "",
  serving3: "",
  servedToday: "",
};
export function init() {
  console.log("init");
  HTML.count = 0;
  getData();
}

export async function getData() {
  HTML.url = "https://foobar3exam2.herokuapp.com";
  HTML.winUrl = "https://frontend-22d4.restdb.io/rest/winner";
  HTML.apiKey = "5e9581a6436377171a0c234f";
  HTML.beforeLastServed;
  HTML.theWinner;
  HTML.lastTime = 0;
  HTML.now;
  HTML.theCount;

  console.log("getData");
  console.log("loadJson");
  let response = await fetch(HTML.url);
  const jsonData = await response.json();
  makeObjects(jsonData);
}

function makeObjects(jsonData) {
  console.log("makeObjects");
  const winObject = Object.create(Win);
  // console.log(jsonData);
  HTML.last;
  winObject.serveLength = jsonData.serving.length;
  winObject.serving1 = JSON.parse(jsonData.bartenders[0]["servingCustomer"]);
  winObject.serving2 = JSON.parse(jsonData.bartenders[1]["servingCustomer"]);
  winObject.serving3 = JSON.parse(jsonData.bartenders[2]["servingCustomer"]);
  console.log(HTML.last);

  if (winObject.serveLength == 0) {
    winObject.servedToday = HTML.last;
    console.log(winObject.servedToday);
  } else {
    winObject.servedToday = Math.max(winObject.serving1, winObject.serving2, winObject.serving3);
    HTML.last = winObject.servedToday;
    console.log(winObject.servedToday);
  }
  setData(winObject.servedToday);
}

function setData(servedToday) {
  console.log("setData");
  const clicked = document.querySelector(".the_winner_is");
  const winsNow = Math.floor(servedToday / 100);
  let percentUntilWin;
  if (servedToday == 0) {
    servedToday = HTML.beforeLastServed;
  }
  if (servedToday < 100) {
    percentUntilWin = servedToday;
  } else if (servedToday < 1000) {
    const thePercentage = servedToday.toString();
    console.log(servedToday);
    percentUntilWin = thePercentage.substring(1, 3);
  } else {
    const thePercentage = servedToday.toString();
    console.log(servedToday);
    percentUntilWin = thePercentage.substring(2, 4);
  }
  //Code refracturing: instead of having the if/else parted into two functions (this and getWinner), i put it into one.
  if (percentUntilWin > "93" && percentUntilWin <= "99") {
    const minus100 = servedToday - 99;
    let winner = setWinner(minus100, servedToday);
    console.log(winner);
    document.querySelector(".wrap:nth-child(3)>.win_smallnumbers").textContent = "???";
    put({ winner_number: winner });
  } else {
    getWinner();
  }
  let done;
  if ((percentUntilWin >= "00" && percentUntilWin < "05") || percentUntilWin > "05") {
    if (percentUntilWin == "00" && !done) {
      clicked.dataset.clicked = "";
      HTML.count = 0;
      done = true;
    }
    if (clicked.dataset.clicked == "") {
      displayAnouncement();
    }
  } else {
    removeAnouncement();
  }
  const ordersLeft = 100 - percentUntilWin;
  displayProgress(percentUntilWin);
  displayData(winsNow, ordersLeft), percentUntilWin;
}

function removeAnouncement() {
  clearInterval(HTML.theCount);
  document.querySelector(".the_winner_is").classList.remove("flex");
  document.querySelector(".the_winner_is").classList.add("hide");
}

function displayAnouncement() {
  document.querySelector(".the_winner_is").classList.remove("hide");
  document.querySelector(".the_winner_is").classList.add("flex");
  document.querySelector(".anounced_number").textContent = HTML.theWinner;

  if (HTML.count === 0) {
    HTML.count++;
    console.log(HTML.count);
    HTML.theCount = setInterval(displayRandomColor, 400);
  }
  document.querySelector(".the_winner_is button").addEventListener("click", function () {
    document.querySelector(".the_winner_is").dataset.clicked = "yes";
    removeAnouncement();
  });
}

//I made the random calc in an else. Don't know whym but of course it didn't work when min < 0.
function setWinner(min, max) {
  if (min < 0) {
    min = 1;
  }
  const random = Math.floor(Math.random() * (max - min)) + min;
  return random;
}

async function put(payload) {
  console.log("put");
  const postData = JSON.stringify(payload);
  //Sikrer det er det rigtige id der redigeres
  let response = await fetch(`${HTML.winUrl}/${"5ece601e2313157900020042"}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": HTML.apiKey,
      "cache-control": "no-cache",
    },
    body: postData,
  });
  const data = await response.json();
}

async function getWinner() {
  console.log("getWinner");
  let response = await fetch(`${HTML.winUrl}/${"5ece601e2313157900020042"}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": HTML.apiKey,
      "cache-control": "no-cache",
    },
  });
  const jsonData = await response.json();
  HTML.theWinner = jsonData.winner_number;
  console.log(HTML.theWinner);
  displayWinner();
}

function displayProgress(percentUntilWin) {
  console.log("displayProgress");
  const path = document.querySelector(".box .percent svg circle:nth-child(2)");
  path.style.setProperty("--progress", percentUntilWin);
  document.querySelector(".win_number").textContent = percentUntilWin;
}
function displayData(winsNow, ordersLeft) {
  console.log("displayData");
  document.querySelector(".wrap:nth-child(1)>.win_smallnumbers").textContent = winsNow;
  document.querySelector(".wrap:nth-child(2)>.win_smallnumbers").textContent = ordersLeft;
  setTimeout(() => {
    getData();
  }, 2000);
}

function displayWinner() {
  console.log("displayWinner");
  document.querySelector(".wrap:nth-child(3)>.win_smallnumbers").textContent = HTML.theWinner;
  console.log(HTML.theWinner);
}

function displayRandomColor() {
  console.log("displayRandomColor");
  // Sætter farven til strengen der returneres fra randomBackgroundColor og randomTextColor
  document.querySelector(".anouncement").style.backgroundColor = randomBackgroundColor();
  document.querySelector(".anouncement p").style.color = randomTextColor();
  document.querySelector(".anouncement").classList.toggle("purple");
}

function randomBackgroundColor() {
  console.log("randomBackgroundColor");
  const purple = document.querySelector(".purple");
  let color;
  if (purple) {
    color = "#e7cb79";
    document.querySelector(".anouncement").classList.remove("scale_down");
    document.querySelector(".anouncement").classList.add("scale_up");
    return color;
  } else {
    document.querySelector(".anouncement").classList.remove("scale_up");
    document.querySelector(".anouncement").classList.add("scale_down");
    color = "#9175bc";
    return color;
  }
}
function randomTextColor() {
  console.log("randomTextColor");
  const purple = document.querySelector(".purple");
  let text;
  if (purple) {
    text = "#3a2058";
    return text;
  } else {
    text = "#ffffff";
    return text;
  }
}
