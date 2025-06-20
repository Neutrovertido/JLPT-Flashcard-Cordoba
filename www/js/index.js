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
    let totalKanjiCount = 0;
    let jlptLevel = 5; // default, will be overwritten by JSON
    
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
    
    // DOM elements for next button
    const modeSelector = document.getElementById('mode-selector');
    const nextButtonContainer = document.getElementById('next-button-container');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    
    // DOM elements for question container
    const kanjiQuestionContainer = document.getElementById('kanji-question-container');
    
    // Update for the new question mode elements
    const questionModeSection = document.getElementById('question-mode');
    
    // Popup menu logic
    const menuButton = document.getElementById('menu-button');
    const popupMenuOverlay = document.getElementById('popup-menu-overlay');
    const popupOkBtn = document.getElementById('popup-ok-btn');
    const popupCancelBtn = document.getElementById('popup-cancel-btn');
    const quizSetForm = document.getElementById('quiz-set-form');
    const customJsonInput = document.getElementById('custom-json-input');
    const rangeRow = document.getElementById('popup-range-row');
    const rangeStartInput = document.getElementById('range-start');
    const rangeEndInput = document.getElementById('range-end');
    const rangeMaxLabel = document.getElementById('range-max-label');

    let quizSetFile = null;
    let customJsonData = null;
    let deckMax = 1; // will be set dynamically

    // Store the full pool for distractors (within selected range)
    let distractorPool = [];

    // Helper: get deck size for a quizset (sync, for menu)
    function getDeckSizeForQuizset(quizset) {
        // These numbers should match your actual deck sizes
        const sizes = {
            hiragana: 72,
            katakana: 72,
            n5: 103,
            n4: 181,
            n3: 420,
            n2: 319,
            n1: 1011
        };
        return sizes[quizset] || 1;
    }

    // Set range fields and max label
    function updateRangeFields(quizset) {
        if (quizset === 'custom') {
            rangeStartInput.disabled = true;
            rangeEndInput.disabled = true;
            rangeMaxLabel.textContent = '';
            return;
        }
        deckMax = getDeckSizeForQuizset(quizset);
        rangeStartInput.disabled = false;
        rangeEndInput.disabled = false;
        rangeStartInput.max = deckMax;
        rangeEndInput.max = deckMax;
        rangeEndInput.value = deckMax;
        rangeMaxLabel.textContent = `/ ${deckMax}`;
    }

    // On menu open, restore previous selection and range
    menuButton.addEventListener('click', () => {
        // Restore selection
        let storedQuizset = localStorage.getItem('jlpt_quizset');
        if (!storedQuizset) storedQuizset = 'n5';
        const radios = quizSetForm.elements['quizset'];
        for (let radio of radios) {
            radio.checked = (radio.value === storedQuizset);
        }
        updateRangeFields(storedQuizset);

        // Restore range
        let storedRange = localStorage.getItem('jlpt_quizset_range');
        if (storedRange) {
            try {
                let {start, end} = JSON.parse(storedRange);
                rangeStartInput.value = start;
                rangeEndInput.value = end;
            } catch {}
        } else {
            // Default to n5 full range if nothing in storage
            rangeStartInput.value = 1;
            rangeEndInput.value = getDeckSizeForQuizset(storedQuizset);
        }
        popupMenuOverlay.style.display = 'flex';
    });

    // Update range fields when quizset changes
    quizSetForm.addEventListener('change', (e) => {
        if (e.target.name === 'quizset') {
            updateRangeFields(e.target.value);
            if (e.target.value !== 'custom') {
                rangeStartInput.value = 1;
                rangeEndInput.value = getDeckSizeForQuizset(e.target.value);
            }
        }
    });

    // Range validation
    function clampRangeInputs() {
        let start = parseInt(rangeStartInput.value, 10) || 1;
        let end = parseInt(rangeEndInput.value, 10) || deckMax;
        start = Math.max(1, Math.min(start, deckMax));
        end = Math.max(1, Math.min(end, deckMax));
        if (start > end) start = end;
        // Ensure at least 10 cards in range
        if (end - start + 1 < 10) {
            if (end + (10 - (end - start + 1)) <= deckMax) {
                end = start + 9;
            } else if (start - (10 - (end - start + 1)) >= 1) {
                start = end - 9;
            } else {
                // fallback: set to max possible range
                start = Math.max(1, deckMax - 9);
                end = deckMax;
            }
        }
        rangeStartInput.value = start;
        rangeEndInput.value = end;
    }

    // rangeStartInput.addEventListener('input', clampRangeInputs);
    // rangeEndInput.addEventListener('input', clampRangeInputs);

    // Only clamp on blur (losing focus) or when clicking OK
    rangeStartInput.addEventListener('blur', clampRangeInputs);
    rangeEndInput.addEventListener('blur', clampRangeInputs);

    // OK button: handle quiz set selection
    popupOkBtn.addEventListener('click', () => {
        const selected = quizSetForm.quizset.value;
        if (selected === 'custom') {
            rangeStartInput.disabled = true;
            rangeEndInput.disabled = true;
            rangeMaxLabel.textContent = '';
            customJsonInput.value = '';
            customJsonInput.click();
        } else {
            clampRangeInputs(); // Clamp when clicking OK
            // Save selection and range to localStorage
            localStorage.setItem('jlpt_quizset', selected);
            localStorage.setItem('jlpt_quizset_range', JSON.stringify({
                start: parseInt(rangeStartInput.value, 10),
                end: parseInt(rangeEndInput.value, 10)
            }));
            localStorage.removeItem('jlpt_custom_json');
            window.location.reload();
        }
        popupMenuOverlay.style.display = 'none';
    });

    // Hide popup menu on cancel
    popupCancelBtn.addEventListener('click', () => {
        clampRangeInputs(); // Clamp when clicking Cancel (to restore valid state)
        popupMenuOverlay.style.display = 'none';
    });

    // Handle custom file selection
    customJsonInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const json = JSON.parse(evt.target.result);
                localStorage.setItem('jlpt_quizset', 'custom');
                localStorage.setItem('jlpt_custom_json', evt.target.result);
                window.location.reload();
            } catch (err) {
                alert('Invalid JSON file.');
            }
        };
        reader.readAsText(file);
    });

    // Determine which file to load on startup
    function getQuizSetFile() {
        let stored = localStorage.getItem('jlpt_quizset');
        if (!stored) {
            // Default to n5 and its range if nothing in storage
            localStorage.setItem('jlpt_quizset', 'n5');
            localStorage.setItem('jlpt_quizset_range', JSON.stringify({
                start: 1,
                end: getDeckSizeForQuizset('n5')
            }));
            stored = 'n5';
        }
        if (stored === 'custom') {
            const custom = localStorage.getItem('jlpt_custom_json');
            if (custom) {
                try {
                    return JSON.parse(custom);
                } catch {
                    // fallback to N5
                }
            }
        } else if (stored) {
            switch (stored) {
                case 'hiragana': return 'db/Hiragana.json';
                case 'katakana': return 'db/Katakana.json';
                case 'n5': return 'db/N5.json';
                case 'n4': return 'db/N4.json';
                case 'n3': return 'db/N3.json';
                case 'n2': return 'db/N2.json';
                case 'n1': return 'db/N1.json';
            }
        }
        return 'db/N5.json';
    }

    // Load Kanji data from JSON file or custom JSON
    async function loadKanjiData() {
        // Helper to add timeout to a promise
        function withTimeout(promise, ms) {
            return Promise.race([
                promise,
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Loading kanji data timed out after 5 seconds')), ms)
                )
            ]);
        }

        try {
            let quizSet = getQuizSetFile();
            let data, isKanaFile = false;
            let range = {start: 1, end: 1};
            let storedQuizset = localStorage.getItem('jlpt_quizset') || 'n5';
            let storedRange = localStorage.getItem('jlpt_quizset_range');
            if (storedRange) {
                try {
                    range = JSON.parse(storedRange);
                } catch {
                    range = {start: 1, end: 1};
                }
            }

            if (typeof quizSet === 'object') {
                data = quizSet;
            } else {
                // Add 5 second timeout to fetch
                const response = await withTimeout(fetch(quizSet), 5000);
                if (!response.ok) {
                    throw new Error('Failed to load kanji data');
                }
                data = await withTimeout(response.json(), 5000);
            }

            // Detect kana file by JLPTLevel or filename
            if (
                (storedQuizset === 'hiragana' || storedQuizset === 'katakana') ||
                (typeof data.JLPTLevel === 'number' && (data.JLPTLevel === 7 || data.JLPTLevel === 6))
            ) {
                isKanaFile = true;
            }
            if (isKanaFile) {
                kanjiData = data.MatchCards.map(card => ({
                    ...card,
                    Kanji: card.Kana.trim(),
                    Kana: card.Kana.trim(),
                    English: card.English.trim(),
                    OnYomi: "",
                    KunYomi: "",
                    Examples: []
                }));
                jlptLevel = 0;
            } else {
                kanjiData = data.MatchCards;
                jlptLevel = typeof data.JLPTLevel === 'number' ? data.JLPTLevel : 5;
            }
            totalKanjiCount = kanjiData.length;
            // Clamp range to deck size
            let startIdx = Math.max(1, Math.min(range.start, totalKanjiCount));
            let endIdx = Math.max(1, Math.min(range.end, totalKanjiCount));
            if (startIdx > endIdx) startIdx = endIdx;
            // Ensure a minimum range size of 10 cards
            if ((endIdx - startIdx + 1) < 10) {
                endIdx = Math.min(startIdx + 9, totalKanjiCount);
            }
            // Slice deck to selected range (1-based to 0-based)
            kanjiData = kanjiData.slice(startIdx - 1, endIdx);
            // Set distractor pool to the full selected range (not mutated during quiz)
            distractorPool = kanjiData.slice();
            totalKanjiCount = kanjiData.length;
            remainingCount = totalKanjiCount;
            remainingCountElement.textContent = remainingCount;
            startQuiz();
        } catch (error) {
            console.error('Error loading kanji data:', error);
            kanjiGrid.innerHTML = '<div class="error">Failed to load kanji data. Please check your file and try again.</div>';
        }
    }
    
    // Initialize quiz with a new question
    function startQuiz() {
        // Make sure mode selectors are shown and next button is hidden
        modeSelector.style.display = 'flex';
        nextButtonContainer.style.display = 'none';

        // If there are no more kanji left, show completion message
        if (kanjiData.length === 0) {
            showCompletionMessage();
            return;
        }

        // Select a random kanji from the data
        selectRandomKanji();

        // Generate options for the quiz (1 correct, 8 wrong)
        generateOptions();

        // Display the options in the grid
        renderGrid();
    }
    
    // Select a random kanji from the data
    function selectRandomKanji() {
        // If it's time for a review and there are items in the review queue, pick one at random
        if (
            reviewQueue.length > 0 &&
            reviewCounter > 0 &&
            reviewCounter % reviewInterval === 0
        ) {
            // Pick a random review item
            const idx = Math.floor(Math.random() * reviewQueue.length);
            currentKanji = reviewQueue[idx];
            currentKanji._isReview = true;
            reviewing = true;
        } else if (kanjiData.length > 0) {
            const randomIndex = Math.floor(Math.random() * kanjiData.length);
            currentKanji = kanjiData[randomIndex];
            currentKanji._isReview = false;
            reviewing = false;
            kanjiData.splice(randomIndex, 1);
        } else if (reviewQueue.length > 0) {
            // If main deck is empty but review remains, always review
            const idx = Math.floor(Math.random() * reviewQueue.length);
            currentKanji = reviewQueue[idx];
            currentKanji._isReview = true;
            reviewing = true;
        } else {
            currentKanji = null;
            reviewing = false;
        }
        reviewCounter++;
    }
    
    // Generate 9 options (1 correct, 8 distractors)
    function generateOptions() {
        displayedOptions = [currentKanji];

        // Use distractors from the full pool, excluding the currentKanji
        let availableDistractors = distractorPool.filter(item => item.Kanji !== currentKanji.Kanji);

        // If not enough distractors, use as many as possible
        while (displayedOptions.length < 9 && availableDistractors.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableDistractors.length);
            const option = availableDistractors.splice(randomIndex, 1)[0];
            displayedOptions.push(option);
        }

        // If still not enough (e.g. deck < 9), fill with dummies
        while (displayedOptions.length < 9) {
            displayedOptions.push({
                ...currentKanji,
                isDummy: true
            });
        }

        // Shuffle the options
        shuffleArray(displayedOptions);

        // Find the index of the correct option after shuffling
        correctOption = displayedOptions.findIndex(option => option.Kanji === currentKanji.Kanji && !option.isDummy);
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

            // Set the card content based on the answer mode (default view)
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
    
    // Add a reference for the flip container
    let kanjiFlipContainer = null;

    // Add a reference for the left panel
    const leftPanel = document.querySelector('.left-panel');

    // Update the question display based on the question mode
    function updateQuestionDisplay() {
        // Create or reuse the flip container
        if (!kanjiFlipContainer) {
            kanjiFlipContainer = document.createElement('div');
            kanjiFlipContainer.className = 'kanji-flip-container';
            kanjiFlipContainer.innerHTML = `
                <div class="kanji-flip-inner">
                    <div class="kanji-flip-front"></div>
                    <div class="kanji-flip-back"></div>
                </div>
            `;
            kanjiQuestionContainer.innerHTML = '';
            kanjiQuestionContainer.appendChild(kanjiFlipContainer);
        } else {
            kanjiFlipContainer.classList.remove('flipped');
        }

        // Build the kanji-display for the front
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

        const kanjiCharElement = document.createElement('div');
        kanjiCharElement.classList.add('kanji-character');
        kanjiCharElement.textContent = questionText;
        questionContainer.appendChild(kanjiCharElement);

        const footerElement = document.createElement('div');
        footerElement.classList.add('kanji-footer');
        const levelElement = document.createElement('div');
        levelElement.classList.add('kanji-level');
        const levelLabel = jlptLevel === 0 || jlptLevel > 5
            ? `JLPT N5 Kana`
            : `JLPT N${jlptLevel} Kanji`;
        levelElement.textContent = levelLabel;
        footerElement.appendChild(levelElement);

        const counterElement = document.createElement('div');
        counterElement.classList.add('kanji-counter');
        counterElement.textContent = `${totalKanjiCount + 1 - remainingCount} of ${totalKanjiCount}`;
        footerElement.appendChild(counterElement);

        questionContainer.appendChild(footerElement);

        // Place the kanji-display in the front face
        kanjiFlipContainer.querySelector('.kanji-flip-front').innerHTML = '';
        kanjiFlipContainer.querySelector('.kanji-flip-front').appendChild(questionContainer);

        // Place the kanji-detail in the back face (hidden until flipped)
        kanjiFlipContainer.querySelector('.kanji-flip-back').innerHTML = '';
        kanjiFlipContainer.querySelector('.kanji-flip-back').appendChild(kanjiDetail);

        // Show only the flip container
        kanjiFlipContainer.style.display = '';
        kanjiDetail.style.display = 'none';
    }
    
    // Track wrong answers for spaced repetition
    let wrongKanjiList = [];
    let reviewQueue = [];
    let reviewInterval = 5;
    let reviewCounter = 0;
    let reviewing = false;

    // Handle card click event
    function handleCardClick(event) {
        const selectedIndex = parseInt(event.target.dataset.index);

        // If this is a review card, handle differently
        if (currentKanji && currentKanji._isReview) {
            if (selectedIndex === correctOption) {
                event.target.classList.add('correct-card');
                // Remove from reviewQueue
                reviewQueue = reviewQueue.filter(k => k.Kanji !== currentKanji.Kanji);
                // Show kanji details (review correct, blue)
                showKanjiDetails(false, "review-correct");
            } else {
                // Show as incorrect, but do not increment incorrectCount
                const option = displayedOptions[selectedIndex];
                event.target.classList.add('incorrect-card');
                event.target.innerHTML = `
                    <span class="wrong-x">✗</span>
                    <div class="card-kanji">${option.Kanji}</div>
                    <div class="card-kana">${option.Kana}</div>
                    <div class="card-english">${option.English}</div>
                `;
                // Ensure it's still in reviewQueue
                if (!reviewQueue.some(k => k.Kanji === currentKanji.Kanji)) {
                    reviewQueue.push({...currentKanji});
                }
                // Show kanji details (review incorrect, red)
                showKanjiDetails(true, "review-wrong");
            }

            // No score update for review cards

            // Disable all cards to prevent multiple selections
            const cards = kanjiGrid.querySelectorAll('.card');
            cards.forEach(card => {
                card.removeEventListener('click', handleCardClick);
                card.style.cursor = 'default';
            });

            // Show next button and hide mode selectors
            modeSelector.style.display = 'none';
            questionModeSection.style.display = 'none';
            nextButtonContainer.style.display = 'flex';

            // FLIP ANIMATION: trigger flip to show kanji-detail
            if (kanjiFlipContainer) {
                kanjiFlipContainer.classList.add('flipped');
            }
            // Add margin-bottom to left-panel when flipped
            if (leftPanel) {
                leftPanel.classList.add('flipped');
            }
            return;
        }

        // Normal card handling
        if (selectedIndex === correctOption) {
            // Correct answer
            event.target.classList.add('correct-card');
            correctCount++;
            correctCountElement.textContent = correctCount;
            showKanjiDetails(false);
        } else {
            // Incorrect answer
            // Replace card content with custom layout
            const option = displayedOptions[selectedIndex];
            event.target.classList.add('incorrect-card');
            event.target.innerHTML = `
                <span class="wrong-x">✗</span>
                <div class="card-kanji">${option.Kanji}</div>
                <div class="card-kana">${option.Kana}</div>
                <div class="card-english">${option.English}</div>
            `;
            incorrectCount++;
            incorrectCountElement.textContent = incorrectCount;

            // Highlight the correct answer
            const correctCard = kanjiGrid.querySelector(`.card[data-index="${correctOption}"]`);
            if (correctCard) {
                correctCard.classList.add('correct-card');
            }

            // Track the wrong kanji for review and for display at end
            wrongKanjiList.push({
                Kanji: currentKanji.Kanji,
                Kana: currentKanji.Kana,
                English: currentKanji.English
            });
            // Add to review queue if not already present
            if (!reviewQueue.some(k => k.Kanji === currentKanji.Kanji)) {
                reviewQueue.push({...currentKanji});
            }
            showKanjiDetails(true);
        }

        remainingCount--;
        remainingCountElement.textContent = remainingCount;

        // Disable all cards to prevent multiple selections
        const cards = kanjiGrid.querySelectorAll('.card');
        cards.forEach(card => {
            card.removeEventListener('click', handleCardClick);
            card.style.cursor = 'default';
        });

        // Show next button and hide mode selectors
        modeSelector.style.display = 'none';
        questionModeSection.style.display = 'none';
        nextButtonContainer.style.display = 'flex';

        // FLIP ANIMATION: trigger flip to show kanji-detail
        if (kanjiFlipContainer) {
            kanjiFlipContainer.classList.add('flipped');
        }
        // Add margin-bottom to left-panel when flipped
        if (leftPanel) {
            leftPanel.classList.add('flipped');
        }
    }
    
    // Next button click handler
    nextQuestionBtn.addEventListener('click', goToNextQuestion);
    
    function goToNextQuestion() {
        // Hide next button and show mode selectors
        nextButtonContainer.style.display = 'none';
        modeSelector.style.display = 'flex';
        questionModeSection.style.display = 'flex';

        // Reset flip animation instantly (no transition)
        if (kanjiFlipContainer) {
            kanjiFlipContainer.classList.remove('flipped');
            // Force reflow to apply the no-transition state before next question
            void kanjiFlipContainer.offsetWidth;
        }

        // Reset left-panel margin-bottom
        if (leftPanel) {
            leftPanel.classList.remove('flipped');
        }

        kanjiDetail.style.display = 'none';
        kanjiDetail.parentElement.style.gap = '0';

        // Start the next question
        startQuiz();
    }
    
    // Show kanji details when correct or incorrect answer is chosen
    // reviewType: "review-correct" | "review-wrong" | undefined
    function showKanjiDetails(isIncorrect = false, reviewType = undefined) {
        // No need to hide kanji-display, flip animation will handle it

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
                    <span>${example.KanjiWord} ( ${example.KanaWord})</span>
                    <span>${example.EnglishWord}</span>
                `;

                examplesListElement.appendChild(exampleElement);
            }
        }

        // Set color for kanji-card
        const kanjiCard = kanjiDetail.querySelector('.kanji-card');
        if (kanjiCard) {
            kanjiCard.classList.remove('review-kanji-card', 'review-wrong-kanji-card');
            if (reviewType === "review-correct") {
                kanjiCard.classList.add('review-kanji-card');
                kanjiCard.classList.remove('incorrect-kanji-card');
                kanjiCard.classList.remove('correct-kanji-card');
            } else if (reviewType === "review-wrong") {
                kanjiCard.classList.add('review-wrong-kanji-card');
                kanjiCard.classList.remove('review-kanji-card');
                kanjiCard.classList.remove('correct-kanji-card');
                kanjiCard.classList.remove('incorrect-kanji-card');
            } else if (isIncorrect) {
                kanjiCard.classList.add('incorrect-kanji-card');
                kanjiCard.classList.remove('correct-kanji-card');
            } else {
                kanjiCard.classList.remove('incorrect-kanji-card');
                kanjiCard.classList.add('correct-kanji-card');
            }
        }

        // Set color for kanji-info-header
        const kanjiInfoHeader = kanjiDetail.querySelector('.kanji-info-header');
        if (kanjiInfoHeader) {
            if (isIncorrect) {
                kanjiInfoHeader.classList.add('incorrect-kanji-info-header');
                kanjiInfoHeader.classList.remove('correct-kanji-info-header');
            } else {
                kanjiInfoHeader.classList.remove('incorrect-kanji-info-header');
                kanjiInfoHeader.classList.add('correct-kanji-info-header');
            }
        }

        // Show kanji-detail in the flip back face (handled by CSS)
        kanjiDetail.style.display = 'flex';
    }
    
    // Show completion message when all kanji have been reviewed
    function showCompletionMessage() {
        // Hide kanji detail and question display if visible
        kanjiDetail.style.display = 'none';
        if (document.querySelector('.kanji-display')) {
            document.querySelector('.kanji-display').remove();
        }
        // Hide mode selectors and next button
        modeSelector.style.display = 'none';
        nextButtonContainer.style.display = 'none';
        questionModeSection.style.display = 'none';

        // Determine deck label for message
        let deckLabel = '';
        let storedQuizset = localStorage.getItem('jlpt_quizset') || 'n5';
        switch (storedQuizset) {
            case 'hiragana': deckLabel = 'Hiragana'; break;
            case 'katakana': deckLabel = 'Katakana'; break;
            case 'n5': deckLabel = 'JLPT N5 Kanji'; break;
            case 'n4': deckLabel = 'JLPT N4 Kanji'; break;
            case 'n3': deckLabel = 'JLPT N3 Kanji'; break;
            case 'n2': deckLabel = 'JLPT N2 Kanji'; break;
            case 'n1': deckLabel = 'JLPT N1 Kanji'; break;
            case 'custom': deckLabel = 'Custom Deck'; break;
            default: deckLabel = 'Kanji';
        }

        let wrongListHtml = '';
        if (wrongKanjiList.length > 0) {
            wrongListHtml = `
                <div style="margin-top:18px;text-align:left;">
                    <strong>Incorrect Kanji:</strong>
                    <ul style="margin:8px 0 0 18px;padding:0;">
                        ${wrongKanjiList.map(item =>
                            `<li><span style="font-size:1.5em;font-family:'Noto Sans JP',sans-serif;">${item.Kanji}</span>
                            <span style="font-size:1em;color:#555;">${item.Kana ? ' (' + item.Kana + ')' : ''}</span>
                            <span style="font-size:0.95em;color:#333;">${item.English ? ' - ' + item.English : ''}</span></li>`
                        ).join('')}
                    </ul>
                </div>
            `;
        }

        // Add dim background overlay for popup effect
        let overlay = document.createElement('div');
        overlay.className = 'completion-popup-overlay';
        document.body.appendChild(overlay);

        kanjiGrid.innerHTML = `
            <div class="completion-message">
                <h2>Congratulations!</h2>
                <p>You have completed all your ${deckLabel}.</p>
                <p>Score: ${correctCount}/${correctCount + incorrectCount}</p>
                ${wrongListHtml}
                <button id="restart-btn">Restart Quiz</button>
            </div>
        `;

        // Add pointer-events protection to background
        document.body.classList.add('completion-active');

        document.getElementById('restart-btn').addEventListener('click', () => {
            // Remove overlay and pointer-events protection before reload
            document.body.classList.remove('completion-active');
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
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
    
    // Initialize the quiz with responsive considerations
    function initializeQuiz() {
        // Always display question mode section at startup
        questionModeSection.style.display = 'flex';
        loadKanjiData();
    }
    
    // Start the quiz
    initializeQuiz();
});
