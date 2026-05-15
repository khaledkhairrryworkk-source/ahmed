// ===== بيانات الأسئلة =====
const questions = [
    {
        id: 1,
        questionNumber: "السؤال الاول",
        questionText: "بتحب ايه أكتر؟",
        options: [
            { text: "ميسي", isCorrect: false },
            { text: "محشي ورق عنب", isCorrect: false },
            { text: "انا", isCorrect: true }
        ]
    },
    {
        id: 2,
        questionNumber: "السؤال الثاني",
        questionText: "لو جيت في يوم وقولتلك مش قادرة اطبخ.. هتعمل ايه؟",
        options: [
            { text: "هتقولي انا جعان قومي اعملي لي اي حاجه", isCorrect: false },
            { text: "هتقولي ارتاحي يا حبيبتي وناهجيبيلنا اكل جاهز", isCorrect: true },
            { text: "هتروح تاكل عند مامتك وتسبينيني", isCorrect: false }
        ]
    },
    {
        id: 3,
        questionNumber: "السؤال الثالث",
        questionText: "لو خلصت مصروفك قبل ما الشهر يخلص",
        options: [
            { text: "هتزعل وتقولي ليه صرفتي كده", isCorrect: false },
            { text: "هديكي فلوس تاني يحببتي", isCorrect: true },
            { text: "هتقولي تدبري امورك", isCorrect: false }
        ]
    },
    {
        id: 4,
        questionNumber: "السؤال الرابع",
        questionText: "ايه أكتر حاجة بتحبها فيا؟",
        options: [
            { text: "ضحكتي", isCorrect: false },
            { text: "قلبي الطيب", isCorrect: false },
            { text: "كل حاجة فيكي", isCorrect: true }
        ]
    }
];

// ===== المتغيرات =====
const splashScreen = document.getElementById('splash');
const btnStart = document.getElementById('btnStart');
const quizPage = document.getElementById('quizPage');
const quizContainer = document.getElementById('quizContainer');
const btnSubmit = document.getElementById('btnSubmit');
const celebrateSection = document.getElementById('celebrateSection');
const btnCelebrate = document.getElementById('btnCelebrate');
const memoriesSection = document.getElementById('memoriesSection');
const letterSection = document.getElementById('letterSection');
const videoSection = document.getElementById('videoSection');
const btnWatchVideo = document.getElementById('btnWatchVideo');
const errorModal = document.getElementById('errorModal');
const btnRetry = document.getElementById('btnRetry');
const questionCountEl = document.getElementById('questionCount');

// متغيرات التحكم في الفيديو
const btnPlayPause = document.getElementById('btnPlayPause');
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const btnFullscreen = document.getElementById('btnFullscreen');
const videoWrapper = document.querySelector('.video-wrapper');

let currentZoom = 1;
let isPlaying = false;

let userAnswers = {};
let currentWrongQuestion = null;

// ===== منطق صفحة الترحيب (3 ثواني) =====
setTimeout(() => {
    if (splashScreen && !splashScreen.classList.contains('fade-out')) {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            quizPage.classList.remove('hidden');
            renderQuestions();
        }, 800);
    }
}, 3000);

if (btnStart) {
    btnStart.addEventListener('click', () => {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            quizPage.classList.remove('hidden');
            renderQuestions();
        }, 800);
    });
}

