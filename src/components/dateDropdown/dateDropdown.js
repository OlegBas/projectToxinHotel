let isShowCalendar = false;
const $dropdowns = $(".jsDateDropdown"); //Выбираем все элементы .js-dateDropdown
//Добавляем $dropdowns в массив с помощью оператора расширения ...
//Для каждого $dropdowns  вызываем функцию initCalendarTogglerи передаем туда элемент dropdown
[...$dropdowns].forEach((dropdown) => {
  initCalendarToggler(dropdown);
});

//Функция выполняет первичную настройку календаря
function initCalendarToggler(datepickerArea) {
  const actions = { close: "close", open: "open" };

  const $inputs = $(datepickerArea).find(".dateDropdown__input-wrapper");
  const $inputButtons = $(datepickerArea).find(".dateDropdown__button");

  //Подключаем к кнопке обработчик события нажатия на клавишу
  $(document).on("keydown", (e) => {
    //Если нажата клавиша с кодом 27 , то
    // Переключаем состояние, вызывая функцию toggleDatepicker
    // 27  код - Esc
    if (e.keyCode === 27) {
      toggleDatepicker(actions.close);
    }
  });

  const toggleDatepicker = (action) => {
    const $datepicker = $(datepickerArea).find(".calendar");
    if (action === actions.open) {
      $datepicker.fadeIn(100);
      $(document).on("click", onOutsideCalendarClick);
    }
    if (action === actions.close) {
      $datepicker.fadeOut(100);
      $(document).off("click", onOutsideCalendarClick);
    }
  };

  const onOutsideCalendarClick = (e) => {
    // если closest('.dateDropdown) то календарь закрывается по клику на данные элементы
    // Проверяем содержит ли элемент, по которому кликнули один из элементов, клик по которым
    //не должен закрывать календарь
    const isDatepickerClick = $(e.target).closest(".dateDropdown__datepicker")
      .length;
    const isDatepickerInputClick = $(e.target).closest(
      ".dateDropdown__input-wrapper"
    ).length;
    const isDatepickerNav = $(e.target).closest(".datepicker--nav").length;
    const isDatepickerNavAction = $(e.target).closest(".datepicker--nav-action")
      .length;
    const isDatepickerDays = $(e.target).closest(".datepicker--cell").length;
    const isDatepickerArea =
      isDatepickerClick ||
      isDatepickerInputClick ||
      isDatepickerNav ||
      isDatepickerDays ||
      isDatepickerNavAction;

    //Если клик произошел по  другим элементами страницы, то isDatepickerArea = 0

    if (!isDatepickerArea) {
      toggleDatepicker(actions.close);
    }
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

  //При нажатии на кнопку "Применить" закрываем календарь
  $(datepickerArea)
    .find('.simple-button--primary[data-action="apply"]')
    .on("click", () => {
      toggleDatepicker(actions.close);
    });
}
