const config = window.REVIEW_PAGE_CONFIG;

const loginView = document.querySelector("#loginView");
const reviewView = document.querySelector("#reviewView");
const accessCode = document.querySelector("#accessCode");
const loginButton = document.querySelector("#loginButton");
const loginError = document.querySelector("#loginError");
const refreshButton = document.querySelector("#refreshButton");
const copyButton = document.querySelector("#copyButton");
const reviewText = document.querySelector("#reviewText");
const keywordList = document.querySelector("#keywordList");
const imageGrid = document.querySelector("#imageGrid");
const imageCount = document.querySelector("#imageCount");
const reviewLink = document.querySelector("#reviewLink");

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function allKeywords() {
  return Object.values(config.keywordGroups).flat();
}

function pickKeywords() {
  const count = Math.floor(Math.random() * 3) + 3;
  return shuffle([...new Set(allKeywords())]).slice(0, count);
}

function joinKeywords(keywords) {
  if (keywords.length <= 1) {
    return keywords[0] || "";
  }

  const head = keywords.slice(0, -1).join("，");
  return `${head}，而且${keywords[keywords.length - 1]}`;
}

function renderKeywords(keywords) {
  keywordList.innerHTML = "";
  keywords.forEach((keyword) => {
    const chip = document.createElement("span");
    chip.textContent = keyword;
    keywordList.appendChild(chip);
  });
}

function renderImages() {
  const sources = window.REVIEW_IMAGE_SOURCES || { environment: [], nails: [] };
  const pickedImages = [
    {
      title: "店面环境",
      src: sample(sources.environment)
    },
    {
      title: "美甲图片",
      src: sample(sources.nails)
    }
  ].filter((image) => image.src);

  imageGrid.innerHTML = "";
  imageCount.textContent = `${pickedImages.length} 张`;

  pickedImages.forEach((image) => {
    const card = document.createElement("article");
    card.className = "image-card";

    const img = document.createElement("img");
    img.alt = image.title;
    img.src = image.src;
    img.onerror = () => {
      card.innerHTML = `<div class="placeholder">${image.title}<br>请把图片放到 ${image.src.replace("./", "")}</div>`;
    };

    card.appendChild(img);
    imageGrid.appendChild(card);
  });
}

function refreshReview() {
  const keywords = pickKeywords();
  const template = sample(config.templates);
  let text = template.replace("{keywords}", joinKeywords(keywords));
  if (text.length < config.reviewLength.min) {
    text += "整体体验很顺心，做完之后也很喜欢。";
  }
  reviewText.textContent = text.slice(0, config.reviewLength.max);
  renderKeywords(keywords);
  renderImages();
}

function showReviewPage() {
  loginError.textContent = "";
  loginView.hidden = true;
  reviewView.hidden = false;
  refreshReview();
}

function enterPage() {
  if (accessCode.value.trim() !== config.accessCode) {
    loginError.textContent = "访问码不正确，请重新输入。";
    return;
  }

  showReviewPage();
}

loginButton.addEventListener("click", enterPage);
accessCode.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    enterPage();
  }
});

refreshButton.addEventListener("click", refreshReview);
copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(reviewText.textContent);
  copyButton.textContent = "已复制";
  window.setTimeout(() => {
    copyButton.textContent = "复制";
  }, 1200);
});

reviewLink.href = config.reviewUrl;

const params = new URLSearchParams(window.location.search);
const urlCode = params.get("code");

if (urlCode === config.accessCode) {
  showReviewPage();
}
