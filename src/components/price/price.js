const dateInputs = $(".price")
  .closest(".formBox__item")
  .find(".dateDropdown__input");
const clickArea = $(".price")
  .closest(".formBox__item")
  .find(".dateDropdown__click-area");

dateInputs.on("change paste keyup input", refreshCost);
clickArea.on("click", click);

function refreshCost(e) {
  console.log("refresh");
}

function click(e) {
  console.log("click");
}
