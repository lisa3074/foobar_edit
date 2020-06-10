const HTML = {};

export async function getUser() {
  console.log("getUser");
  HTML.endpoint = "https://foobar3exam2.herokuapp.com";
  HTML.restDb = "https://frontend-22d4.restdb.io/rest/foobar";
  HTML.apiKey = "5e9581a6436377171a0c234f";
  HTML.form = document.querySelector(".login_form");
  HTML.data;
  //GET
  let response = await fetch(HTML.restDb, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": HTML.apiKey,
      "cache-control": "no-cache",
    },
  });
  HTML.data = await response.json();
  checkIfValid(HTML.data);
  document.querySelector(".log_in_done").classList.remove("disabled");
  document.querySelector(".check").classList.remove("disabled");
  document.querySelector(".preloader").classList.add("hide");
}
export function displayDisabledButton() {
  console.log("displayDisabledButton");
  const account = document.querySelector(".account_container");
  document.querySelector(".log_in_done").classList.add("disabled");
  if (account.classList[1] == "hide") {
    document.querySelector(".preloader").classList.remove("hide");
  } else {
    document.querySelector(".preloader").classList.add("hide");
  }
  document.querySelector(".check").classList.add("disabled");
}
function checkIfValid(data) {
  console.log("checkIfValid");
  const username = document.querySelector("#username_login").value;
  const password = document.querySelector("#password_login").value;
  let userValid;

  //Check validity
  data.forEach((order) => {
    if (order.username == username) {
      console.log("Username correct");
      userValid = true;
      if (order.username == username && order.password == password) {
        console.log("username and password correct");
        loginDelegation(username, data, password);
      } else {
        console.log("password incorrect");
        displayError(userValid);
        // userValid = true;
      }
    } else {
      console.log("username incorrect");
      displayError(userValid);
    }
  });
}
function displayError(userValid) {
  console.log("displayError");
  const username = document.querySelector("#username_login");
  const password = document.querySelector("#password_login");

  if (userValid) {
    console.log("correct username");
    username.classList.remove("invalid");
    password.classList.add("invalid");
    document.querySelector(".invalid_user").classList.add("hide");
    document.querySelector(".invalid_password").classList.remove("hide");
  } else {
    console.log("invalid username");
    username.classList.add("invalid");
    password.classList.add("invalid");
    document.querySelector(".invalid_user").classList.remove("hide");
    document.querySelector(".invalid_password").classList.remove("hide");
  }
}

function loginDelegation(username, data, password) {
  console.log("loginDelegation");
  displayAccount();
  logout();
  document.querySelector(".account_container .grid_item2").addEventListener("click", function () {
    displayReceipts(username, data, password);
  });
  document.querySelector(".check_status .check").addEventListener("click", function (e) {
    e.preventDefault;
    document.querySelector(".status_write").textContent = "";
    displayDisabledButton();
    getStatus(e);
  });
}
function displayAccount() {
  console.log("displayAccount");
  document.querySelector(".log_in_container").classList.add("hide");
  document.querySelector(".account_container").classList.remove("hide");
  document.querySelector(".receipts_wrapper").classList.add("hide");
  document.querySelector(".main_content .login_heading").textContent = "ACCOUNT";
}

function logout() {
  console.log("logout");
  document.querySelector(".account_container .grid_item3").addEventListener("click", function () {
    document.querySelector(".log_in_container").classList.remove("hide");
    document.querySelector(".account_container").classList.add("hide");
    document.querySelector(".receipts_wrapper").classList.add("hide");
    document.querySelector(".invalid_password").classList.add("hide");
    document.querySelector(".invalid_user").classList.add("hide");
    document.querySelector("#password_login").classList.remove("invalid");
    document.querySelector("#username_login").classList.remove("invalid");
    HTML.form.reset();
    document.querySelector(".main_content .login_heading").textContent = "LOG IN";
  });
}