// ===== رندر الأسئلة =====
function renderQuestions() {
    quizContainer.innerHTML = '';
    questions.forEach((q, index) => {
        const block = document.createElement('div');
        block.className = 'question-block';
        block.style.opacity = '0';
        block.dataset.questionIndex = index;
        block.innerHTML = `
            <div class="question-number">${q.questionNumber}</div>
            <div class="question-text">${q.questionText}</div>
            ${q.options.map((opt, i) => `
                <div class="option-item" data-q="${index}" data-o="${i}" data-c="${opt.isCorrect}">
                    <div class="option-radio"></div>
                    <span class="option-text">${opt.text}</span>
                </div>`).join('')}
        `;
        quizContainer.appendChild(block);
        setTimeout(() => { block.style.opacity = '1'; block.style.transform = 'translateY(0)'; }, 100 * (index + 1));
    });

    document.querySelectorAll('.option-item').forEach(opt => {
        opt.addEventListener('click', function () {
            const qIdx = this.dataset.q;
            const isCorrect = this.dataset.c === 'true';
            if (!isCorrect) {
                currentWrongQuestion = parseInt(qIdx);
                showErrorModal();
                return;
            }
            userAnswers[qIdx] = { isCorrect: true };
            document.querySelectorAll(`.option-item[data-q="${qIdx}"]`).forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    questionCountEl.textContent = `${questions.length} اسئلة`;
}

// ===== زر تأكيد الإجابات =====
btnSubmit.addEventListener('click', () => {
    if (Object.keys(userAnswers).length < questions.length) {
        alert('لازم تجاوب على كل الأسئلة! ');
        return;
    }
    showCelebratePage();
});

function showCelebratePage() {
    celebrateSection.classList.remove('hidden');
    memoriesSection.classList.remove('hidden');
    letterSection.classList.remove('hidden');
    videoSection.classList.remove('hidden');
    createConfetti();
    setTimeout(() => celebrateSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
}

btnCelebrate.addEventListener('click', () => memoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' }));
btnWatchVideo.addEventListener('click', () => videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' }));

// ===== مودال الخطأ =====
function showErrorModal() { errorModal.classList.remove('hidden'); }
btnRetry.addEventListener('click', () => {
    errorModal.classList.add('hidden');
    if (currentWrongQuestion !== null) {
        document.querySelectorAll(`.option-item[data-q="${currentWrongQuestion}"]`).forEach(o => o.classList.remove('selected'));
        delete userAnswers[currentWrongQuestion];
        const qBlock = document.querySelector(`.question-block[data-question-index="${currentWrongQuestion}"]`);
        if (qBlock) qBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        currentWrongQuestion = null;
    }
});

// ===== الكونفيتي =====
function createConfetti() {
    const container = document.getElementById('confettiBg');
    const colors = ['#c2185b', '#e91e63', '#f06292', '#ff80ab', '#fce4ec', '#ffd700', '#ff6b6b', '#ffa07a'];
    for (let i = 0; i < 100; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.width = (Math.random() * 10 + 6) + 'px';
        piece.style.height = (Math.random() * 10 + 6) + 'px';
        if (Math.random() > 0.5) piece.style.borderRadius = '50%';
        container.appendChild(piece);
    }
}

// ===== التحكم في الفيديو =====

// زر تشغيل/إيقاف
if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
        const iframe = document.getElementById('videoFrame');
        if (isPlaying) {
            // إيقاف: إضافة pause للـ iframe
            iframe.src = iframe.src;
            isPlaying = false;
            btnPlayPause.querySelector('.ctrl-icon svg').innerHTML = '<path d="M8 5v14l11-7z"/>';
            btnPlayPause.querySelector('.video-ctrl-label').textContent = 'تشغيل';
        } else {
            // تشغيل
            isPlaying = true;
            btnPlayPause.querySelector('.ctrl-icon svg').innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
            btnPlayPause.querySelector('.video-ctrl-label').textContent = 'إيقاف';
        }
    });
}

// زر تكبير
if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
        if (currentZoom < 2) {
            currentZoom += 0.2;
            videoWrapper.style.transform = `scale(${currentZoom})`;
            videoWrapper.style.transition = 'transform 0.3s ease';
        }
    });
}

// زر تصغير
if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
        if (currentZoom > 0.6) {
            currentZoom -= 0.2;
            videoWrapper.style.transform = `scale(${currentZoom})`;
            videoWrapper.style.transition = 'transform 0.3s ease';
        }
    });
}

// زر ملء الشاشة
if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
        const iframe = document.getElementById('videoFrame');
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
        }
    });
}
