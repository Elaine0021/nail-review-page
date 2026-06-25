const config = window.REVIEW_PAGE_CONFIG;

const reviewView = document.querySelector("#reviewView");
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

function pickKeywords() {
  const count = Math.floor(Math.random() * 3) + 3;
  return shuffle([...new Set(config.keywords)]).slice(0, count);
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

    const caption = document.createElement("p");
    caption.className = "image-caption";
    caption.textContent = image.title === "店面环境" ? "环境照片" : "作品照片";

    card.appendChild(img);
    card.appendChild(caption);
    imageGrid.appendChild(card);
  });
}

function refreshReview() {
  const keywords = pickKeywords();
  const useLong = Math.random() < 0.7;
  const templates = useLong ? config.longTemplates : config.shortTemplates;
  const limits = useLong
    ? { min: config.reviewLength.longMin, max: config.reviewLength.longMax }
    : { min: config.reviewLength.shortMin, max: config.reviewLength.shortMax };
  let text = sample(templates).replace("{keywords}", joinKeywords(keywords));
  while (text.length < limits.min) {
    text += useLong ? "整体做下来很顺心，成品也越看越喜欢。" : "成品也很喜欢。";
  }
  reviewText.textContent = text.slice(0, limits.max);
  renderKeywords(keywords);
  renderImages();
}

refreshButton.addEventListener("click", refreshReview);
copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(reviewText.textContent);
  copyButton.textContent = "已复制";
  window.setTimeout(() => {
    copyButton.textContent = "复制";
  }, 1200);
});

reviewLink.href = config.reviewUrl;
refreshReview();
