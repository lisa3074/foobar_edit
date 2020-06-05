export function card() {
  let $ = require("jquery");
  window.jQuery = $;
  let card = require("card");

  card = new Card({
    form: "form",
    container: "article.card_ani",

    formSelectors: {
      numberInput: "input#number",
      expiryInput: "input#month, input#year",
      cvcInput: "input#secure",
      nameInput: "input#full_name",
    },

    formatting: true,

    placeholders: {
      number: "4572 5678 9012 3456",
      name: "JOHN SMITH",
      expiry: "xx/xx",
      cvc: "999",
    },
  });
  var setCardTypeOrig = Card.prototype.handlers.setCardType;

  Card.prototype.handlers.setCardType = function ($el, e) {
    var allowedCards = ["mastercard", "visa", "dankort", "discover", "jcb", "visaelectron", "elo", "amex"];
    if (allowedCards.indexOf(e.data) < 0) e.data = "unknown";
    setCardTypeOrig.call(this, $el, e);
  };
}
