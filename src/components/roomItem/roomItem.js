import "slick-carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

$(".roomItem__gallery").slick({
  dots: true,
  adaptiveHeight: true,
  nextArrow: getButton("next"),
  prevArrow: getButton("before"),
});

// // type = before | next
function getButton(type) {
  const icon = `<i class="material-icons">navigate_${type}</i>`;
  return `<button class="roomItem__galleryArrow roomItem__galleryArrow_${type}">${icon}</button>`;
}
