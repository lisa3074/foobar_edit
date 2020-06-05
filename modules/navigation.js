export function toggleMenu() {
  console.log("toggleMenu");
  document.querySelector(".arrow").addEventListener("click", function () {
    console.log("click");
    document.querySelector(".desk_nav").classList.toggle("smooth_out");
    document.querySelector(".desk_nav").classList.toggle("smooth_in");
  });
  links();
}
function links() {
  console.log("links");
  const menuIsOut = document.querySelector("nav").classList;
  document.querySelectorAll(".itm").forEach((itm) => {
    itm.addEventListener("click", function () {
      let site;
      console.log(menuIsOut);
      if (this == document.querySelector(".menu-home")) {
        site = "index.html";
      }
      if (this == document.querySelector(".menu-buy")) {
        site = "order.html";
      }
      if (this == document.querySelector(".menu-beer")) {
        site = "beer.html";
      }
      if (this == document.querySelector(".menu-win")) {
        site = "win.html";
      }
      if (this == document.querySelector(".menu-login")) {
        site = "login.html";
      }
      if (menuIsOut.value == "desk_nav smooth_in") {
        goToSite(site);
      } else {
        rightAway(site);
      }
    });
  });
}

function goToSite(link) {
  console.log("goToSite");
  shrink();
  setTimeout(() => {
    rightAway(link);
  }, 1000);
}

function rightAway(link) {
  console.log("rightAway");
  window.location.href = link;
}

function shrink() {
  console.log("shrink");
  document.querySelector(".desk_nav").classList.add("smooth_out");
  document.querySelector(".desk_nav").classList.remove("smooth_in");
}
