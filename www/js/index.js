// JLPT N5 Kanji data
const n5Kanji = [
    { kanji: '一', kana: 'いち', english: 'One' },
    { kanji: '二', kana: 'に', english: 'Two' },
    { kanji: '三', kana: 'さん', english: 'Three' },
    { kanji: '四', kana: 'よん, し', english: 'Four' },
    { kanji: '五', kana: 'ご', english: 'Five' },
    { kanji: '六', kana: 'ろく', english: 'Six' },
    { kanji: '七', kana: 'なな, しち', english: 'Seven' },
    { kanji: '八', kana: 'はち', english: 'Eight' },
    { kanji: '九', kana: 'きゅう, く', english: 'Nine' },
    { kanji: '十', kana: 'じゅう', english: 'Ten' },
    { kanji: '百', kana: 'ひゃく', english: 'Hundred' },
    { kanji: '千', kana: 'せん', english: 'Thousand' },
    { kanji: '万', kana: 'まん', english: 'Ten thousand' },
    { kanji: '円', kana: 'えん', english: 'Yen, circle' },
    { kanji: '日', kana: 'にち, ひ', english: 'Day, sun' },
    { kanji: '月', kana: 'つき, げつ', english: 'Month, moon' },
    { kanji: '年', kana: 'ねん, とし', english: 'Year' },
    { kanji: '上', kana: 'うえ, じょう', english: 'Above, up' },
    { kanji: '下', kana: 'した, か', english: 'Below, down' },
    { kanji: '中', kana: 'なか, ちゅう', english: 'Middle, inside' },
    { kanji: '大', kana: 'だい, おお', english: 'Big, large' },
    { kanji: '小', kana: 'しょう, ちい', english: 'Small, little' },
    { kanji: '人', kana: 'ひと, じん, にん', english: 'Person' },
    { kanji: '子', kana: 'こ, し', english: 'Child' },
    { kanji: '女', kana: 'おんな, じょ', english: 'Woman' },
    { kanji: '男', kana: 'おとこ, だん', english: 'Man' },
    { kanji: '先', kana: 'さき, せん', english: 'Previous, ahead' },
    { kanji: '右', kana: 'みぎ', english: 'Right' },
    { kanji: '左', kana: 'ひだり', english: 'Left' },
    { kanji: '名', kana: 'な, めい', english: 'Name' },
    { kanji: '川', kana: 'かわ', english: 'River' },
    { kanji: '火', kana: 'ひ, か', english: 'Fire' },
    { kanji: '水', kana: 'みず, すい', english: 'Water' },
    { kanji: '木', kana: 'き, もく', english: 'Tree, wood' },
    { kanji: '山', kana: 'やま', english: 'Mountain' },
    { kanji: '田', kana: 'た, でん', english: 'Rice field' },
    { kanji: '今', kana: 'いま', english: 'Now' },
    { kanji: '金', kana: 'きん, かね, かな', english: 'Gold, money' },
    { kanji: '雨', kana: 'あめ, う', english: 'Rain' },
    { kanji: '本', kana: 'ほん, もと', english: 'Book, origin' },
    { kanji: '休', kana: 'やす', english: 'Rest' },
    { kanji: '天', kana: 'てん, あめ', english: 'Heaven, sky' },
    { kanji: '気', kana: 'き', english: 'Spirit, air' },
    { kanji: '学', kana: 'がく, まな', english: 'Study, learning' },
    { kanji: '校', kana: 'こう', english: 'School' },
    { kanji: '入', kana: 'はい, い', english: 'Enter, insert' },
    { kanji: '出', kana: 'で, しゅつ', english: 'Exit, leave' },
    { kanji: '立', kana: 'た, りつ', english: 'Stand' },
    { kanji: '文', kana: 'ぶん, もん', english: 'Text, writing' },
    { kanji: '口', kana: 'くち, こう', english: 'Mouth, opening' },
    { kanji: '目', kana: 'め, もく', english: 'Eye' },
    { kanji: '耳', kana: 'みみ', english: 'Ear' },
    { kanji: '手', kana: 'て, しゅ', english: 'Hand' },
    { kanji: '足', kana: 'あし, そく', english: 'Foot, leg' },
    { kanji: '見', kana: 'み, けん', english: 'See, look' },
    { kanji: '音', kana: 'おと, おん', english: 'Sound' },
    { kanji: '生', kana: 'せい, い', english: 'Life, birth' },
    { kanji: '国', kana: 'くに, こく', english: 'Country, nation' },
    { kanji: '語', kana: 'ご, かた', english: 'Language, word' },
    { kanji: '時', kana: 'とき, じ', english: 'Time, hour' },
    { kanji: '間', kana: 'あいだ, かん', english: 'Interval, space' },
    { kanji: '車', kana: 'くるま, しゃ', english: 'Car, vehicle' },
    { kanji: '外', kana: 'そと, がい', english: 'Outside' },
    { kanji: '分', kana: 'わ, ぶん, ふん', english: 'Part, minute' },
    { kanji: '半', kana: 'はん', english: 'Half' },
    { kanji: '用', kana: 'よう', english: 'Use' },
    { kanji: '会', kana: 'かい, あ', english: 'Meeting' },
    { kanji: '来', kana: 'らい, く', english: 'Come' },
    { kanji: '行', kana: 'い, こう, ぎょう', english: 'Go' },
    { kanji: '白', kana: 'しろ, はく', english: 'White' },
    { kanji: '赤', kana: 'あか', english: 'Red' },
    { kanji: '青', kana: 'あお', english: 'Blue' },
    { kanji: '父', kana: 'ちち, ふ', english: 'Father' },
    { kanji: '母', kana: 'はは, ぼ', english: 'Mother' },
    { kanji: '電', kana: 'でん', english: 'Electricity' },
    { kanji: '話', kana: 'はなし, わ', english: 'Talk, story' },
    { kanji: '読', kana: 'よ, どく', english: 'Read' },
    { kanji: '聞', kana: 'き, ぶん', english: 'Hear, ask' },
    { kanji: '何', kana: 'なに, なん', english: 'What' },
    { kanji: '北', kana: 'きた, ほく', english: 'North' },
    { kanji: '南', kana: 'みなみ, なん', english: 'South' },
    { kanji: '東', kana: 'ひがし, とう', english: 'East' },
    { kanji: '西', kana: 'にし, せい', english: 'West' }
];

