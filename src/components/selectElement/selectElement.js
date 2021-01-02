let dataForSelectElement = require("./data");

const $selectElements = $(".superSelectElement");
[...$selectElements].forEach((selectEl) => {
  selectElement(selectEl);
});

function selectElement(selectEl) {
  $(selectEl).on("click", toggle);

  let items = [];
  let initialItems = [];
  let countPeoples = 0;
  let inputEl = $(".formElement__input", selectEl);
  let dataSetName = $(selectEl).attr("data-set-name");
  switch (dataSetName) {
    case "itemsFull":
      var data = dataForSelectElement.itemsFull;
      countPeoples = 4;
      break;
    case "itemsEmpty":
      var data = dataForSelectElement.itemsEmpty;
      countPeoples = 0;
      break;
    case "itemsDefault":
      var data = dataForSelectElement.itemsDefault;
      countPeoples = 3;
      break;
    default:
      var data = dataForSelectElement.roomItems;
      break;
  }

  addElements(data, selectEl);

  addEventsOnButton($(selectEl));

  function addElements(data, selectEl) {
    for (let index = 0; index < data.length; index++) {
      let dataCountWord =
        data[index].typeOfData != undefined
          ? `data-countword=${data[index].typeOfData}`
          : "";
      let temp = `<li class="selectElement__item" ${dataCountWord}  data-index="${index}">
      <span class="selectElement__item-word">${data[index].title}</span>
      <div class="selectElement__item-controls">
        <button class="selectElement__item-button" type="button" data-action="desc">-</button>
        <span class="selectElement__item-count">${data[index].count}</span>
        <button class="selectElement__item-button" type="button" data-action="asc">+</button>
      </div>
    </li>`;
      $(".selectElement__items-list", selectEl).append(temp);
    }
    // $(data).each((key, data) => {
    //   console.log(key);
    //   console.log(data[key]);
    // });
  }

  function toggle(e) {
    if ($(e.target).closest(".selectElement")) {
      if (
        !$(e.target)
          .closest(".selectElement")
          .hasClass("selectElement_expanded")
      ) {
        $(e.target)
          .closest(".selectElement")
          .addClass("selectElement_expanded");
      } else {
        let classList = $(e.target).attr("class");
        if (
          classList == "material-icons" ||
          classList == "formElement__button" ||
          classList == "justButton justButton_primary"
        ) {
          $(document).off("click", toggle);
          $(e.currentTarget).removeClass("selectElement_expanded");
        }
      }
    }
  }

  function addEventsOnButton(selectEl) {
    $("body").on("click", ".selectElement__item-button", handleChangeCount);
    $(selectEl).on(
      "click",
      ".justButton[data-action='clear-select']",
      handleClearVals
    );
    $("body").on(
      "click",
      ".justButton[data-action='apply-select']",
      handleApplyVals
    );

    verifyButtons($(".selectElement__items", selectEl), items);

    if (initialItems.length) {
      items = initialItems;
      verifyButtons($(".selectElement__items", selectEl), items);
    } else {
      initVals(selectEl);
    }
  }

  function initVals(selectEl) {
    const liElements = [...$(".selectElement__item", $(selectEl))];
    liElements.forEach((li) => {
      const itemData = {};

      itemData.title = $(".selectElement__item-word", $(li)).text();
      itemData.count = Number($(".selectElement__item-count", $(li)).text());
      itemData.typeOfData = $(li).attr("data-countword") || itemData.title;
      items.push(itemData);
    });
    initialItems = items;
  }

  function handleChangeCount(e) {
    const liElement = $(e.currentTarget).closest(".selectElement__item");
    const liIndex = liElement.attr("data-index");
    const countType = $(e.currentTarget).attr("data-action"); // asc | desc
    if (countType === "asc") {
      items[liIndex].count = items[liIndex].count + 1;
      countPeoples += 1;
    } else {
      items[liIndex].count = items[liIndex].count - 1;
      countPeoples -= 1;
    }

    updateItemCount(liElement, items[liIndex].count);

    if (countPeoples > 0) verifyButtons($(e.currentTarget), items);
  }

  function verifyButtons(el, itemsData) {
    const clearButton = $(el)
      .closest(".selectElement__items")
      .find('.justButton[data-action="clear-select"]')
      .parent();

    const applyButton = $(el)
      .closest(".selectElement__items")
      .find('.justButton[data-action="apply-select"]')
      .parent();
    console.log(countPeoples);
    if (countPeoples === 0) {
      clearButton.addClass("selectElement__footer-button_hide");
      applyButton.find("button").attr("disabled", false);
    } else {
      clearButton.removeClass("selectElement__footer-button_hide");
      applyButton.removeClass("selectElement__footer-button_hide");
      applyButton.find("button").attr("disabled", false);
    }
  }

  function updateItemCount(liEl, value) {
    const $buttonDesc = $(
      '.selectElement__item-button[data-action="desc"]',
      $(liEl)
    );
    const $buttonAsc = $(
      '.selectElement__item-button[data-action="asc"]',
      $(liEl)
    );
    if (value === 0) {
      $buttonDesc.prop("disabled", true);
      $buttonAsc.prop("disabled", false);
    } else if (value > 0 && value < 10) {
      $buttonDesc.prop("disabled", false);
      $buttonAsc.prop("disabled", false);
    } else if (value >= 10) {
      $buttonDesc.prop("disabled", false);
      $buttonAsc.prop("disabled", true);
    }

    $(".selectElement__item-count", $(liEl)).text(value);
  }

  function handleClearVals(e) {
    const $liElements = $(e.currentTarget)
      .closest(".selectElement__items")
      .find(".selectElement__item");

    items.forEach((dataItem, index) => {
      dataItem.count = 0;
      updateItemCount($($liElements[index]), dataItem.count);
    });

    $(e.currentTarget)
      .closest(".selectElement__items")
      .prev()
      .find(".formElement__input")
      .val("Сколько гостей");

    countPeoples = 0;
    verifyButtons($(e.currentTarget), items);
  }

  function handleApplyVals(e) {
    console.log(3);
    const countData = getCountData(items);
    const countValue = getCountString(countData);
    $(e.target)
      .closest(".selectElement")
      .find(".formElement__input")
      .val(countValue);
    initialItems = items;
  }

  const countData = getCountData(items);
  const countValue = getCountString(countData);
  $(selectEl).find(".formElement__input").val(countValue);

  function getCountData(items) {
    const countData = [
      // example: {countWord: 'Гости', count: 5}
    ];
    items.forEach((item) => {
      const sameCountWordIndex = countData.findIndex(
        (data) => data.typeOfData === item.typeOfData
      );
      if (sameCountWordIndex !== -1) {
        countData[sameCountWordIndex].count += item.count;
      } else {
        const dataItem = {
          count: item.count,
          typeOfData: item.typeOfData,
        };
        countData.push(dataItem);
      }
    });
    return countData;
  }

  function getCountString(countData) {
    const filteredCountData = countData.filter(
      (countItem) => countItem.count !== 0
    );

    const value = filteredCountData.reduce((string, countItem, index) => {
      const declOfCount = transformWord(
        countItem.count,
        findInArray(countItem.typeOfData)
      );

      const stringOfCount = `${countItem.count} ${declOfCount}`;
      return index === filteredCountData.length - 1
        ? `${string}${stringOfCount}`
        : `${string}${stringOfCount}, `;
    }, "");
    return value.toLowerCase();
  }

  function transformWord(n, words) {
    return words[
      n % 10 === 1 && n % 100 !== 11
        ? 0
        : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
        ? 1
        : 2
    ];
  }

  function findInArray(word) {
    const dictionary = {
      Гости: ["Гость", "Гостя", "Гостей"],
      Младенцы: ["Младенец", "Младенца", "Младенцев"],
      Спальни: ["Спальня", "Спальни", "Спален"],
      Кровати: ["Кровать", "Кровати", "Кроватей"],
      "Ванные комнаты": ["Ванная комната", "Ванные комнаты", "Ванных комнат"],
    };
    return dictionary[word];
  }
}
