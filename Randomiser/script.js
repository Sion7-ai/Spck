document.addEventListener('DOMContentLoaded', () => {

    // --- Prompt-Daten (Beispiele, erweiterbar) ---
    const promptsData = {
        draw: {
            common: [
                "Ein Fuchs liest ein Buch im Wald", "Eine Katze fliegt auf einem Besen", "Ein Leuchtturm im Sturm",
                "Ein magischer Baum", "Pinguine tanzen Tango", "Ein Oktopus als Bibliothekar"
            ],
            rare: [ // Seltenere, vielleicht spezifischere oder absurdere Ideen
                "Ein Astronaut reitet ein Seepferdchen im All",
                "Ein Kaktus strickt einen Pullover",
                "Ein Roboter-Einhorn auf einer Blumenwiese"
            ]
        },
        music: {
            common: [
                "Neonlichter im Regen", "Sonnenaufgang über den Bergen", "Verlorene Erinnerungen",
                "Tanz der Glühwürmchen", "Staubige Schallplatten", "Mitternachtszug ins Nirgendwo"
            ],
            rare: [
                "Das Flüstern eines vergessenen Sterns",
                "Sinfonie einer rostenden Maschine",
                "Der Geschmack von elektrischem Ozon"
            ]
        },
        story: {
            common: [
                "Zeitreise ins eigene Kinderzimmer.", "Haustier ist Hauptverdächtiger.", "Letzte Bibliothek der Welt.",
                "Koch entdeckt Emotions-Gewürz.", "Erwachen auf Raumschiff ohne Erinnerung.",
                "Arrangierte Heirat zwischen Königreichen.", "Karte zu verborgenem Garten."
            ],
            rare: [
                "Die Schatten beginnen, eigene Geschichten zu erzählen.",
                "Eine Stadt, in der Erinnerungen Währung sind.",
                "Ein Leuchtturm, der Schiffe in andere Dimensionen lenkt."
            ]
        }
    };

    // --- Gamification State (aus localStorage laden oder initialisieren) ---
    let counts = JSON.parse(localStorage.getItem('generatorCounts')) || {
        drawGenerated: 0, drawSaved: 0, musicGenerated: 0, musicSaved: 0, storyGenerated: 0, storySaved: 0, totalGenerated: 0, rareFound: 0
    };
    let achievements = JSON.parse(localStorage.getItem('userAchievements')) || {
        firstSpark: false, collectorHeartDraw: false, collectorHeartMusic: false, collectorHeartStory: false,
        kreativTrio: false, ideenMarathon: false, rareFind: false
    };

    const achievementMeta = { // Für Toast-Nachrichten und UI-Updates
        firstSpark: { title: "Erster Funke!", icon: "ph:sparkle-duotone" },
        collectorHeartDraw: { title: "Sammlerherz (Zeichnen)!", icon: "ph:paint-brush-duotone" },
        collectorHeartMusic: { title: "Sammlerherz (Musik)!", icon: "ph:music-notes-duotone" },
        collectorHeartStory: { title: "Sammlerherz (Story)!", icon: "ph:book-open-text-duotone" },
        kreativTrio: { title: "Kreativ-Trio!", icon: "ph:medal-duotone" },
        ideenMarathon: { title: "Ideen-Marathon!", icon: "ph:confetti-duotone" },
        rareFind: { title: "Seltener Fund!", icon: "ph:star-four-duotone" }
    };

    const toastContainer = document.getElementById('toast-container');

    // --- Hilfsfunktionen ---
    function saveProgress() {
        localStorage.setItem('generatorCounts', JSON.stringify(counts));
        localStorage.setItem('userAchievements', JSON.stringify(achievements));
    }

    function showToast(achievementKey) {
        const meta = achievementMeta[achievementKey];
        if (!meta) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <iconify-icon icon="${meta.icon}"></iconify-icon>
            <span>${meta.title}</span>
        `;
        toastContainer.appendChild(toast);

        // Force reflow to enable transition
        void toast.offsetWidth;

        toast.classList.add('show');

        // Nach einiger Zeit wieder entfernen
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 500); // Warten bis Transition vorbei ist
        }, 3500); // 3.5 Sekunden sichtbar
    }

    function updateAchievementUI(newlyUnlockedKey = null) {
        const achievementList = document.getElementById('achievement-list');
        if (!achievementList) return;

        Object.keys(achievements).forEach(key => {
            const li = achievementList.querySelector(`li[data-achievement="${key}"]`);
            if (li) {
                li.classList.remove('newly-unlocked'); // Reset pulse effect
                if (achievements[key]) {
                    li.classList.add('unlocked');
                    li.classList.remove('locked'); // Explizit entfernen, falls CSS es braucht
                     if (key === newlyUnlockedKey) {
                         // Kurze Verzögerung, damit der Übergang von locked zu unlocked abgeschlossen ist
                         setTimeout(() => li.classList.add('newly-unlocked'), 50);
                    }
                } else {
                    li.classList.add('locked');
                    li.classList.remove('unlocked');
                }
            }
        });
    }

     function updateCounterUI() {
         document.getElementById('draw-generated-count').textContent = counts.drawGenerated;
         document.getElementById('draw-saved-count').textContent = counts.drawSaved;
         document.getElementById('music-generated-count').textContent = counts.musicGenerated;
         document.getElementById('music-saved-count').textContent = counts.musicSaved;
         document.getElementById('story-generated-count').textContent = counts.storyGenerated;
         document.getElementById('story-saved-count').textContent = counts.storySaved;
     }


    function checkAchievements(type, action) {
        let achievementUnlocked = null; // Trackt, ob *dieser* Aufruf einen Erfolg freischaltete

        if (action === 'generated') {
            counts[`${type}Generated`]++;
            counts.totalGenerated++;
            if (!achievements.firstSpark) { achievements.firstSpark = true; achievementUnlocked = 'firstSpark'; }
            if (counts.totalGenerated >= 50 && !achievements.ideenMarathon) { achievements.ideenMarathon = true; achievementUnlocked = 'ideenMarathon'; }
        } else if (action === 'saved') {
            counts[`${type}Saved`]++;
            const key = `collectorHeart${type.charAt(0).toUpperCase() + type.slice(1)}`;
             if (counts[`${type}Saved`] >= 10 && !achievements[key]) { achievements[key] = true; achievementUnlocked = key; }
        } else if (action === 'rare_found') {
             counts.rareFound++;
             if (!achievements.rareFind) { achievements.rareFind = true; achievementUnlocked = 'rareFind'; }
        }

        // Kombinations-Erfolge prüfen
        if (counts.drawSaved > 0 && counts.musicSaved > 0 && counts.storySaved > 0 && !achievements.kreativTrio) {
            achievements.kreativTrio = true; achievementUnlocked = 'kreativTrio';
        }

        if (achievementUnlocked) {
            saveProgress();
            updateAchievementUI(achievementUnlocked); // Badge hervorheben
            showToast(achievementUnlocked); // Benachrichtigung anzeigen
        } else {
            saveProgress(); // Auch speichern, wenn kein Erfolg erzielt wurde (für Zähler)
        }
        updateCounterUI(); // Zähler immer aktualisieren
    }

     // Funktion für Confetti-Effekt
    function triggerConfetti(container) {
        const confettiContainer = container.querySelector('.confetti-container');
        if (!confettiContainer) return;

        for (let i = 0; i < 15; i++) { // 15 Partikel
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            // Zufällige Startposition und Klasse für Farbe/Delay
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.classList.add(`c${Math.floor(Math.random() * 6)}`); // Klassen c0-c5
            confetti.style.animationDuration = `${2 + Math.random() * 2}s`; // Variation in Fallzeit

            confettiContainer.appendChild(confetti);

            // Partikel nach Animation entfernen
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }

    // --- Generator Setup Funktion ---
    function setupGenerator(config) {
        const generateBtn = document.getElementById(config.generateBtnId);
        const resultArea = document.getElementById(config.resultAreaId);
        const resultTextElement = resultArea.querySelector('.result-text');
        const saveBtn = document.getElementById(config.saveBtnId);
        const savedListElement = document.getElementById(config.savedListId);
        let currentResult = null;
        let isRare = false;

        function displayResult(text, rare = false) {
            currentResult = text;
            isRare = rare; // Merken ob selten für Speichern etc.
            resultTextElement.textContent = text;
            resultTextElement.classList.toggle('rare-result', rare); // Klasse für seltenes Styling
            resultArea.classList.add('visible');
            saveBtn.style.opacity = '1';
            saveBtn.style.transform = 'translateY(-50%) scale(1)';

             // Confetti bei Generierung!
            triggerConfetti(resultArea);
        }

        function loadSavedItems() {
            const items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
            updateSavedList(items);
        }

        function updateSavedList(items, newlySavedItem = null) {
            savedListElement.innerHTML = '';
            items.forEach((item, index) => {
                const li = document.createElement('li');
                li.textContent = item;
                if (item === newlySavedItem) {
                    li.classList.add('newly-saved'); // Highlight für neues Item
                    setTimeout(() => li.classList.remove('newly-saved'), 1500); // Highlight entfernen
                }

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-item');
                deleteBtn.setAttribute('aria-label', `"${item}" löschen`);
                deleteBtn.innerHTML = '<iconify-icon icon="ph:trash-simple" width="18"></iconify-icon>';
                deleteBtn.onclick = () => deleteItem(index);
                li.appendChild(deleteBtn);
                savedListElement.appendChild(li);
            });
        }

        function saveItem() {
            if (!currentResult) return;
            const items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
            if (!items.includes(currentResult)) {
                 items.push(currentResult);
                 localStorage.setItem(config.storageKey, JSON.stringify(items));
                 updateSavedList(items, currentResult); // Übergebe das neue Item für Highlight
                 animateSaveButton();
                 checkAchievements(config.type, 'saved'); // Erfolg prüfen
            } else {
                 // Feedback, dass schon gespeichert
                 saveBtn.style.color = 'orange';
                 setTimeout(() => saveBtn.style.color = '', 1000);
            }
        }

         function deleteItem(indexToDelete) {
            let items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
            items.splice(indexToDelete, 1); // Item am Index entfernen
            localStorage.setItem(config.storageKey, JSON.stringify(items));
            updateSavedList(items);
            // Zähler anpassen (wird nicht automatisch durch checkAchievements gemacht)
            counts[`${config.type}Saved`] = items.length;
            saveProgress();
            updateCounterUI();
        }

        function animateSaveButton() {
            saveBtn.style.transition = 'transform 0.1s ease-out, color 0.1s ease-out';
            saveBtn.style.transform = 'translateY(-50%) scale(1.2)';
            saveBtn.style.color = var(--success-color); // Grün färben
            setTimeout(() => {
                saveBtn.style.transform = 'translateY(-50%) scale(1)';
                saveBtn.style.color = ''; // Farbe zurücksetzen
                setTimeout(() => {
                    saveBtn.style.transition = 'opacity 0.3s ease-out, transform 0.2s ease-out, color 0.2s ease-out';
                }, 100);
            }, 150);
        }

        generateBtn.addEventListener('click', () => {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<iconify-icon icon="eos-icons:loading" width="20" style="margin-right: 8px;"></iconify-icon> Generiere...';

            setTimeout(() => {
                let randomPrompt;
                let rare = false;
                const promptSet = promptsData[config.type];
                const rareChance = 0.15; // 15% Chance auf seltenen Prompt

                if (promptSet.rare.length > 0 && Math.random() < rareChance) {
                    const randomIndex = Math.floor(Math.random() * promptSet.rare.length);
                    randomPrompt = promptSet.rare[randomIndex];
                    rare = true;
                    checkAchievements(config.type, 'rare_found'); // Seltenen Fund melden
                } else {
                    const randomIndex = Math.floor(Math.random() * promptSet.common.length);
                    randomPrompt = promptSet.common[randomIndex];
                }

                displayResult(randomPrompt, rare);
                checkAchievements(config.type, 'generated'); // Generierung melden

                generateBtn.disabled = false;
                generateBtn.innerHTML = `<iconify-icon icon="${config.buttonIcon}" width="20" style="margin-right: 8px;"></iconify-icon> ${config.buttonText}`;
            }, 600); // Etwas längere Ladezeit für besseren Effekt
        });

        saveBtn.addEventListener('click', saveItem);
        loadSavedItems();
    }

    // --- Initialisierung ---
    setupGenerator({
        type: 'draw', generateBtnId: 'generate-draw', resultAreaId: 'result-draw', saveBtnId: 'save-draw',
        savedListId: 'saved-list-draw', storageKey: 'draw-saved-items', buttonIcon: 'ph:sparkle-fill', buttonText: 'Neues Motiv generieren'
    });
    setupGenerator({
        type: 'music', generateBtnId: 'generate-music', resultAreaId: 'result-music', saveBtnId: 'save-music',
        savedListId: 'saved-list-music', storageKey: 'music-saved-items', buttonIcon: 'ph:music-notes-fill', buttonText: 'Neuen Titel generieren'
    });
    setupGenerator({
        type: 'story', generateBtnId: 'generate-story', resultAreaId: 'result-story', saveBtnId: 'save-story',
        savedListId: 'saved-list-story', storageKey: 'story-saved-items', buttonIcon: 'ph:book-open-text-fill', buttonText: 'Neues Thema generieren'
    });

    // --- Intersection Observer für Hintergrund ---
    const sections = document.querySelectorAll('.generator-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const gradient = entry.target.dataset.gradient;
                document.documentElement.style.setProperty('--current-bg-gradient', gradient);
            }
        });
    }, { threshold: 0.6 });
    sections.forEach(section => observer.observe(section));

    // --- Initiale UI Updates beim Laden ---
     updateCounterUI();
     updateAchievementUI(); // Zeigt den aktuellen Stand der Erfolge an

}); // Ende DOMContentLoaded