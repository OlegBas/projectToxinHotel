import "ion-rangeslider";
import "ion-rangeslider/css/ion.rangeSlider.min.css";

$(".rangeSlider__input").ionRangeSlider({
  step: 150,
  type: "double",
  hide_min_max: true,
  hide_from_to: true,
  onChange: updateValue,
});

function updateValue(data) {
  const valueArea = $(data.input)
    .closest(".rangeSlider")
    .find(".rangeSlider__caption");

  valueArea.html(`${data.from}Р - ${data.to}Р`);
}
