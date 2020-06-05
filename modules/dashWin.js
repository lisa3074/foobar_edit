const HTML = {};

export function dashWinDelegation() {
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
  if (toNumber >= "00" && toNumber < "90") {
    document.querySelector(".last_win").textContent = theWinner;
    console.log("theWinner is displayed GGGGGGGGGGGG");
  } else {
    document.querySelector(".last_win").textContent = "???";
    console.log("theWinner is NOT displayed GGGGGGGGGGGG");
  }
  setTimeout(() => {
    getData();
  }, 2000);
}
