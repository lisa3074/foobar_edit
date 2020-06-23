const HTML = {};

export async function getData() {
  HTML.amount = 0;
  HTML.count = 0;
  console.log("getData");
  let response = await fetch("https://foobar3exam2.herokuapp.com");
  let jsonData = await response.json();
  countBeers(jsonData);
}

function countBeers(jsonData) {
  console.log("countBeers");
  jsonData.queue.forEach((order) => {
    HTML.amount = order.order.length;
    HTML.count += HTML.amount;
  });
  jsonData.serving.forEach((order) => {
    HTML.amount = order.order.length;
    HTML.count += HTML.amount;
  });
  displayMinutes();
  setTimeout(() => {
    getData();
  }, 1000);
}
function displayMinutes() {
  console.log("displayMinutes");
  const path = document.querySelector(".time_wrapper .percent svg circle:nth-child(2)");
  path.style.setProperty("--time-estimate", Math.round(HTML.count * 0.5));
  document.querySelector(".minutes").textContent = Math.round(HTML.count * 0.5);
}
