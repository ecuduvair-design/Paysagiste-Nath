const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const filters = document.querySelectorAll('.filter');
const plantCards = document.querySelectorAll('.plant-card');

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((filter) => filter.classList.remove('active'));
    button.classList.add('active');
    const category = button.dataset.filter;

    plantCards.forEach((card) => {
      const visible = category === 'all' || card.dataset.category === category;
      card.classList.toggle('is-hidden', !visible);
    });
  });
});

const quizQuestions = [
  {
    question: 'Quelle lumière reçoit votre espace ?',
    answers: [
      { label: 'Du soleil presque toute la journée', scores: { callistemon: 2, westringia: 2, leucadendron: 2, pittosporum: 1 } },
      { label: 'Soleil le matin ou en fin de journée', scores: { callistemon: 1, westringia: 1, pittosporum: 2 } },
      { label: 'Une lumière douce, souvent tamisée', scores: { pittosporum: 3, westringia: 1 } }
    ]
  },
  {
    question: 'À quoi ressemblent vos hivers ?',
    answers: [
      { label: 'Le gel est exceptionnel', scores: { callistemon: 2, leucadendron: 2, westringia: 1, pittosporum: 1 } },
      { label: 'Quelques nuits entre 0 et −5 °C', scores: { callistemon: 2, westringia: 2, pittosporum: 2, leucadendron: 1 } },
      { label: 'Il peut faire entre −5 et −10 °C', scores: { pittosporum: 3, westringia: 2 } }
    ]
  },
  {
    question: 'Combien de temps voulez-vous y consacrer ?',
    answers: [
      { label: 'Le minimum : il doit être autonome', scores: { westringia: 3, leucadendron: 2, pittosporum: 1 } },
      { label: 'Un arrosage et une taille de temps en temps', scores: { callistemon: 2, pittosporum: 2, leucadendron: 1 } },
      { label: 'J’aime jardiner et observer mes plantes', scores: { callistemon: 2, leucadendron: 2, pittosporum: 1, westringia: 1 } }
    ]
  },
  {
    question: 'Quelle présence recherchez-vous ?',
    answers: [
      { label: 'Une floraison vive et généreuse', scores: { callistemon: 4, pittosporum: 1 } },
      { label: 'Un feuillage doux et argenté', scores: { westringia: 4 } },
      { label: 'Une silhouette graphique et colorée', scores: { leucadendron: 4 } },
      { label: 'Un écran vert, dense et parfumé', scores: { pittosporum: 4 } }
    ]
  }
];

const quizProfiles = {
  callistemon: {
    name: 'Le callistemon',
    text: 'Solaire et spectaculaire, il donnera immédiatement un accent australien à votre terrasse tout en régalant les pollinisateurs.',
    tags: ['Floraison corail', 'Plein soleil', 'Jusqu’à −6 °C'],
    advice: 'Placez-le dans la zone la plus chaude et arrosez dès que la terre sèche sur 3 cm.'
  },
  westringia: {
    name: 'Le westringia',
    text: 'Sobre, lumineux et résistant, c’est le meilleur allié des terrasses ventées et des jardiniers qui aiment la simplicité.',
    tags: ['Très peu d’eau', 'Embruns', 'Jusqu’à −7 °C'],
    advice: 'Offrez-lui un drainage impeccable et pincez ses extrémités au printemps pour garder un port dense.'
  },
  leucadendron: {
    name: 'Le leucadendron',
    text: 'Sa silhouette sculpturale et ses teintes cuivrées feront de lui la pièce forte d’une composition très contemporaine.',
    tags: ['Graphique', 'Sol acide', 'Jusqu’à −5 °C'],
    advice: 'Cultivez-le en pot si vos hivers sont humides, dans un mélange sans calcaire et pauvre en phosphore.'
  },
  pittosporum: {
    name: 'Le pittosporum',
    text: 'Persistant, parfumé et accommodant, il structure facilement un balcon ou une terrasse même lorsque la lumière est plus douce.',
    tags: ['Persistant', 'Mi-ombre', 'Jusqu’à −10 °C'],
    advice: 'Arrosez régulièrement la première année, puis laissez sécher la surface du sol entre deux apports.'
  }
};

const quizStep = document.querySelector('#quiz-step');
const quizProgressBar = document.querySelector('#quiz-progress-bar');
const quizNumber = document.querySelector('#quiz-number');
const quizQuestion = document.querySelector('#quiz-question');
const quizOptions = document.querySelector('#quiz-options');
const quizQuestionView = document.querySelector('#quiz-question-view');
const quizResult = document.querySelector('#quiz-result');
const quizResultImage = document.querySelector('#quiz-result-image');
const quizResultName = document.querySelector('#quiz-result-name');
const quizResultText = document.querySelector('#quiz-result-text');
const quizResultTags = document.querySelector('#quiz-result-tags');
const quizResultAdvice = document.querySelector('#quiz-result-advice');
const quizRestart = document.querySelector('#quiz-restart');

let quizIndex = 0;
let quizScores = {};
let quizLocked = false;

function renderQuizQuestion() {
  const current = quizQuestions[quizIndex];
  quizStep.textContent = `Question ${quizIndex + 1} sur ${quizQuestions.length}`;
  quizProgressBar.style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
  quizNumber.textContent = String(quizIndex + 1).padStart(2, '0');
  quizQuestion.textContent = current.question;
  quizOptions.replaceChildren();

  current.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.textContent = answer.label;
    button.addEventListener('click', () => chooseQuizAnswer(answer, button));
    quizOptions.append(button);
  });
}

function chooseQuizAnswer(answer, button) {
  if (quizLocked) return;
  quizLocked = true;
  button.classList.add('chosen');
  Object.entries(answer.scores).forEach(([profile, score]) => {
    quizScores[profile] = (quizScores[profile] || 0) + score;
  });

  window.setTimeout(() => {
    quizIndex += 1;
    if (quizIndex < quizQuestions.length) {
      renderQuizQuestion();
      quizLocked = false;
    } else {
      showQuizResult();
    }
  }, 260);
}

function showQuizResult() {
  const winner = Object.keys(quizProfiles).reduce((best, profile) =>
    (quizScores[profile] || 0) > (quizScores[best] || 0) ? profile : best
  );
  const profile = quizProfiles[winner];

  quizQuestionView.hidden = true;
  quizResult.hidden = false;
  quizStep.textContent = 'Votre résultat';
  quizProgressBar.style.width = '100%';
  quizResultImage.className = `quiz-result-image result-${winner}`;
  quizResultName.textContent = profile.name;
  quizResultText.textContent = profile.text;
  quizResultAdvice.textContent = profile.advice;
  quizResultTags.replaceChildren(...profile.tags.map((tag) => {
    const item = document.createElement('span');
    item.textContent = tag;
    return item;
  }));
}

quizRestart.addEventListener('click', () => {
  quizIndex = 0;
  quizScores = {};
  quizLocked = false;
  quizResult.hidden = true;
  quizQuestionView.hidden = false;
  renderQuizQuestion();
});

renderQuizQuestion();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const newsletterForm = document.querySelector('.newsletter-form');
const toast = document.querySelector('.toast');

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = newsletterForm.querySelector('input');
  toast.classList.add('show');
  input.value = '';
  window.setTimeout(() => toast.classList.remove('show'), 3500);
});