function displayReceipts(username, data, password) {
  console.log("displayReceipts");
  document.querySelector(".receipts_container").innerHTML = "";
  data.sort((a, b) => b.time - a.time);
  data.forEach((order) => {
    if (username == order.username && password == order.password) {
      console.table(order);
      const clone = document.querySelector(".receipt_temp").content.cloneNode(true);
      clone.querySelector(".wrapper").dataset.id = order._id;
      clone.querySelector(".name").textContent = order.date;
      clone.querySelector(".order_number").textContent = order.order_number;
      clone.querySelector(".price").textContent = order.total_price;
      clone.querySelector(".total_amount").textContent = order.total_price;
      order.restDbArray.forEach((beer) => {
        const clone_details = document.querySelector(".details_temp").content.cloneNode(true);
        clone_details.querySelector(".article").textContent = beer.name;
        clone_details.querySelector(".amount").textContent = beer.amount + " pcs.";
        clone_details.querySelector(".final_amount").textContent = beer.price + " DKK";
        clone.querySelector(".details").appendChild(clone_details);
      });
      clone.querySelector(".delete").addEventListener("click", function () {
        deleteIt(order._id);
      });
      document.querySelector(".receipts_container").appendChild(clone);
    }
  });
  document.querySelector(".log_in_container").classList.add("hide");
  document.querySelector(".account_container").classList.add("hide");
  document.querySelector(".receipts_wrapper").classList.remove("hide");
  document.querySelector(".main_content .login_heading").textContent = "RECEIPTS";
  document.querySelector(".close_receipts").addEventListener("click", function () {
    displayAccount();
  });
}

async function deleteIt(id) {
  console.log("delete");
  //elementet med det pågældende id (der er sendt med videre fra klik) slettes med det samme i DOM'en
  document.querySelector(`article[data-id="${id}"]`).remove();
  let response = await fetch(`${HTML.restDb}/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": HTML.apiKey,
      "cache-control": "no-cache",
    },
  });
  //Herefter slettes elementet i db
  HTML.data = await response.json();
}

async function getStatus(e) {
  e.preventDefault();
  const orderNumber = document.querySelector("#ordernum").value;
  let status;
  let workingTender;
  let tenderStatus;
  console.log("getStatus");
  //GET
  let response = await fetch(HTML.endpoint, {
    method: "get",
  });
  const herokuData = await response.json();
  console.log(herokuData);

  //gem resultatet in en const status
  herokuData.queue.forEach((orders) => {
    if (orderNumber == orders.id) {
      console.log("queue");
      status = "queue";
    }
  });
  herokuData.serving.forEach((order) => {
    if (orderNumber == order.id) {
      console.log("served");
      status = "served";
      herokuData.bartenders.forEach((bartender) => {
        if (orderNumber == bartender.servingCustomer) {
          workingTender = bartender.name;
          if (bartender.statusDetail == "pourBeer" || bartender.statusDetail == "reserveTap" || bartender.statusDetail == "startServing" || bartender.statusDetail == "releaseTap") {
            tenderStatus = "pouring";
          } else if (bartender.statusDetail == "receivePayment") {
            tenderStatus = "done";
          }
        }
      });
    }
  });
  document.querySelector(".check").classList.remove("disabled");
  displayStatus(status, workingTender, tenderStatus);
}
function displayStatus(status, workingTender, tenderStatus) {
  console.log("displayStatus");

  if (status == "queue") {
    console.log("still in queue");
    document.querySelector(".status_write").textContent = "Still in queue...";
  } else if (status == "served") {
    if (tenderStatus == "pouring") {
      document.querySelector(".status_write").textContent = "Being poured right now!";
      document.querySelector(".bartender_write").textContent = "Your bartender is " + workingTender;
    } else {
      document.querySelector(".status_write").textContent = "Ready for pick up!";
      document.querySelector(".bartender_write").textContent = "Served by " + workingTender;
    }

    console.log("being served");
  } else {
    document.querySelector(".status_write").textContent = "Has been picked up...";
    console.log("The order has been picked up or the order does not exist");
    document.querySelector(".bartender_write").textContent = "";
  }
}
