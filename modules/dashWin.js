import { displayRandomColor } from "./win";

const HTML = {};

export function dashWinDelegation() {
  HTML.theCount;
  HTML.count = 0;
  getData();
}
async function getData() {
  console.log("getData");
  let response = await fetch("https://frontend-22d4.restdb.io/rest/winner/5ece601e2313157900020042", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5e9581a6436377171a0c234f",
      "cache-control": "no-cache",
    },
  });
  const jsonData = await response.json();
  const theWinner = jsonData.winner_number;
  displayData(theWinner);
}
function displayData(theWinner) {
  console.log("displayData");
  const percentage = document.querySelector(".win_number").textContent;
  const toNumber = Number(percentage);
  if (toNumber >= "00" && toNumber < "93") {
    document.querySelector(".last_win").textContent = theWinner;
    console.log("theWinner is displayed GGGGGGGGGGGG");
  } else {
    document.querySelector(".last_win").textContent = "???";
    console.log("theWinner is NOT displayed GGGGGGGGGGGG");
  }
  if (toNumber >= "00" && toNumber < "03") {
    displayAnouncement(theWinner);
  } else {
    removeAnouncement();
  }
  setTimeout(() => {
    getData();
  }, 2000);
}
function removeAnouncement() {
  console.log("removeAnouncement");
  clearInterval(HTML.theCount);
  document.querySelector(".winner_big").classList.remove("hide");
  document.querySelector(".winner_big").classList.add("grid");
  document.querySelector(".the_winner_is").classList.remove("flex");
  document.querySelector(".the_winner_is").classList.add("hide");
  document.querySelector(".anounced_number").textContent = "";
}

function displayAnouncement(theWinner) {
  console.log("displayAnouncement");
  document.querySelector(".the_winner_is").classList.remove("hide");
  document.querySelector(".the_winner_is").classList.add("flex");
  document.querySelector(".winner_big").classList.add("hide");
  document.querySelector(".winner_big").classList.remove("grid");
  setTimeout(() => {
    document.querySelector(".anounced_number").textContent = theWinner;
  }, 1000);
  console.log(HTML.count);
  if (HTML.count === 0) {
    HTML.count++;
    document.querySelector("audio").play();
    HTML.theCount = setInterval(displayRandomColor, 500);
  }
}
