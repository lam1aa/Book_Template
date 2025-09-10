// Drag and Drop Question Implementation for JupyterQuiz
class DragDropQuestion extends Question {
    constructor(qa, id, idx, opts, rootDiv) { 
        super(qa, id, idx, opts, rootDiv);
        this.draggedElement = null;
    }
    
    render() {
        console.log("Rendering Drag and Drop Question:", this.id);
        // Create main containers
        const mainContainer = document.createElement('div');
        mainContainer.className = 'drag-drop-main';
        
        // Create descriptions container with drop zones
        const descriptionsContainer = document.createElement('div');
        descriptionsContainer.className = 'descriptions-container';
        
        const descriptionsTitle = document.createElement('div');
        descriptionsTitle.className = 'descriptions-title';
        descriptionsTitle.textContent = 'Beschreibungen:';
        descriptionsContainer.appendChild(descriptionsTitle);
        
        // Create description zones
        this.qa.descriptions.forEach((desc, index) => {
            const descZone = this.createDescriptionZone(desc, index);
            descriptionsContainer.appendChild(descZone);
        });
        
        // Create options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        
        const optionsTitle = document.createElement('div');
        optionsTitle.className = 'options-title';
        optionsTitle.textContent = 'Optionen: (Ziehen Sie diese zu den passenden Beschreibungen)';
        optionsContainer.appendChild(optionsTitle);
        
        const optionsList = document.createElement('div');
        optionsList.className = 'options-list';
        optionsList.id = `${this.id}_options`;
        
        // Create shuffled draggable options
        const shuffledOptions = this.shuffleArray(
            this.qa.options.map((option, index) => ({ option, index }))
        );
        
        shuffledOptions.forEach(item => {
            const draggableOption = this.createDraggableOption(item.option, item.index);
            optionsList.appendChild(draggableOption);
        });
        
        optionsContainer.appendChild(optionsList);
        
        // Create controls
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'quiz-controls';
        
        const checkButton = document.createElement('button');
        checkButton.className = 'quiz-button';
        checkButton.textContent = 'Antwort prüfen';
        checkButton.onclick = () => this.checkAnswer();
        
        const resetButton = document.createElement('button');
        resetButton.className = 'quiz-button reset-button';
        resetButton.textContent = 'Zurücksetzen';
        resetButton.onclick = () => this.resetQuiz();
        
        controlsContainer.appendChild(checkButton);
        controlsContainer.appendChild(resetButton);
        
        // Assemble everything
        mainContainer.appendChild(descriptionsContainer);
        mainContainer.appendChild(optionsContainer);
        mainContainer.appendChild(controlsContainer);
        
        this.aDiv.appendChild(mainContainer);
        this.wrapper.appendChild(this.fbDiv);
        
        // Initialize drag and drop events
        this.initializeDragEvents();
        this.setupDropEventListeners();
    }
    
    createDescriptionZone(description, index) {
        console.log("Creating description zone:", description);
        const descZone = document.createElement('div');
        descZone.className = 'description-zone';
        
        const descLabel = document.createElement('div');
        descLabel.className = 'description-label';
        descLabel.innerHTML = jaxify(description); // Use jupyterquiz's jaxify function
        
        const dropArea = document.createElement('div');
        dropArea.className = 'drop-area';
        dropArea.dataset.zoneId = index;
        dropArea.id = `${this.id}_drop_${index}`;
        
        const placeholder = document.createElement('span');
        placeholder.className = 'drop-placeholder';
        placeholder.textContent = 'Hier ablegen';
        dropArea.appendChild(placeholder);
        
        descZone.appendChild(descLabel);
        descZone.appendChild(dropArea);
        
        return descZone;
    }
    
