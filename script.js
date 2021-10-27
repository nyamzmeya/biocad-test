let search = document.getElementById("search");

const specifications = {
  id: "id",
  type: "Тип оборудования",
  status: "Статус",
  producer: "Ohaus",
  model: "Модель",
  repair: "Ответственное подразделение (ремонт)",
  division: "Эксплуатирующее подразделение",
  mol: "МОЛ",
  territory: "Территория",
  series: "Серийный номер",
  guid: "GUID",
  Bims_ID: "Bims ID",
  Tam: "Tam",
};

const inventories = [
  {
    [specifications.id]: "1",
    [specifications.type]: "Весы",
    [specifications.status]: "Готов к работе",
    [specifications.producer]: "Ohaus",
    [specifications.model]: "AX-123",
    [specifications.repair]: "Группа обслуживания лабораторного оборудования",
    [specifications.division]: "Химико-аналитическая лаборатория 2.0",
    [specifications.mol]: "Иванов Иван Иванович",
    [specifications.territory]: "г. Санкт-Петербург (Нойдорф)",
    [specifications.series]: "B715976163",
    [specifications.guid]: "508b2a71-662e-4983-ae0c-3cb0c1cd21c5",
    [specifications.Bims_ID]: "49db8db1-585f-4b9e-bbf0-8a59698edc8b",
    [specifications.Tam]: "A-001234",
  },
];

search.addEventListener("click", () => {
  let input = document.getElementById("inventory").value;

  let items = document.getElementById("items");

  for (let i = 0; i < items.children.length; i++) {
    items.children[i].style.display = "none";
  }

  for (inventory of inventories) {
    if (
      inventory[specifications.guid].toLowerCase() == input.toLowerCase() ||
      inventory[specifications.Tam].toLowerCase() == input.toLowerCase() ||
      inventory[specifications.Bims_ID].toLowerCase() == input.toLowerCase()
    ) {
      document.getElementById(inventory.id).style.display = "flex";
    } else {
      document.getElementById("no").style.display = "block";
      document.getElementById("info").style.display = "none";
      document.getElementById("report").style.display = "none";
    }
  }
});

let item = document.getElementsByClassName("item");

function addInfoById(inventory) {
  let fragment = document.getElementById("info");
  fragment.innerHTML = "";
  for (const [key, value] of Object.entries(inventory)) {
    let div = document.createElement("div");
    div.innerHTML = `<span>${key}</span>: ${value}`;
    fragment.append(div);
  }
  fragment.style.display = "block";
  document.getElementById("report").style.display = "block";
}

let report_item;

for (let i = 0; i < item.length; i++) {
  item[i].addEventListener("click", () => {
    let id = item[i].id;

    for (inventory of inventories) {
      if (inventory[specifications.id] == id) {
        report_item = inventory[specifications.Tam];
        addInfoById(inventory);
      }
    }
  });
}

$("#datetimepicker").datetimepicker({ format: "d.m.y H:i" });

let generate = document.getElementById("generate");

generate.addEventListener("click", () => {
  document.getElementById("modalLabel").innerHTML = `Report for ${report_item}`;
});

let save = document.getElementById("save");

let report_specifictions = {
  report_item: "Название изделия",
  period: "Период",
  type: "Тип",
  data: "Data",
  slope: "Slope, % Norm 95-105",
  offset: "Offset, mV Norm ±(0-20)",
  user: "User",
};

function saveReport(report) {
  let reports = document.getElementById(report[report_specifictions.type]);

  let report_body = document.createElement("div");
  report_body.className = "report_body";
  let reports_info = document.createElement("reports_info");
  reports_info.className = "reports_info";
  let img1 = "img/ok.png";
  let img2 = "img/ok.png";

  if (
    report[report_specifictions.slope] < 95 ||
    report[report_specifictions.slope] > 105
  ) {
    img1 = "img/bad.png";
  }

  if (
    report[report_specifictions.offset] < 0 ||
    report[report_specifictions.offset] > 20
  ) {
    img2 = "img/bad.png";
  }
  reports_info.setAttribute("data-html", "true");
  reports_info.setAttribute(
    "data-tooltip",
    `Inventory: ${report[report_specifictions.report_item]}
  Period: ${report[report_specifictions.period]}
  `
  );
  reports_info.innerHTML = `
  <div>${report[report_specifictions.data]}</div>
            <div>
              <span> В1: № 2000460789536: pH 1.09 </span>
              <span>В2: № 2000460789536: pH 2.00 </span>
              <span> В3: № 2000460789536: pH 4.01 </span>
              <span> В4: № 2000460789536: pH 7.00 </span>
              <span> В5: № 2000460789536: pH 9.21 </span>
            </div>

            <div>
            <div>${report[report_specifictions.slope]}</div>
            <img src='${img1}' />
            </div>
            <div>${report[report_specifictions.offset]}
            <div>${report[report_specifictions.offset]}</div>
            <img src='${img2}' />
            </div>
            <div>${report[report_specifictions.user]}</div>
  `;
  let hr = document.createElement("hr");
  report_body.appendChild(reports_info);
  report_body.appendChild(hr);
  console.log(report_body);
  reports.appendChild(report_body);
  reports.style.display = "block";
}

save.addEventListener("click", () => {
  let report = {
    [report_specifictions.report_item]: report_item,
    [report_specifictions.period]: $("input[name=periods]").val() || "1 month",
    [report_specifictions.type]: $("input[name=type]:checked").val(),
    [report_specifictions.data]: $("#datetimepicker").val(),
    [report_specifictions.slope]: $("#slope").val(),
    [report_specifictions.offset]: $("#offset").val(),
    [report_specifictions.user]: $("#name").val(),
  };

  let valid = true;

  Object.values(report).forEach((val) => {
    if (!val) {
      valid = false;
    }
  });

  if (valid) {
    $(".alert").hide()
    saveReport(report);
    $('#modal').modal('hide');
  } else {
    $(".alert").show()
  }
});
