const WORDS = {
  base: [
    {
      word: "book",
      translation: "книжка",
    },
    {
      word: "tree",
      translation: "дерево",
    },
    {
      word: "window",
      translation: "вікно",
    },
    {
      word: "image",
      translation: "зображення",
    },
    {
      word: "black",
      translation: "чорний",
    },
    {
      word: "time",
      translation: "час",
    },
    {
      word: "red",
      translation: "червоний",
    },
    {
      word: "apple",
      translation: "яблуко",
    },
    {
      word: "keyboard",
      translation: "клавіатура",
    },
    {
      word: "word",
      translation: "слово",
    },
  ],
  medium: [
    {
      word: "journey",
      translation: "подорож",
    },
    {
      word: "knowledge",
      translation: "знання",
    },
    {
      word: "environment",
      translation: "навколишнє середовище",
    },
    {
      word: "decision",
      translation: "рішення",
    },
    {
      word: "experience",
      translation: "досвід",
    },
    {
      word: "neighbor",
      translation: "сусід",
    },
    {
      word: "achievement",
      translation: "досягнення",
    },
    {
      word: "reliable",
      translation: "надійний",
    },
    {
      word: "improve",
      translation: "покращувати",
    },
    {
      word: "opportunity",
      translation: "можливість",
    },
  ],
  high: [
    {
      word: "ephemeral",
      translation: "недовговічний",
    },
    {
      word: "ubiquitous",
      translation: "всюдисущий",
    },
    {
      word: "meticulous",
      translation: "ретельний",
    },
    {
      word: "reluctant",
      translation: "неохочий",
    },
    {
      word: "ambiguous",
      translation: "двозначний",
    },
    {
      word: "inevitable",
      translation: "неминучий",
    },
    {
      word: "scrutinize",
      translation: "прискіпливо вивчати",
    },
    {
      word: "resilience",
      translation: "стійкість",
    },
    {
      word: "pragmatic",
      translation: "прагматичний",
    },
    {
      word: "reconcile",
      translation: "примирювати",
    },
  ],
};

const WORDS_LENGTH = 10;
let words = randomizeWords(WORDS.base);

$(() => {
  let currentWordCounter = 0;
  let currentWord = words[0];
  const answeredWords = [];
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  const { $container } = createContainer();

  const {
    $quizContainer,
    $card,
    $cardTitle,
    $nextButton,
    $cardsCounter,
    $prevButton,
    $answerInput,
    $correctAnswersCounter,
    $incorrectAnswersCounter,
  } = createQuizContainer();

  const { $difficultyChooserForm } = createDifficultyChooser();

  $difficultyChooserForm.on("change", () => {
    const value = $('input[name="difficulty"]:checked').val();

    words = randomizeWords(WORDS[value]);
    currentWordCounter = 0;
    currentWord = words[0];
    answeredWords.length = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    $cardTitle.text(currentWord.word);
    $cardsCounter.text(`1/10`);
    $correctAnswersCounter.text(correctAnswers);
    $incorrectAnswersCounter.text(incorrectAnswers);
  });

  $cardTitle.text(currentWord.word);

  $card.on("click", () => {
    const userTranslation = $answerInput.val();
    const hasAnswered = answeredWords.some((word) => {
      return word.word === currentWord.word;
    });

    const isEmpty = !userTranslation || !userTranslation.trim().length;

    if (hasAnswered || isEmpty) return;

    const isCorrectAnswer =
      userTranslation.trim().toLowerCase() === currentWord.translation;

    if (isCorrectAnswer) {
      correctAnswers++;
      $correctAnswersCounter.text(correctAnswers);
    } else {
      incorrectAnswers++;
      $incorrectAnswersCounter.text(incorrectAnswers);
    }

    answeredWords.push(currentWord);

    if (answeredWords.length === WORDS_LENGTH) {
      const { $resultsOverlay } = createResultsModal(correctAnswers);

      $("body").append($resultsOverlay);
    }
  });

  const updateWord = (newValue) => {
    currentWordCounter = newValue;
    $cardsCounter.text(`${currentWordCounter + 1}/10`);
    currentWord = words[currentWordCounter];
    $cardTitle.text(currentWord.word);
  };

  $prevButton.on("click", () => {
    if (currentWordCounter <= 0) {
      return;
    }

    updateWord(currentWordCounter - 1);
  });

  $nextButton.on("click", () => {
    if (currentWordCounter >= WORDS_LENGTH - 1) {
      return;
    }

    updateWord(currentWordCounter + 1);
  });

  $container.append($difficultyChooserForm, $quizContainer);
  $container.appendTo("body");
});

