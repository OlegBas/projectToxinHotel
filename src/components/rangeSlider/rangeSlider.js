import $ from "jquery";
import "ion-rangeslider";
import "ion-rangeslider/css/ion.rangeSlider.min.css";

$(".rangeSlider__input").ionRangeSlider({
  step: 100,
  type: "double",
  skin: "round",
  hide_min_max: true,
  hide_from_to: true,
  onChange: updateValue,
});

function updateValue(data) {
  const valueArea = $(data.input)
    .closest(".rangeSlider")
    .find(".rangeSlider__caption");
  const unit = $(data.input).data("postfix");
  const newFrom = `${data.from
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;")}${unit}`;
  const newTo = `${data.to
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;")}${unit}`;
  valueArea.html(`${newFrom} - ${newTo}`);
}
