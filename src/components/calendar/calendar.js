import "air-datepicker";
import "air-datepicker/dist/css/datepicker.min.css";
// import '../simple-button/simple-button.scss'; // - если на странице не будет кнопок то и стили для кнопок календаря не подтянутся

const datepickers = $(".calendar");
[...datepickers].forEach((datepicker) => {
  initCalendar(datepicker);
});

function initCalendar(datepickerArea) {
  const monthes = [
    "янв",
    "фев",
    "мар",
    "апр",
    "май",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ];

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(minDate.getFullYear() + 1);

  //Чтобы сделать невозмножным выбрать конкретные дни недели, можно воспользоваться методом onRenderCell
  const onRenderCell = (date, cellType) => {
    if (cellType == "day") {
      const currentDate = date.getDate();
      //Добавляем класс datepicker--cell-circle, чтобы выделить выбранный день
      return {
        html: `<span class="datepicker--cell-circle">${currentDate}</span>`,
      };
    }
  };

  //Функция возвращает дату в формате ДД.ММ.ГГГГ
  const parseDate = (date) => {
    const YYYY = date.getFullYear();
    const MM =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const DD = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${DD}.${MM}.${YYYY}`;
  };

  const parsePeriod = (dates) => {
    const period = dates.map(
      (date) => `${date.getDate()} ${monthes[date.getMonth()]}`
    );
    return period.join(" – ");
  };

  const handleApplyDates = (dp) => {
    //получаем количество инпутов
    const dpInputs = dp.$datepicker
      .closest(".date-dropdown")
      .find(".date-dropdown__input");
    //Если число инпутов = 2, перебираем массив выбранных  дат
    if (dpInputs.length === 2) {
      //Устанавливаем выбранные пользователем даты в поля инпутов
      dp.selectedDates.forEach((date, index) => {
        const dateString = parseDate(date);
        dpInputs.eq(index).val(dateString);
      });
    } else if (dpInputs.length === 1) {
      const period = parsePeriod(dp.selectedDates);
      dpInputs.eq(0).val(period);
    }
  };

  const toggleButtonsState = (dp) => {
    const applyButton = dp.$datepicker.find(
      '.simple-button--primary[data-action="apply"]'
    );
    const clearButton = dp.$datepicker.find(
      '.datepicker--button[data-action="clear"]'
    );

    if (dp.selectedDates.length === 2) {
      applyButton.prop("disabled", false);
    } else {
      applyButton.prop("disabled", true);
    }

    if (dp.selectedDates.length === 0) {
      clearButton.addClass("simple-button--disabled");
    } else {
      clearButton.removeClass("simple-button--disabled");
    }
  };
  // Функция обратного вызова при выборе даты.
  const onSelect = (formattedDate, date, dp) => {
    toggleButtonsState(dp);
  };

  const getDatesPeriod = (date) => {
    const period = date.split(" – ");
    const dates = period.map((datePeriod) => {
      const [day, month] = datePeriod.split(" ");
      const monthNumber = monthes.findIndex((monthWord) => month === monthWord);
      const currentDate = new Date();
      const selectDate = new Date(currentDate.getFullYear(), monthNumber, day);
      // чтобы если текущий месяц декабрь, была возможность вырать даты следующего года
      if (selectDate < currentDate) {
        selectDate.setFullYear(currentDate.getFullYear() + 1);
      }
      return selectDate;
    });
    return dates;
  };

  const getDate = (dateString) => {
    const [DD, MM, YYYY] = dateString.split(".");
    return new Date(`${YYYY}-${MM}-${DD}`);
  };

  const readInputs = (dp) => {
    const dpInputs = dp.$datepicker
      .closest(".date-dropdown")
      .find(".date-dropdown__input");
    const arrivalDate = dpInputs.eq(0).val();
    const departureDate = dpInputs.eq(1).val();
    if (arrivalDate || departureDate) {
      dpInputs.length === 2
        ? dp.selectDate([getDate(arrivalDate), getDate(departureDate)])
        : dp.selectDate(getDatesPeriod(arrivalDate));
    }
  };

  const addApplyButton = (dp) => {
    if (
      !$(datepickerArea)
        .find('.simple-button--primary[data-action="apply"]')
        .html()
    ) {
      //selectedDates - массив выбранных дат
      const isDisabledApplyButton = dp.selectedDates.length < 2;
      const isDisabledClearButton = dp.selectedDates.length === 0;

      const clearButton = $(datepickerArea).find(
        '.datepicker--button[data-action="clear"]'
      );
      clearButton.addClass("simple-button simple-button--secondary");

      //Добавляем класс к кнопке очистки в зависимости от ее настройки
      if (isDisabledClearButton) {
        clearButton.addClass("simple-button--disabled");
      } else {
        clearButton.removeClass("simple-button--disabled");
      }

      const applyButton = `<button class="simple-button simple-button--primary" data-action="apply" type="button" disabled=${isDisabledApplyButton}>Применить</button>`;
      //Добавляем кнопку "Применить"
      $(datepickerArea).find(".datepicker--buttons").append(applyButton);

      $(datepickerArea)
        .find('.simple-button--primary[data-action="apply"]')
        .on("click", (event) => {
          handleApplyDates(dp); //Вешаем обработчик клика на кнопку
        });
    }
  };

  //Инициализация datepicker
  const datepicker = $(datepickerArea).datepicker({
    view: "days", //Начальный вид календаря -days- отображение дней месяца
    range: true, //Включаем режим выбора диапазона дат
    //Ограничение выбора дат
    minDate,
    maxDate,
    //Контент кнопки 'предыдущий(следующий) месяц|год|декада'.
    prevHtml: '<span class="material-icons">arrow_back</span>',
    nextHtml: '<span class="material-icons">arrow_forward</span>',
    navTitles: { days: "MM yyyy" },
    onRenderCell, //Функция обратного вызова при отрисовке ячейки календаря.
    inline: true, //Постоянно видимый календарь
    onSelect, //Функция обратного вызова при выборе даты.
    clearButton: true, //Если true, то будет отображена кнопка "Очистить".
  });

  addApplyButton(datepicker.data("datepicker"));
  readInputs(datepicker.data("datepicker"));
}
