let dataArr = [];

// GOAL : set을 하면 리스트를 리렌더링하고 싶다.
// 이 때, react의 state를 안쓰고, Proxy를 이용하고 싶다.

const rerenderFunction = () => {
  const ulElement = document.getElementById("nameUl");
  while (ulElement.firstChild) {
    ulElement.removeChild(ulElement.lastChild);
  }
  // 먼저 전부다 날리고 -- (1)
  const fragment = new DocumentFragment();
  proxyArr.forEach((el) => {
    const liElement = document.createElement("li");
    liElement.textContent = el;
    fragment.append(liElement);
  });
  // Proxy arr를 통해 li & fragment를 구성하고 -- (2)
  ulElement.append(fragment);
  // append 한다 -- (3)
  const spanElement = document.getElementById("numberSpan");
  spanElement.textContent = proxyArr.length;
  // 마지막으로 총원의 수를 spanElement에 textContent로 심어준다. -- (4)
};

let proxyArr = new Proxy(dataArr, {
  get(target, key) {
    return target[key];
  },
  set(target, key, value) {
    if (typeof value === "string") {
      target[key] = value;
      return true;
    } else if (key === "length") {
      rerenderFunction();
      console.log("it's rerendered");
      return true;
    } else {
      return false;
    }
  },
});

// 이 때, 배열의 push를 쓰면 setter가 두번 호출된다.
// https://stackoverflow.com/questions/71188314/set-trap-execute-for-two-times-js-proxy
// target=[], prop=0, val=Manuel: Adds a new value to an index
// target=["Manuel"], prop=length, val=1: Updates length of array

rerenderFunction();
const inputElement = document.getElementById("nameInput");
const btnElement = document.getElementById("nameBtn");
btnElement.addEventListener("click", function () {
  proxyArr.push(`VIP_${inputElement.value}`);
});

const normalInputElement = document.getElementById("normalNameInput");
const normalBtnElement = document.getElementById("normalNameBtn");
normalBtnElement.addEventListener("click", function () {
  proxyArr.push(normalInputElement.value);
});

// proxy를 안써도 구현할 수 있지만, proxy를 써놓으면
// 위에처럼 vip인 경우, normal인 경우 모두 하나의 object(proxy)에 그냥 세팅해주듯이 해도
// 자연스럽게 내용이 반영이 된다는 편리함?이 있는 것 같다.
// 물론 분기 처리를 하면 똑같이 proxy 없이 구현할 수 있지만
