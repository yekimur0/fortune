// надписи и цвета на секторах
const prizes = [
  { text: "Скидка 10%", color: "#FFD130", win: true },
  { text: "Дизайн в подарок", color: "#F5F5F5", win: true },
  { text: "Второй сайт бесплатно", color: "#FFD130", win: true },
  { text: "Скидка 50%", color: "#F5F5F5", win: false },
  { text: "Блог в подарок", color: "#FFD130", win: false },
  { text: "Скидок нет", color: "#F5F5F5", win: false },
  { text: "Таргет в подарок", color: "#FFD130", win: false },
  { text: "Скидка 30% на всё", color: "#F5F5F5", win: false },
  { text: "Таргет в подарок", color: "#FFD130", win: false },
  { text: "Скидка 30% на всё", color: "#F5F5F5", win: false }
];

// создаём переменные для быстрого доступа ко всем объектам на странице
const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");

// на сколько секторов нарезаем круг
const prizeSlice = 360 / prizes.length;
// на какое расстояние смещаем сектора друг относительно друга
const prizeOffset = Math.floor(180 / prizes.length);
// CSS-классы для стилей
const spinClass = "is-spinning";
const selectedClass = "selected";
const spinnerStyles = window.getComputedStyle(spinner);

let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let prizeNodes;

// Фильтруем выигрышные призы
const winPrizes = prizes.filter(prize => prize.win);

// расставляем текст по секторам
const createPrizeNodes = () => {
  prizes.forEach(({ text, color }, i) => {
    const rotation = ((prizeSlice * i) * -1) - prizeOffset;
    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize" style="--rotate: ${rotation}deg">
        <div class="text">${text}
          <span class="text-more">Доп текст</span>
        </div>
      </li>`
    );
  });
};

// рисуем разноцветные секторы
const createConicGradient = () => {
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from -90deg,
      ${prizes
        .map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`)
        .reverse()
      }
    );`
  );
};

// Подготовка колеса
const setupWheel = () => {
  createConicGradient();
  createPrizeNodes();
  prizeNodes = wheel.querySelectorAll(".prize");
};

// Выбор случайного выигрышного сектора
const getWinningPrize = () => {
  const index = Math.floor(Math.random() * winPrizes.length);
  return prizes.indexOf(winPrizes[index]);
};

// Плавное вращение и остановка на выигрышном секторе
const spinWheel = () => {
  const selectedPrizeIndex = getWinningPrize();
  let targetRotation = (selectedPrizeIndex * prizeSlice) + prizeOffset;

  // Добавляем случайные обороты для анимации
  const spinInertia = spinertia(5, 10);
  const totalRotation = targetRotation + (360 * spinInertia);

  rotation = totalRotation;
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", totalRotation);

  runTickerAnimation();
};

// Запуск анимации язычка
const runTickerAnimation = () => {
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  let rad = Math.atan2(b, a);
  if (rad < 0) rad += (2 * Math.PI);

  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.style.animation = "none";
    setTimeout(() => ticker.style.animation = null, 10);
    currentSlice = slice;
  }
  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

// Завершение вращения
const endSpin = () => {
  cancelAnimationFrame(tickerAnim);
  rotation %= 360;
  const selected = Math.floor(rotation / prizeSlice);
  prizeNodes[selected].classList.add(selectedClass);
  wheel.classList.remove(spinClass);
  spinner.style.setProperty("--rotate", rotation);
};

// Слушатели событий
wheel.addEventListener("click", () => {
  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  spinWheel();
});

spinner.addEventListener("transitionend", endSpin);

// Запуск
setupWheel();

// Генерация случайных оборотов
const spinertia = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