function randomizeWords(words) {
  const randomizedWords = [];
  const usedIndexes = [];

  function getRandomIndex(used) {
    const value = Math.floor(Math.random() * WORDS_LENGTH);
    if (used.includes(value)) {
      return getRandomIndex(used);
    }

    return value;
  }

  for (let i = 0; i < WORDS_LENGTH; ++i) {
    const index = getRandomIndex(usedIndexes);
    usedIndexes.push(index);
    randomizedWords.push(words[index]);
  }

  return randomizedWords;
}

function createContainer() {
  const $container = $("<div>", { class: "container" }).css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "40px",
    margin: "0 auto",
    minHeight: "100dvh",
  });

  return {
    $container,
  };
}

function createQuizContainer() {
  const $quizContainer = $("<div>").css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    gap: "20px",
  });

  const { $card, $cardTitle } = createCard();
  const { $navigationContainer, $nextButton, $cardsCounter, $prevButton } =
    createNavigation();

  const { $answerForm, $answerInput } = createAnswerForm();
  const {
    $statisticsContainer,
    $correctAnswersCounter,
    $incorrectAnswersCounter,
  } = createStatistics();

  $quizContainer.append(
    $card,
    $navigationContainer,
    $answerForm,
    $statisticsContainer,
  );

  return {
    $quizContainer,
    $card,
    $cardTitle,
    $nextButton,
    $cardsCounter,
    $prevButton,
    $answerInput,
    $correctAnswersCounter,
    $incorrectAnswersCounter,
  };
}

function createCard() {
  const $card = $("<div>").css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: "16px",
    maxWidth: "300px",
    width: "100%",
    minHeight: "150px",
    boxShadow: "0 0 15px 2px rgba(0, 0, 0, 0.3)",
  });

  const $cardTitle = $("<h3>").css({
    textAlign: "center",
    fontSize: "24px",
    color: "black",
  });
  $cardTitle.appendTo($card);

  return {
    $card,
    $cardTitle,
  };
}

function createNavigation() {
  const $navigationContainer = $("<div>").css({
    display: "flex",
    alignItems: "center",
    gap: "12px",
  });

  const $prevButton = $("<button>", { text: "←" }).css({
    background: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  });
  const $cardsCounter = $("<span>", { text: `1/${WORDS_LENGTH}` });
  const $nextButton = $("<button>", { text: "→" }).css({
    background: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  });

  $navigationContainer.append($prevButton, $cardsCounter, $nextButton);

  return {
    $navigationContainer,
    $prevButton,
    $cardsCounter,
    $nextButton,
  };
}

function createAnswerForm() {
  const $answerForm = $("<form>");

  const $answerInput = $("<input>", {
    type: "text",
    placeholder: "Переклад",
  }).css({
    padding: "5px 10px",
  });

  $answerForm.append($answerInput);

  return {
    $answerForm,
    $answerInput,
  };
}