    createDraggableOption(option, index) {
        const draggableOption = document.createElement('div');
        draggableOption.className = 'draggable-option';
        draggableOption.draggable = true;
        draggableOption.dataset.itemId = index;
        draggableOption.id = `${this.id}_option_${index}`;
        draggableOption.innerHTML = jaxify(option); // Support LaTeX/markdown
        
        return draggableOption;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    initializeDragEvents() {
        const draggableOptions = this.aDiv.querySelectorAll('.draggable-option');
        
        draggableOptions.forEach(option => {
            option.addEventListener('dragstart', (e) => {
                this.draggedElement = option;
                option.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', option.outerHTML);
            });
            
            option.addEventListener('dragend', (e) => {
                option.classList.remove('dragging');
            });
        });
    }
    
    setupDropEventListeners() {
        const dropAreas = this.aDiv.querySelectorAll('.drop-area');
        
        dropAreas.forEach(area => {
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('drag-over');
            });
            
            area.addEventListener('dragleave', (e) => {
                area.classList.remove('drag-over');
            });
            
            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('drag-over');
                
                if (this.draggedElement) {
                    // Clear the drop area
                    area.innerHTML = '';
                    
                    // Create dropped item
                    const droppedItem = document.createElement('div');
                    droppedItem.className = 'dropped-item';
                    droppedItem.innerHTML = this.draggedElement.innerHTML;
                    droppedItem.dataset.itemId = this.draggedElement.dataset.itemId;
                    
                    // Add click listener to return item
                    droppedItem.addEventListener('click', () => {
                        this.returnItemToOriginal(droppedItem);
                    });
                    
                    area.appendChild(droppedItem);
                    
                    // Remove original
                    this.draggedElement.remove();
                    this.draggedElement = null;
                    
                    // Auto-check if all items are placed
                    this.checkAnswer();
                }
            });
        });
    }
    
    returnItemToOriginal(droppedItem) {
        const optionsList = this.aDiv.querySelector(`#${this.id}_options`);
        
        // Create new draggable option
        const newDraggableOption = this.createDraggableOption(
            droppedItem.innerHTML, 
            droppedItem.dataset.itemId
        );
        
        optionsList.appendChild(newDraggableOption);
        
        // Restore placeholder in drop zone
        const dropArea = droppedItem.parentElement;
        dropArea.innerHTML = '<span class="drop-placeholder">Hier ablegen</span>';
        
        // Re-initialize drag events
        this.initializeDragEvents();
        this.setupDropEventListeners();
    }
    
    checkAnswer() {
        let correctCount = 0;
        const totalPairs = Object.keys(this.qa.correct_mapping).length;
        
        // Convert correct_mapping to indices for checking
        const descToIdx = {};
        this.qa.descriptions.forEach((desc, idx) => {
            descToIdx[desc] = idx;
        });
        
        const optToIdx = {};
        this.qa.options.forEach((opt, idx) => {
            optToIdx[opt] = idx;
        });
        
        // Check each mapping
        Object.entries(this.qa.correct_mapping).forEach(([desc, correctOpt]) => {
            const descIdx = descToIdx[desc];
            const correctOptIdx = optToIdx[correctOpt];
            
            const dropArea = this.aDiv.querySelector(`#${this.id}_drop_${descIdx}`);
            const droppedItem = dropArea.querySelector('.dropped-item');
            
            if (droppedItem && parseInt(droppedItem.dataset.itemId) === correctOptIdx) {
                correctCount++;
            }
        });
        
        // Update feedback using jupyterquiz patterns
        if (correctCount === totalPairs) {
            this.fbDiv.innerHTML = "Perfekt! Alle Zuordnungen sind korrekt!";
            this.fbDiv.className = "Feedback correct";
            this.fbDiv.dataset.answeredcorrect = 1;
        } else if (correctCount === 0) {
            this.fbDiv.innerHTML = "Leider sind keine Zuordnungen korrekt. Versuchen Sie es noch einmal!";
            this.fbDiv.className = "Feedback incorrect";
            this.fbDiv.dataset.answeredcorrect = 0;
        } else {
            this.fbDiv.innerHTML = `Teilweise richtig: ${correctCount} von ${totalPairs} Zuordnungen sind korrekt.`;
            this.fbDiv.className = "Feedback partial";
            this.fbDiv.dataset.answeredcorrect = 0;
        }
        
        // Preserve response for jupyterquiz
        this.preserveResponse(this.getCurrentState());
        
        // Trigger MathJax typesetting
        this.typeset(this.fbDiv);
    }
    
    getCurrentState() {
        const state = {};
        const dropAreas = this.aDiv.querySelectorAll('.drop-area');
        
        dropAreas.forEach((area, zoneIdx) => {
            const droppedItem = area.querySelector('.dropped-item');
            if (droppedItem) {
                state[zoneIdx] = parseInt(droppedItem.dataset.itemId);
            }
        });
        
        return state;
    }
    
    resetQuiz() {
        // Clear all drop areas
        const dropAreas = this.aDiv.querySelectorAll('.drop-area');
        dropAreas.forEach(area => {
            area.innerHTML = '<span class="drop-placeholder">Hier ablegen</span>';
        });
        
        // Clear feedback
        this.fbDiv.innerHTML = '';
        this.fbDiv.className = 'Feedback';
        
        // Re-create shuffled options
        const optionsList = this.aDiv.querySelector(`#${this.id}_options`);
        optionsList.innerHTML = '';
        
        const shuffledOptions = this.shuffleArray(
            this.qa.options.map((option, index) => ({ option, index }))
        );
        
        shuffledOptions.forEach(item => {
            const draggableOption = this.createDraggableOption(item.option, item.index);
            optionsList.appendChild(draggableOption);
        });
        
        // Re-initialize events
        this.initializeDragEvents();
        this.setupDropEventListeners();
    }
}

// Register the new question type
Question.register('drag_drop', DragDropQuestion);