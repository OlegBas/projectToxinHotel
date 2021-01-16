$(".mobileMenu").on("click", toggleMenu);

function toggleMenu(e) {
  e.preventDefault();
  $(".mobileMenu__item", e.currentTarget).toggleClass("mobileMenu__item_open");
  $("body").toggleClass("blocked");
  $(e.currentTarget)
    .closest(".header")
    .find(".header__navigationWrapper")
    .toggleClass("header__navigationWrapper_visible");
}