function createStatistics() {
  const $statisticsContainer = $("<div>").css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontWeight: "bold",
  });

  const $statisticsTitle = $("<h3>", { text: "Статистика" }).css({
    color: "blue",
    fontSize: "18px",
    marginBottom: "15px",
  });

  const $answersContainer = $("<div>").css({
    display: "flex",
    justifyContent: "space-between",
    minWidth: "300px",
  });

  const $correctAnswersContainer = $("<div>").css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "green",
  });

  const $correctAnswersTitle = $("<h3>", { text: "Вірно" });
  const $correctAnswersCounter = $("<span>", { text: 0 });

  $correctAnswersContainer.append($correctAnswersTitle, $correctAnswersCounter);

  const $incorrectAnswersContainer = $("<div>").css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "red",
  });

  const $incorrectAnswersTitle = $("<h3>", { text: "Невірно" });
  const $incorrectAnswersCounter = $("<span>", { text: 0 });

  $incorrectAnswersContainer.append(
    $incorrectAnswersTitle,
    $incorrectAnswersCounter,
  );

  $answersContainer.append(
    $correctAnswersContainer,
    $incorrectAnswersContainer,
  );

  $statisticsContainer.append($statisticsTitle, $answersContainer);

  return {
    $statisticsContainer,
    $correctAnswersCounter,
    $incorrectAnswersCounter,
  };
}

function createResultsModal(correctAnswers) {
  const $resultsOverlay = $("<div>").css({
    position: "fixed",
    inset: "0",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: "10",
  });

  let englishLevel;

  if (correctAnswers >= 0 && correctAnswers < 2) {
    englishLevel = "A1";
  } else if (correctAnswers >= 2 && correctAnswers < 4) {
    englishLevel = "A2";
  } else if (correctAnswers >= 4 && correctAnswers < 6) {
    englishLevel = "B1";
  } else if (correctAnswers >= 6 && correctAnswers < 8) {
    englishLevel = "B2";
  } else {
    englishLevel = "C1";
  }

  const $resultsModal = $("<div>").css({
    position: "absolute",
    zIndex: "20",
    backgroundColor: "white",
    borderRadius: "16px",
    maxWidth: "400px",
    width: "100%",
    minHeight: "300px",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    gap: "20px",
  });

  const $resultsText = $("<p>", {
    text: `Ви переклали правильно ${correctAnswers} з ${WORDS_LENGTH} слів. Ваш рівень - ${englishLevel}`,
  }).css({
    textAlign: "center",
  });

  const $resetButton = $("<button>", { text: "Спробувати ще раз?" }).css({
    backgroundColor: "white",
    padding: "8px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.3)",
    borderRadius: "16px",
  });
  $resetButton.on("click", () => location.reload());

  $resultsModal.append($resultsText, $resetButton);
  $resultsOverlay.append($resultsModal);

  return {
    $resultsOverlay,
  };
}

function createDifficultyChooser() {
  const $difficultyChooserForm = $("<form>").css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  });

  const $difficultyChooserTitle = $("<h3>", { text: "Рівень складності" });

  const $basicDifficultyLabel = $("<label>", {
    for: "base-difficulty",
    text: "Початковий",
  }).css({
    display: "flex",
    alignItems: "center",
    gap: "5px",
  });

  const $basicDifficultyInput = $("<input>", {
    id: "base-difficulty",
    type: "radio",
    name: "difficulty",
    value: "base",
    checked: true,
  });

  const $mediumDifficultyLabel = $("<label>", {
    for: "medium-difficulty",
    text: "Середній",
  }).css({
    display: "flex",
    alignItems: "center",
    gap: "5px",
  });

  const $mediumDifficultyInput = $("<input>", {
    id: "medium-difficulty",
    type: "radio",
    name: "difficulty",
    value: "medium",
  });

  const $highDifficultyLabel = $("<label>", {
    for: "high-difficulty",
    text: "Складний",
  }).css({
    display: "flex",
    alignItems: "center",
    gap: "5px",
  });

  const $highDifficultyInput = $("<input>", {
    id: "high-difficulty",
    type: "radio",
    name: "difficulty",
    value: "high",
  });

  $basicDifficultyLabel.append($basicDifficultyInput);
  $mediumDifficultyLabel.append($mediumDifficultyInput);
  $highDifficultyLabel.append($highDifficultyInput);

  $difficultyChooserForm.append(
    $difficultyChooserTitle,
    $basicDifficultyLabel,
    $mediumDifficultyLabel,
    $highDifficultyLabel,
  );

  return {
    $difficultyChooserForm,
    $basicDifficultyInput,
    $mediumDifficultyInput,
    $highDifficultyInput,
  };
}