// Game state
let gameState = {
    currentKanjiIndex: 0, 
    correctCount: 0,
    incorrectCount: 0,
    questionMode: 'kanji',  // kanji, kana, or english
    answerMode: 'english',  // kana or english
    currentOptions: [],
    remainingKanji: [...n5Kanji], // Copy of all kanji to track remaining
    usedIndices: new Set(),
};

// DOM elements
const kanjiDisplay = document.getElementById('current-kanji');
const correctCount = document.getElementById('correct-count');
const incorrectCount = document.getElementById('incorrect-count');
const remainingCount = document.getElementById('remaining-count');
const currentCardNumber = document.getElementById('current-card-number');
const totalCards = document.getElementById('total-cards');
const answersGrid = document.getElementById('answers-grid');
const questionToggle = document.getElementById('question-toggle');
const answerToggle = document.getElementById('answer-toggle');

// Initialize game
function initGame() {
    totalCards.textContent = n5Kanji.length;
    remainingCount.textContent = n5Kanji.length;
    
    // Set up toggle buttons
    setupToggleButtons();
    
    // Start the game
    startNewRound();
}

// Set up toggle buttons
function setupToggleButtons() {
    // Question toggles
    questionToggle.querySelectorAll('.toggle-button').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            questionToggle.querySelectorAll('.toggle-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update game state
            gameState.questionMode = button.dataset.type;
            
            // Update display
            updateKanjiDisplay();
        });
    });
    
    // Answer toggles
    answerToggle.querySelectorAll('.toggle-button').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            answerToggle.querySelectorAll('.toggle-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update game state
            gameState.answerMode = button.dataset.type;
            
            // Update options
            updateAnswerOptions();
        });
    });
}

// Start a new round
function startNewRound() {
    if (gameState.remainingKanji.length === 0) {
        // Game completed
        kanjiDisplay.textContent = "完了"; // "Completed" in Japanese
        answersGrid.innerHTML = '<div class="answer-tile" style="grid-column: span 3;">Quiz completed! Refresh to start again.</div>';
        return;
    }
    
    // Select a random kanji from remaining
    const randomIndex = Math.floor(Math.random() * gameState.remainingKanji.length);
    gameState.currentKanjiIndex = n5Kanji.findIndex(k => k.kanji === gameState.remainingKanji[randomIndex].kanji);
    
    // Remove the selected kanji from remainingKanji
    gameState.remainingKanji.splice(randomIndex, 1);
    
    // Update current card number and remaining count
    currentCardNumber.textContent = (n5Kanji.length - gameState.remainingKanji.length);
    remainingCount.textContent = gameState.remainingKanji.length;
    
    // Update the display
    updateKanjiDisplay();
    generateAnswerOptions();
}

// Update kanji display based on current question mode
function updateKanjiDisplay() {
    const currentKanji = n5Kanji[gameState.currentKanjiIndex];
    
    switch (gameState.questionMode) {
        case 'kanji':
            kanjiDisplay.textContent = currentKanji.kanji;
            break;
        case 'kana':
            kanjiDisplay.textContent = currentKanji.kana;
            break;
        case 'english':
            kanjiDisplay.textContent = currentKanji.english;
            break;
    }
}

// Generate answer options for the current round
function generateAnswerOptions() {
    // Clear used indices
    gameState.usedIndices = new Set([gameState.currentKanjiIndex]);
    gameState.currentOptions = [gameState.currentKanjiIndex];
    
    // Generate 8 random, unique options
    while (gameState.currentOptions.length < 9) {
        const randomIndex = Math.floor(Math.random() * n5Kanji.length);
        
        if (!gameState.usedIndices.has(randomIndex)) {
            gameState.usedIndices.add(randomIndex);
            gameState.currentOptions.push(randomIndex);
        }
    }
    
    // Shuffle the options
    gameState.currentOptions = shuffleArray(gameState.currentOptions);
    
    // Update the UI
    updateAnswerOptions();
}

// Update answer options based on current answer mode
function updateAnswerOptions() {
    answersGrid.innerHTML = '';
    
    gameState.currentOptions.forEach(index => {
        const tile = document.createElement('div');
        tile.className = 'answer-tile';
        
        const kanji = n5Kanji[index];
        
        switch (gameState.answerMode) {
            case 'kana':
                tile.textContent = kanji.kana;
                break;
            case 'english':
                tile.textContent = kanji.english;
                break;
        }
        
        // Add click event
        tile.addEventListener('click', () => {
            if (index === gameState.currentKanjiIndex) {
                // Correct answer
                tile.style.backgroundColor = '#a3e4a3';
                gameState.correctCount++;
                correctCount.textContent = gameState.correctCount;
                
                // Delay before next round
                setTimeout(() => {
                    startNewRound();
                }, 1000);
            } else {
                // Incorrect answer
                tile.style.backgroundColor = '#f5a9a9';
                gameState.incorrectCount++;
                incorrectCount.textContent = gameState.incorrectCount;
                
                // Disable this option
                tile.style.pointerEvents = 'none';
            }
        });
        
        answersGrid.appendChild(tile);
    });
}

// Utility function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);