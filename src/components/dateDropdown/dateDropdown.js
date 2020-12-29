const $dropdowns = $(".dateDropdown"); //Выбираем все элементы .dateDropdown
//Добавляем $dropdowns в массив с помощью оператора расширения ...
//Для каждого $dropdowns  вызываем функцию dateDropdown и передаем туда элемент dropdown
[...$dropdowns].forEach((dropdown) => {
  dateDropdown(dropdown);
});

//Функция выполняет первичную настройку календаря
function dateDropdown(datepickerArea) {
  const actions = { close: "close", open: "open" };

  const $inputs = $(datepickerArea).find(".dateDropdown__input-wrapper");
  const $inputButtons = $(datepickerArea).find(".dateDropdown__button");

  const toggleDatepicker = (action) => {
    const $datepicker = $(datepickerArea).find(".calendar");
    if (action === actions.open) {
      //При нажатии на кнопку "Применить" закрываем календарь
      $(".justButton_primary[data-action=apply]").on("click", () => {
        toggleDatepicker(actions.close);
      });
      $datepicker.fadeIn(100);
      $(document).on("click", onOutsideCalendarClick);
    }
    if (action === actions.close) {
      $datepicker.fadeOut(100);
      $(document).off("click", onOutsideCalendarClick);
    }
  };

  const onOutsideCalendarClick = (e) => {
    console.log($(e.target).closest(".calendar").length);
  };

  //По умолчанию закрываем показ календаря
  toggleDatepicker(actions.close);

  //При клике на поле выбора даты
  $inputs.on("click", (e) => {
    e.preventDefault();
    //Получаем календарь
    const $datepicker = $(datepickerArea).find(".calendar");

    //Если календарь не найден или скрыт
    if (!$datepicker || $($datepicker).is(":hidden")) {
      //Показываем календарь
      toggleDatepicker(actions.open);
    }
  });
}
