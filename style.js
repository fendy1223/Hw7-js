const url =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json";

let data = [];

function init() {
  axios.get(url).then(function (response) {
    //console.log(response.data);
    data = response.data;
    renderC3(data);
    renderData(data);

  }).catch(function (error) {
    console.log("錯誤：" + error.message);
  });
}

function renderC3(data) {
  let totalObj = {};
  data.forEach(function (item) {
    if (totalObj[item.area] == undefined) {
      totalObj[item.area] = 1;
    } else {
      totalObj[item.area] += 1;
    }
  })

  let newData = Object.keys(totalObj).map(function (item) {
    return [item, totalObj[item]];
  });

  const chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: newData,
      type: 'donut',
      colors: {
        台北: "#26C0C7",
        台中: "#5151D3",
        高雄: "#E68618"
      }
    },
    size: {
      width: 200,
      height: 184
    },
    donut: {
      title: "套票地區比重",
      width: 10,
      label: {
        show: false
      }
    }
  });
}

function renderData(data) {
  const list = document.querySelector(".ticketCard-area");
  const searchResult = document.querySelector("#searchResult-text");
  const cantFindArea = document.querySelector(".cantFind-area");
  let str = "";
  let searchNum = 0;

  data.forEach((item) => {
    str += `<li class="ticketCard">
              <div class="ticketCard-img">
                <a href="#">
                  <img
                    src="${item.imgUrl}"
                    alt=""
                  />
                </a>
                <div class="ticketCard-region">${item.area}</div>
                <div class="ticketCard-rank">${item.rate}</div>
              </div>
              <div class="ticketCard-content">
                <div>
                  <h3>
                    <a href="#" class="ticketCard-name">${item.name}</a>
                  </h3>
                  <p class="ticketCard-description">${item.description}</p>
                </div>
                <div class="ticketCard-info">
                  <p class="ticketCard-num">
                    <span><i class="fas fa-exclamation-circle"></i></span>
                    剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                  </p>
                  <p class="ticketCard-price">
                    TWD <span id="ticketCard-price">$${item.price}</span>
                  </p>
                </div>
              </div>
            </li>`;

    searchNum++;
  });

  if (data.length > 0) {
    cantFindArea.style.display = 'none';
  } else {
    cantFindArea.style.display = 'block';
  }

  list.innerHTML = str;
  searchResult.innerHTML = `本次搜尋共 ${searchNum} 筆資料`;
}

init();


//搜尋
const regionSearch = document.querySelector(".regionSearch");
regionSearch.addEventListener("change", function (e) {
  let filterResult = [];
  data.forEach(function (item) {
    if (item.area === regionSearch.value) {
      filterResult.push(item);
    } else if (!regionSearch.value) {
      filterResult.push(item);
    }
  });

  renderData(filterResult);
});

//新增套票
const addTicket = document.querySelector(".addTicket-btn");
addTicket.addEventListener("click", function (e) {
  const ticketName = document.querySelector("#ticketName");
  const ticketImgUrl = document.querySelector("#ticketImgUrl");
  const ticketRegion = document.querySelector("#ticketRegion");
  const ticketPrice = document.querySelector("#ticketPrice");
  const ticketNum = document.querySelector("#ticketNum");
  const ticketRate = document.querySelector("#ticketRate");
  const ticketDescription = document.querySelector("#ticketDescription");

  data.push({
    id: data.length,
    name: ticketName.value,
    imgUrl: ticketImgUrl.value,
    area: ticketRegion.value,
    description: ticketDescription.value,
    group: ticketNum.value,
    price: ticketPrice.value,
    rate: ticketRate.value
  });

  renderC3(data);
  renderData(data);

  document.querySelector(".addTicket-form").reset();
});

