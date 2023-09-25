const searchBtn = document.querySelector(".searchBtn");
const search = document.querySelector(".search");
const mainResultEl = document.querySelector(".main-result");

let dataDictionary;
// let errorMessage = "";
async function fetchData(word) {
  const apiDictionary = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  try {
    const response = await fetch(apiDictionary);
    dataDictionary = await response.json();
    if (!response.ok) throw dataDictionary.message;
    return dataDictionary;
  } catch (error) {
    console.log(error);
    renderError(error);
  }
}

const debounce = (searchFunc) => {
  let timeoutId;

  return (...searchValue) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      searchFunc.apply(null, searchValue);
    }, 500);
  };
};

const renderError = (error) => {
  mainResultEl.innerHTML = "";
  const message = document.createElement("h2");
  message.classList.add("error");
  message.innerHTML = error;
  mainResultEl.append(message);
};

const searchWord = async (e) => {
  if (!e.target.value) return;
  fetchData(e.target.value);

  searchBtn.addEventListener("click", renderMeaning);

  document.body.addEventListener("keyup", (e) => {
    if (e.key === "Enter") renderMeaning();
  });
};

search.addEventListener("input", debounce(searchWord));

const renderMeaning = () => {
  mainResultEl.innerHTML = "";
  const searchWordEl = document.createElement("div");
  const wordEl = document.createElement("div");
  const titleEl = document.createElement("h1");
  const phonetics = document.createElement("h3");
  const playBtn = document.createElement("button");

  searchWordEl.classList.add("searchWord");
  playBtn.classList.add("playBtn");
  const copyWord = dataDictionary[0].word.split("");
  const convertToCapitalLetter = copyWord[0].toUpperCase();
  const finalResult = convertToCapitalLetter + copyWord.splice(1).join("");

  titleEl.innerText = finalResult;
  phonetics.innerText = dataDictionary[0].phonetic;
  playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;

  wordEl.append(titleEl, phonetics);
  searchWordEl.append(wordEl, playBtn);
  mainResultEl.append(searchWordEl);

  dataDictionary[0].meanings.forEach((meaning) => {
    const meaningEl = document.createElement("div");
    meaningEl.classList.add("meaning");
    const definitions = meaning.definitions
      .map((definition) => {
        const definitionTemplate = `
        <p class="definition"><span class="dot">&#8226</span>${
          definition.definition
        }</p>
        <h6 class="example">${
          definition.example === undefined ? "" : `"${definition.example}"`
        }</h6>
      `;
        return definitionTemplate;
      })
      .join("");

    const synonyms = meaning.synonyms
      .map((synonym) => {
        const synonymsTemplate = `
          <span class="synonym">${synonym}</span>
        `;
        return synonymsTemplate;
      })
      .join("");
    const template = `
      
        <p class="partOfSpeech">${meaning.partOfSpeech}</p>
        <h2 class="meaningText">Meaning</h2>
        ${definitions}
        ${
          meaning.synonyms.length === 0
            ? ""
            : `<div class="synonymHolder">
        <p class="synonymTitle">Synonyms</p>
        ${synonyms}
      </div>`
        }
        
      
      `;
    meaningEl.innerHTML = template;
    mainResultEl.append(meaningEl);
  });
};

const checkBtnEl = document.querySelector(".darkModeBtn");
const themeSwitchEl = document.querySelector(".theme-switch");
const moonEl = document.querySelector(".sun");

const isChecked = localStorage.getItem("data");
const isSunOrMoon = localStorage.getItem("sun");

if (isSunOrMoon === "fa-moon") moonEl.classList.add("fa-moon");
if (isSunOrMoon === "fa-sun") moonEl.classList.add("fa-sun");

checkBtnEl.addEventListener("click", () => {
  localStorage.setItem("data", checkBtnEl.checked);
  if (checkBtnEl.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    localStorage.setItem("sun", "fa-moon");
    moonEl.classList.add("fa-moon");
    moonEl.classList.remove("fa-sun");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    localStorage.setItem("sun", "fa-sun");
    moonEl.classList.add("fa-sun");
    moonEl.classList.remove("fa-moon");
  }
});

const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    checkBtnEl.checked = true;
  }
}
