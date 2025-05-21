document.addEventListener('DOMContentLoaded', () => {
    // Global variables
    let kanjiData = [];
    let currentKanji = null;
    let displayedOptions = [];
    let correctOption = null;
    let questionMode = 'kanji'; // 'kanji', 'kana', 'english'
    let answerMode = 'english'; // 'kana', 'english'
    
    // Score tracking
    let correctCount = 0;
    let incorrectCount = 0;
    let remainingCount = 0;
    
    // DOM elements
    const kanjiGrid = document.getElementById('kanji-grid');
    const kanjiDetail = document.getElementById('kanji-detail');
    const currentKanjiElement = document.getElementById('current-kanji');
    const kanjiEnglishElement = document.getElementById('kanji-english');
    const kanjiKanaElement = document.getElementById('kanji-kana');
    const kunYomiElement = document.getElementById('kun-yomi');
    const onYomiElement = document.getElementById('on-yomi');
    const examplesListElement = document.getElementById('examples-list');
    
    // Mode buttons
    const kanjiBtnElement = document.getElementById('kanji-btn');
    const kanaBtnElement = document.getElementById('kana-btn');
    const englishBtnElement = document.getElementById('english-btn');
    const kanaAnswerBtnElement = document.getElementById('kana-answer-btn');
    const englishAnswerBtnElement = document.getElementById('english-answer-btn');
    
    // Score elements
    const correctCountElement = document.getElementById('correct-count');
    const incorrectCountElement = document.getElementById('incorrect-count');
    const remainingCountElement = document.getElementById('remaining-count');
    
    // Load Kanji data from JSON file
    async function loadKanjiData() {
        try {
            const response = await fetch('db/N5.json');
            if (!response.ok) {
                throw new Error('Failed to load kanji data');
            }
            const data = await response.json();
            kanjiData = data.MatchCards;
            remainingCount = kanjiData.length;
            remainingCountElement.textContent = remainingCount;
            
            // Start the quiz once data is loaded
            startQuiz();
        } catch (error) {
            console.error('Error loading kanji data:', error);
            kanjiGrid.innerHTML = '<div class="error">Failed to load kanji data. Please check your connection and try again.</div>';
        }
    }
    
    // Initialize quiz with a new question
    function startQuiz() {
        // Select a random kanji from the data
        selectRandomKanji();
        
        // Generate options for the quiz (1 correct, 8 wrong)
        generateOptions();
        
        // Display the options in the grid
        renderGrid();
    }
    
    // Select a random kanji from the data
    function selectRandomKanji() {
        if (kanjiData.length === 0) {
            showCompletionMessage();
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * kanjiData.length);
        currentKanji = kanjiData[randomIndex];
        
        // Remove selected kanji from the data to avoid repetition
        kanjiData.splice(randomIndex, 1);
    }
    
    // Generate 9 options (1 correct, 8 distractors)
    function generateOptions() {
        displayedOptions = [currentKanji];
        
        // Choose 8 different kanji for wrong options
        while (displayedOptions.length < 9) {
            const randomIndex = Math.floor(Math.random() * kanjiData.length);
            const option = kanjiData[randomIndex];
            
            // Check if this option is already in displayedOptions
            if (!displayedOptions.some(item => item.Kanji === option.Kanji)) {
                displayedOptions.push(option);
            }
        }
        
        // Shuffle the options
        shuffleArray(displayedOptions);
        
        // Find the index of the correct option after shuffling
        correctOption = displayedOptions.findIndex(option => option.Kanji === currentKanji.Kanji);
    }
    
    // Shuffle array in place (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Render the grid with options
    function renderGrid() {
        kanjiGrid.innerHTML = '';
        
        displayedOptions.forEach((option, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            
            // Set the card content based on the answer mode
            if (answerMode === 'kana') {
                card.textContent = option.Kana;
            } else {
                card.textContent = option.English;
            }
            
            // Add click event handler
            card.addEventListener('click', handleCardClick);
            
            kanjiGrid.appendChild(card);
        });
        
        // Update the question display
        updateQuestionDisplay();
    }
    
    // Update the question display based on the question mode
    function updateQuestionDisplay() {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('kanji-display');
        
        let questionText = '';
        
        switch (questionMode) {
            case 'kanji':
                questionText = currentKanji.Kanji;
                break;
            case 'kana':
                questionText = currentKanji.Kana;
                break;
            case 'english':
                questionText = currentKanji.English;
                break;
        }
        
        questionContainer.textContent = questionText;
        
        // Insert before the grid
        document.querySelector('.container').insertBefore(questionContainer, kanjiGrid);
        
        if (document.querySelector('.kanji-display') && document.querySelector('.kanji-display') !== questionContainer) {
            document.querySelector('.kanji-display').remove();
        }
    }
    
    // Handle card click event
    function handleCardClick(event) {
        const selectedIndex = parseInt(event.target.dataset.index);
        
        // Check if the answer is correct
        if (selectedIndex === correctOption) {
            // Correct answer
            event.target.classList.add('correct-card');
            correctCount++;
            correctCountElement.textContent = correctCount;
            
            // Show kanji details
            showKanjiDetails();
        } else {
            // Incorrect answer
            event.target.classList.add('incorrect-card');
            incorrectCount++;
            incorrectCountElement.textContent = incorrectCount;
        }
        
        // Update remaining count
        remainingCount--;
        remainingCountElement.textContent = remainingCount;
        
        // Disable all cards to prevent multiple selections
        const cards = kanjiGrid.querySelectorAll('.card');
        cards.forEach(card => {
            card.removeEventListener('click', handleCardClick);
            card.style.cursor = 'default';
        });
        
        // Move to next question after a delay
        setTimeout(() => {
            if (document.querySelector('.kanji-display')) {
                document.querySelector('.kanji-display').remove();
            }
            startQuiz();
        }, 2000);
    }
    
    // Show kanji details when correct answer is chosen
    function showKanjiDetails() {
        currentKanjiElement.textContent = currentKanji.Kanji;
        kanjiEnglishElement.textContent = currentKanji.English;
        kanjiKanaElement.textContent = currentKanji.Kana;
        kunYomiElement.textContent = currentKanji.KunYomi;
        onYomiElement.textContent = currentKanji.OnYomi;
        
        // Display examples
        examplesListElement.innerHTML = '';
        if (currentKanji.Examples && currentKanji.Examples.length > 0) {
            // Display up to 4 examples
            const exampleCount = Math.min(4, currentKanji.Examples.length);
            
            for (let i = 0; i < exampleCount; i++) {
                const example = currentKanji.Examples[i];
                const exampleElement = document.createElement('div');
                exampleElement.classList.add('example-item');
                
                exampleElement.innerHTML = `
                    <span>${example.KanjiWord} (${example.KanaWord})</span>
                    <span>${example.EnglishWord}</span>
                `;
                
                examplesListElement.appendChild(exampleElement);
            }
        }
        
        kanjiDetail.style.display = 'block';
        
        // Hide the details after a delay
        setTimeout(() => {
            kanjiDetail.style.display = 'none';
        }, 3000);
    }
    
    // Show completion message when all kanji have been reviewed
    function showCompletionMessage() {
        kanjiGrid.innerHTML = `
            <div class="completion-message">
                <h2>Congratulations!</h2>
                <p>You have completed all JLPT N5 kanji.</p>
                <p>Score: ${correctCount}/${correctCount + incorrectCount}</p>
                <button id="restart-btn">Restart Quiz</button>
            </div>
        `;
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }
    
    // Mode selection handlers
    kanjiBtnElement.addEventListener('click', () => {
        questionMode = 'kanji';
        updateModeButtons();
        updateQuestionDisplay();
    });
    
    kanaBtnElement.addEventListener('click', () => {
        questionMode = 'kana';
        updateModeButtons();
        updateQuestionDisplay();
    });
    
    englishBtnElement.addEventListener('click', () => {
        questionMode = 'english';
        updateModeButtons();
        updateQuestionDisplay();
    });
    
    kanaAnswerBtnElement.addEventListener('click', () => {
        answerMode = 'kana';
        updateAnswerModeButtons();
        renderGrid();
    });
    
    englishAnswerBtnElement.addEventListener('click', () => {
        answerMode = 'english';
        updateAnswerModeButtons();
        renderGrid();
    });
    
    // Update the active state of the question mode buttons
    function updateModeButtons() {
        kanjiBtnElement.classList.toggle('active', questionMode === 'kanji');
        kanaBtnElement.classList.toggle('active', questionMode === 'kana');
        englishBtnElement.classList.toggle('active', questionMode === 'english');
    }
    
    // Update the active state of the answer mode buttons
    function updateAnswerModeButtons() {
        kanaAnswerBtnElement.classList.toggle('active', answerMode === 'kana');
        englishAnswerBtnElement.classList.toggle('active', answerMode === 'english');
    }
    
    // Initialize the quiz
    loadKanjiData();
});
