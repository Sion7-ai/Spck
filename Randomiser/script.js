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
        if (!meta || !toastContainer) return; // Sicherstellen, dass Container existiert

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
            // Warten bis CSS-Transition vorbei ist, bevor Element entfernt wird
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
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
                    li.classList.remove('locked');
                     if (key === newlyUnlockedKey) {
                         // Kurze Verzögerung für den Übergang von locked zu unlocked
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
         // Sicherstellen, dass die Elemente existieren, bevor man darauf zugreift
         const drawGenCount = document.getElementById('draw-generated-count');
         const drawSaveCount = document.getElementById('draw-saved-count');
         const musicGenCount = document.getElementById('music-generated-count');
         const musicSaveCount = document.getElementById('music-saved-count');
         const storyGenCount = document.getElementById('story-generated-count');
         const storySaveCount = document.getElementById('story-saved-count');

         if (drawGenCount) drawGenCount.textContent = counts.drawGenerated;
         if (drawSaveCount) drawSaveCount.textContent = counts.drawSaved;
         if (musicGenCount) musicGenCount.textContent = counts.musicGenerated;
         if (musicSaveCount) musicSaveCount.textContent = counts.musicSaved;
         if (storyGenCount) storyGenCount.textContent = counts.storyGenerated;
         if (storySaveCount) storySaveCount.textContent = counts.storySaved;
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

        confettiContainer.innerHTML = ''; // Alte Confetti entfernen

        for (let i = 0; i < 15; i++) { // 15 Partikel
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            // Zufällige Startposition und Klasse für Farbe/Delay
            confetti.style.left = `${Math.random() * 100}%`;
            const colorClassIndex = Math.floor(Math.random() * 5) + 1; // Index 1-5
            confetti.classList.add(`c${colorClassIndex}`);
            confetti.style.animationDuration = `${2 + Math.random() * 2}s`; // Variation in Fallzeit

            confettiContainer.appendChild(confetti);

            // Partikel nach Animation entfernen (wird jetzt durch innerHTML = '' oben erledigt)
            // confetti.addEventListener('animationend', () => confetti.remove(), { once: true });
        }
    }

    // --- Generator Setup Funktion ---
    function setupGenerator(config) {
        const generateBtn = document.getElementById(config.generateBtnId);
        const resultArea = document.getElementById(config.resultAreaId);
        // Sicherstellen, dass Elemente existieren
        if (!generateBtn || !resultArea) {
            console.error(`Fehler beim Setup für ${config.type}: Button oder Ergebnisbereich nicht gefunden.`);
            return;
        }
        const resultTextElement = resultArea.querySelector('.result-text');
        const saveBtn = document.getElementById(config.saveBtnId);
        const savedListElement = document.getElementById(config.savedListId);
        // Auch hier prüfen
         if (!resultTextElement || !saveBtn || !savedListElement) {
             console.error(`Fehler beim Setup für ${config.type}: Interne Elemente (Text, Speichern, Liste) nicht gefunden.`);
             return;
         }

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
            saveBtn.style.color = ''; // Reset Farbe von potentiellem "schon gespeichert" Feedback

             // Confetti bei Generierung!
            triggerConfetti(resultArea);
        }

        function loadSavedItems() {
            try {
                const items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
                updateSavedList(items);
            } catch (e) {
                console.error(`Fehler beim Laden von ${config.storageKey} aus localStorage:`, e);
                updateSavedList([]); // Leere Liste anzeigen bei Fehler
            }
        }

        function updateSavedList(items, newlySavedItem = null) {
            savedListElement.innerHTML = '';
            items.forEach((item, index) => {
                const li = document.createElement('li');
                li.textContent = item; // Setzt den Text sicher (verhindert XSS falls item HTML enthält)

                if (item === newlySavedItem) {
                    li.classList.add('newly-saved'); // Highlight für neues Item
                    setTimeout(() => li.classList.remove('newly-saved'), 1500); // Highlight entfernen
                }

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-item');
                deleteBtn.setAttribute('aria-label', `"${item}" löschen`); // Korrektes Label für Screenreader
                deleteBtn.innerHTML = '<iconify-icon icon="ph:trash-simple" width="18"></iconify-icon>'; // Sicher, da fester String
                deleteBtn.onclick = () => deleteItem(index);
                li.appendChild(deleteBtn);
                savedListElement.appendChild(li);
            });
        }

        function saveItem() {
            if (!currentResult) return;
             try {
                 const items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
                 if (!items.includes(currentResult)) {
                     items.push(currentResult);
                     localStorage.setItem(config.storageKey, JSON.stringify(items));
                     updateSavedList(items, currentResult); // Übergebe das neue Item für Highlight
                     animateSaveButton(true); // Erfolg=true
                     checkAchievements(config.type, 'saved'); // Erfolg prüfen
                 } else {
                    // Feedback, dass schon gespeichert
                    animateSaveButton(false); // Erfolg=false
                 }
             } catch (e) {
                 console.error(`Fehler beim Speichern in ${config.storageKey}:`, e);
                 alert("Speichern fehlgeschlagen. Ist vielleicht der Speicher voll?");
             }
        }

         function deleteItem(indexToDelete) {
            try {
                let items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
                items.splice(indexToDelete, 1); // Item am Index entfernen
                localStorage.setItem(config.storageKey, JSON.stringify(items));
                updateSavedList(items);
                // Zähler anpassen
                counts[`${config.type}Saved`] = items.length;
                saveProgress();
                updateCounterUI();
                // Überprüfe Kreativ-Trio erneut, falls es vorher erfüllt war
                if (!achievements.kreativTrio && counts.drawSaved > 0 && counts.musicSaved > 0 && counts.storySaved > 0) {
                     checkAchievements(config.type, 'saved'); // Ruft checkAchievements erneut auf
                } else if (achievements.kreativTrio && (counts.drawSaved === 0 || counts.musicSaved === 0 || counts.storySaved === 0)) {
                    // Optional: Erfolg wieder "sperren", falls Bedingung nicht mehr gilt
                    // achievements.kreativTrio = false; saveProgress(); updateAchievementUI();
                }

            } catch (e) {
                console.error(`Fehler beim Löschen aus ${config.storageKey}:`, e);
            }
        }

        function animateSaveButton(success) {
             saveBtn.style.transition = 'transform 0.1s ease-out, color 0.1s ease-out';
             saveBtn.style.transform = 'translateY(-50%) scale(1.2)';
             saveBtn.style.color = success ? 'var(--success-color)' : 'orange'; // Grün bei Erfolg, Orange bei Duplikat
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
            resultTextElement.classList.remove('rare-result'); // Styling zurücksetzen

            setTimeout(() => {
                let randomPrompt = "Fehler beim Generieren"; // Fallback
                let rare = false;
                const promptSet = promptsData[config.type];
                const rareChance = 0.15; // 15% Chance

                // Sicherheitschecks für Prompt-Daten
                if (promptSet && promptSet.common && promptSet.common.length > 0) {
                    if (promptSet.rare && promptSet.rare.length > 0 && Math.random() < rareChance) {
                        const randomIndex = Math.floor(Math.random() * promptSet.rare.length);
                        randomPrompt = promptSet.rare[randomIndex];
                        rare = true;
                        checkAchievements(config.type, 'rare_found');
                    } else {
                        const randomIndex = Math.floor(Math.random() * promptSet.common.length);
                        randomPrompt = promptSet.common[randomIndex];
                    }
                } else {
                    console.error(`Keine gültigen Prompts für Typ ${config.type} gefunden!`);
                }

                displayResult(randomPrompt, rare);
                checkAchievements(config.type, 'generated');

                generateBtn.disabled = false;
                generateBtn.innerHTML = `<iconify-icon icon="${config.buttonIcon}" width="20" style="margin-right: 8px;"></iconify-icon> ${config.buttonText}`;
            }, 600);
        });

        saveBtn.addEventListener('click', saveItem);
        loadSavedItems(); // Initiale Liste laden
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
    if (typeof IntersectionObserver === 'function') { // Prüfen ob IntersectionObserver unterstützt wird
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const gradient = entry.target.dataset.gradient;
                    if (gradient) { // Sicherstellen, dass ein Gradient definiert ist
                       document.documentElement.style.setProperty('--current-bg-gradient', gradient);
                    }
                }
            });
        }, { threshold: 0.6 });
        sections.forEach(section => observer.observe(section));
    } else {
        // Fallback, falls IntersectionObserver nicht unterstützt wird (z.B. sehr alte Browser)
         console.warn("IntersectionObserver wird nicht unterstützt, dynamischer Hintergrundwechsel deaktiviert.");
    }


    // --- Initiale UI Updates beim Laden ---
     updateCounterUI();
     updateAchievementUI(); // Zeigt den aktuellen Stand der Erfolge an

}); // Ende DOMContentLoaded