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
  HTML.winnerNotDisplayed = true;
  HTML.showWinner = undefined;
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
  HTML.colorInterval;

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
  if (percentUntilWin > "94" && percentUntilWin <= "99" && HTML.winnerNotDisplayed) {
    HTML.winnerNotDisplayed = false;
    const minus100 = servedToday - 99;
    let winner = setWinner(minus100, servedToday);
    console.log("PUT NY WINNER " + winner);
    document.querySelector(".wrap:nth-child(3)>.win_smallnumbers").textContent = "???";
    put({ winner_number: winner });
  } else if (percentUntilWin > "94" && percentUntilWin <= "99") {
    document.querySelector(".wrap:nth-child(3)>.win_smallnumbers").textContent = "???";
  } else if (percentUntilWin >= "00" && percentUntilWin < "03" && HTML.showWinner == undefined) {
    HTML.showWinner = true;
    getWinner();
  } else {
    getWinner();
  }

  if (HTML.showWinner == true) {
    HTML.showWinner = false;
    displayAnouncement();
    setTimeout(() => {
      removeAnouncement();
    }, 15000);
    setTimeout(() => {
      HTML.showWinner = undefined;
      HTML.winnerNotDisplayed = true;
    }, 6000000);
  }
  const ordersLeft = 100 - percentUntilWin;
  displayProgress(percentUntilWin);
  displayData(winsNow, ordersLeft), percentUntilWin;
}

function removeAnouncement() {
  clearInterval(HTML.colorInterval);
  document.querySelector(".the_winner_is").classList.remove("flex");
  document.querySelector(".the_winner_is").classList.add("hide");
  document.querySelector(".anounced_number").textContent = "";
  document.querySelector("audio").pause();
}

function displayAnouncement() {
  document.querySelector(".the_winner_is").classList.remove("hide");
  document.querySelector(".the_winner_is").classList.add("flex");
  setTimeout(() => {
    document.querySelector(".anounced_number").textContent = HTML.theWinner;
  }, 3000);
  document.querySelector("audio").play();
  HTML.colorInterval = setInterval(displayRandomColor, 400);
  document.querySelector(".the_winner_is button").addEventListener("click", function () {
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
  console.log(payload);
  const postData = JSON.stringify(payload);
  console.log(postData);
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
  console.log(data.winner_number);
}

async function getWinner() {
  console.log("getWinner");
  console.log("winnerNotDisplayed " + HTML.winnerNotDisplayed);
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
  document.querySelector(".anounced_number").textContent = HTML.theWinner;
  console.log(HTML.theWinner);
}

export function displayRandomColor() {
  console.log("displayRandomColor");
  // Sætter farven til strengen der returneres fra randomBackgroundColor og randomTextColor
  document.querySelector(".anouncement").style.backgroundColor = randomBackgroundColor();
  document.querySelector(".anouncement p").style.color = randomTextColor();
  document.querySelector(".anouncement").classList.toggle("purple");
}

function randomBackgroundColor() {
  console.log("randomBackgroundColor");
  const dashBody = document.querySelector(".dashBody");
  const purple = document.querySelector(".purple");
  let color;
  if (purple) {
    color = "#e7cb79";
    if (!dashBody) {
      document.querySelector(".anouncement").classList.remove("scale_down");
      document.querySelector(".anouncement").classList.add("scale_up");
    } else {
      document.querySelector(".anouncement p").classList.remove("scale_down");
      document.querySelector(".anouncement p").classList.add("scale_up");
    }
    return color;
  } else {
    if (!dashBody) {
      document.querySelector(".anouncement").classList.remove("scale_up");
      document.querySelector(".anouncement").classList.add("scale_down");
    } else {
      document.querySelector(".anouncement p").classList.add("scale_down");
      document.querySelector(".anouncement p").classList.remove("scale_up");
    }
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
