document.addEventListener('DOMContentLoaded', () => {

    // --- Generator Vorlagen mit Satzbausteinen ---
    const generatorTemplates = {
        draw: {
            adjectives: ["Ein neugieriger", "Ein schläfriger", "Ein winziger", "Ein riesiger", "Ein leuchtender", "Ein mechanischer", "Ein magischer", "Ein flauschiger", "Ein geometrischer"],
            subjects: ["Fuchs", "Roboter", "Kaktus", "Pilz", "Berg", "Wal", "Astronaut", "Ritter", "Geist", "Baum", "Kristall", "Panda", "Drache"],
            actions: ["liest ein Buch", "malt ein Bild", "tanzt im Regen", "repariert ein Raumschiff", "meditiert", "schwebt", "singt Opern", "kocht Tee", "spielt Schach", "baut eine Sandburg"],
            contexts: ["auf dem Mond", "in einer Unterwasserstadt", "in einem schwebenden Schloss", "in einem Wald aus Glas", "während eines Meteoritenschauers", "unter einem Sternenhimmel", "in einer Cyberpunk-Gasse", "auf einem riesigen Blatt", "in einer verlassenen Bibliothek", "auf einem Jahrmarkt"],
            styles: [" im Stil von Van Gogh", " als minimalistische Vektorgrafik", " in düsterer Atmosphäre", " mit Pastellfarben", " als Kohlezeichnung", " im Pixel-Art-Stil", " als Comic", ""], // Leerzeichen am Anfang für bessere Verbindung
            templates: [
                "{adjective} {subject} {action} {context}{style}.",
                "{adjective} {subject} {action}{style}.",
                "{adjective} {subject} {context}{style}.",
                "Stell dir vor: {adjective} {subject} {context}{style}.",
                "Fokus auf: {subject} {action}{style}.",
                "{subject} {action} unter einem {adjective} Himmel{style}."
            ]
        },
        music: {
            moods: ["Melancholische", "Euphorische", "Mysteriöse", "Treibende", "Verträumte", "Bedrohliche", "Epische", "Sanfte", "Verspielte"],
            elements: ["Sonate", "Fuge", "Nocturne", "Elegie", "Symphonie", "Rhapsodie", "Kadenz", "Melodie", "Harmonie", "Suite", "Präludium"],
            concepts: ["vergessener Sterne", "tanzender Schatten", "elektrischer Stille", "rostender Zeit", "kristallklarer Seen", "fallender Blätter", "urbaner Dschungel", "kosmischer Nebel", "innerer Stimmen", "des letzten Leuchtturms"],
            instruments: [" für Klavier", " für Streichquartett", " für Synthesizer", " für eine einsame Trompete", " für Orchester", " für eine Spieluhr", " mit Chor", " für Gitarre und Flöte", ""],
            templates: [
                "{mood} {elements} {concepts}{instruments}.", // Punkt am Ende für Konsistenz
                "{mood} {elements}.",
                "Die {elements} {concepts}{instruments}.",
                "{concepts}: Eine {mood} {elements}{instruments}.",
                "Titel: {mood} {elements}.",
                "{elements} {instruments}."
            ]
        },
        story: {
            protagonists: ["Ein Bibliothekar", "Eine Hexe", "Ein Roboter-Detektiv", "Ein Raumschiff-Kapitän", "Ein Bäcker", "Ein alter Fischer", "Eine junge Erfinderin", "Ein zeitreisender Historiker", "Ein sprechendes Tier", "Ein abtrünniger Spion"],
            actions: ["entdeckt ein Portal", "findet eine antike Karte", "erhält eine kryptische Nachricht", "muss ein Rätsel lösen", "verliert sein Gedächtnis", "tauscht den Körper", "schließt einen Pakt", "jagt einen Dieb", "sucht nach einem Heilmittel"],
            objectsOrTwists: ["eines verlorenen Tagebuchs", "einer singenden Pflanze", "eines magischen Amuletts", "einer Verschwörung", "eines Kometeneinschlags", "eines doppelten Spiels", "einer unerwarteten Freundschaft", "einer Prophezeiung", "eines Familiengeheimnisses"],
            settings: ["in einer Stadt unter der Erde", "auf einem fliegenden Schiff", "in einer Welt ohne Farben", "während einer endlosen Nacht", "in einer virtuellen Realität", "in der letzten Oase", "an Bord eines Geisterzugs", "in einer verbotenen Zone", "auf einem fremden Planeten"],
            templates: [
                "{protagonist}, der {actions}, stolpert über {objectsOrTwists} {settings}.",
                "{protagonist} {actions} {settings}.",
                "{settings}: {protagonist} {actions} wegen {objectsOrTwists}.",
                "Was wäre, wenn {protagonist} {actions} würde, aber {objectsOrTwists} eintritt?",
                "Die Geschichte von {protagonist}, der {actions}.",
                "In {settings}, muss {protagonist} {actions}."
            ]
        }
    };


    // --- Gamification State ---
    let counts = JSON.parse(localStorage.getItem('generatorCounts')) || {
        drawGenerated: 0, drawSaved: 0, musicGenerated: 0, musicSaved: 0, storyGenerated: 0, storySaved: 0, totalGenerated: 0
        // rareFound nicht mehr relevant
    };
    let achievements = JSON.parse(localStorage.getItem('userAchievements')) || {
        firstSpark: false, collectorHeartDraw: false, collectorHeartMusic: false, collectorHeartStory: false,
        kreativTrio: false, ideenMarathon: false // rareFind entfernt
    };

    const achievementMeta = { // Meta-Informationen für Erfolge (Titel, Icon)
        firstSpark: { title: "Erster Funke!", icon: "ph:sparkle-duotone" },
        collectorHeartDraw: { title: "Sammlerherz (Zeichnen)!", icon: "ph:paint-brush-duotone" },
        collectorHeartMusic: { title: "Sammlerherz (Musik)!", icon: "ph:music-notes-duotone" },
        collectorHeartStory: { title: "Sammlerherz (Story)!", icon: "ph:book-open-text-duotone" },
        kreativTrio: { title: "Kreativ-Trio!", icon: "ph:medal-duotone" },
        ideenMarathon: { title: "Ideen-Marathon!", icon: "ph:confetti-duotone" }
        // rareFind Meta entfernt
    };

    const toastContainer = document.getElementById('toast-container');

    // --- Hilfsfunktionen ---
    function saveProgress() {
        try {
            localStorage.setItem('generatorCounts', JSON.stringify(counts));
            localStorage.setItem('userAchievements', JSON.stringify(achievements));
        } catch (e) {
            console.error("Fehler beim Speichern des Fortschritts in localStorage:", e);
            // Evtl. Nutzer informieren, dass Fortschritt nicht gespeichert werden kann
        }
    }

    function showToast(achievementKey) {
        const meta = achievementMeta[achievementKey];
        if (!meta || !toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<iconify-icon icon="${meta.icon}"></iconify-icon><span>${meta.title}</span>`;
        toastContainer.appendChild(toast);

        requestAnimationFrame(() => { // Stellt sicher, dass das Element im DOM ist, bevor die Klasse hinzugefügt wird
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, 3500);
    }

    function updateAchievementUI(newlyUnlockedKey = null) {
        const achievementList = document.getElementById('achievement-list');
        if (!achievementList) return;

        Object.keys(achievementMeta).forEach(key => {
            const li = achievementList.querySelector(`li[data-achievement="${key}"]`);
            if (li) {
                li.classList.remove('newly-unlocked');
                if (achievements[key]) {
                    li.classList.add('unlocked');
                    li.classList.remove('locked');
                    if (key === newlyUnlockedKey) {
                        setTimeout(() => li.classList.add('newly-unlocked'), 50);
                    }
                } else {
                    li.classList.add('locked');
                    li.classList.remove('unlocked');
                }
            }
        });
        // Stelle sicher, dass das (jetzt entfernte) rareFind li nicht angezeigt wird
         const rareLi = achievementList.querySelector('li[data-achievement="rareFind"]');
         if(rareLi) rareLi.style.display = 'none';
    }

     function updateCounterUI() {
         const getEl = (id) => document.getElementById(id); // Kurzfunktion
         const drawGenCount = getEl('draw-generated-count');
         const drawSaveCount = getEl('draw-saved-count');
         const musicGenCount = getEl('music-generated-count');
         const musicSaveCount = getEl('music-saved-count');
         const storyGenCount = getEl('story-generated-count');
         const storySaveCount = getEl('story-saved-count');

         if (drawGenCount) drawGenCount.textContent = counts.drawGenerated;
         if (drawSaveCount) drawSaveCount.textContent = counts.drawSaved;
         if (musicGenCount) musicGenCount.textContent = counts.musicGenerated;
         if (musicSaveCount) musicSaveCount.textContent = counts.musicSaved;
         if (storyGenCount) storyGenCount.textContent = counts.storyGenerated;
         if (storySaveCount) storySaveCount.textContent = counts.storySaved;
     }


    function checkAchievements(type, action) {
        let achievementUnlocked = null;

        if (action === 'generated') {
            counts[`${type}Generated`]++;
            counts.totalGenerated++;
            if (!achievements.firstSpark) { achievements.firstSpark = true; achievementUnlocked = 'firstSpark'; }
            if (counts.totalGenerated >= 50 && !achievements.ideenMarathon) { achievements.ideenMarathon = true; achievementUnlocked = 'ideenMarathon'; }
        } else if (action === 'saved') {
            counts[`${type}Saved`]++;
            const key = `collectorHeart${type.charAt(0).toUpperCase() + type.slice(1)}`;
            // Prüfe, ob der Schlüssel im achievements Objekt existiert (wichtig, da rareFind entfernt wurde)
             if (achievements.hasOwnProperty(key) && counts[`${type}Saved`] >= 10 && !achievements[key]) {
                 achievements[key] = true; achievementUnlocked = key;
             }
        }
        // Kein rare_found Check mehr

        // Kombinations-Erfolge prüfen
        if (counts.drawSaved > 0 && counts.musicSaved > 0 && counts.storySaved > 0 && !achievements.kreativTrio) {
            achievements.kreativTrio = true; achievementUnlocked = 'kreativTrio';
        }

        if (achievementUnlocked) {
            saveProgress();
            updateAchievementUI(achievementUnlocked);
            showToast(achievementUnlocked);
        } else {
            saveProgress(); // Fortschritt (Zähler) trotzdem speichern
        }
        updateCounterUI(); // Zähler immer aktualisieren
    }

    function triggerConfetti(container) {
        const confettiContainer = container.querySelector('.confetti-container');
        if (!confettiContainer) return;
        confettiContainer.innerHTML = ''; // Alte entfernen

        for (let i = 0; i < 15; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}%`;
            const colorClassIndex = Math.floor(Math.random() * 5) + 1;
            confetti.classList.add(`c${colorClassIndex}`);
            confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
            confettiContainer.appendChild(confetti);
        }
    }

    // --- Generator Funktion (Kombinatorisch) ---
    function getRandomElement(arr) {
        if (!arr || arr.length === 0) return "";
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    function generateInfinitePrompt(type) {
        const templateSet = generatorTemplates[type];
        if (!templateSet || !templateSet.templates || templateSet.templates.length === 0) {
            console.error(`Keine Templates für Typ ${type} gefunden!`);
            return "Fehler: Generator-Vorlage nicht gefunden.";
        }

        let promptTemplate = getRandomElement(templateSet.templates);
        let generatedPrompt = promptTemplate;
        const placeholders = promptTemplate.match(/{\w+}/g); // Findet alle {wort}

        if (placeholders) {
            placeholders.forEach(placeholder => {
                const componentName = placeholder.slice(1, -1);
                // Korrekte Pluralbildung für den Zugriff auf die Liste
                const listName = componentName.endsWith('s') ? componentName : componentName + 's';
                const componentList = templateSet[listName];

                if (componentList) {
                    const randomComponent = getRandomElement(componentList);
                    generatedPrompt = generatedPrompt.replaceAll(placeholder, randomComponent);
                } else {
                    console.warn(`Keine Komponentenliste für "${listName}" im Typ "${type}" gefunden (Platzhalter: ${placeholder}).`);
                    generatedPrompt = generatedPrompt.replaceAll(placeholder, ""); // Platzhalter entfernen, falls Liste fehlt
                }
            });
        }

        // Bereinigung und Formatierung
        generatedPrompt = generatedPrompt.replace(/\s+/g, ' ').trim(); // Doppelte Leerzeichen -> einzelnes; trimmen
        if (generatedPrompt.length > 0) {
            generatedPrompt = generatedPrompt.charAt(0).toUpperCase() + generatedPrompt.slice(1); // Erster Buchstabe groß
            if (!/[.!?]$/.test(generatedPrompt)) { // Füge Punkt hinzu, wenn nötig
                generatedPrompt += '.';
            }
        }
        generatedPrompt = generatedPrompt.replace(/\s*,\s*/g, ', '); // Komma-Formatierung
        generatedPrompt = generatedPrompt.replace(/\s*(\.)/g, '$1'); // Leerzeichen vor Punkt entfernen
        generatedPrompt = generatedPrompt.replace(/\.{2,}/g, '.'); // Mehrfache Punkte -> einzelner Punkt

        return generatedPrompt;
    }


    // --- Generator Setup Funktion (nutzt generateInfinitePrompt) ---
    function setupGenerator(config) {
        const generateBtn = document.getElementById(config.generateBtnId);
        const resultArea = document.getElementById(config.resultAreaId);
        if (!generateBtn || !resultArea) {
            console.error(`Setup-Fehler ${config.type}: Button oder Ergebnisbereich fehlt.`); return;
        }
        const resultTextElement = resultArea.querySelector('.result-text');
        const saveBtn = document.getElementById(config.saveBtnId);
        const savedListElement = document.getElementById(config.savedListId);
         if (!resultTextElement || !saveBtn || !savedListElement) {
             console.error(`Setup-Fehler ${config.type}: Interne Elemente fehlen.`); return;
         }

        let currentResult = null;

        function displayResult(text) {
            currentResult = text;
            resultTextElement.textContent = text;
            resultTextElement.classList.remove('rare-result'); // Sicherstellen, dass kein Rare-Styling aktiv ist
            resultArea.classList.add('visible');
            saveBtn.style.opacity = '1';
            saveBtn.style.transform = 'translateY(-50%) scale(1)';
            saveBtn.style.color = ''; // Farbe zurücksetzen (falls vorher orange war)
            triggerConfetti(resultArea);
        }

        function loadSavedItems() {
            try {
                const items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
                updateSavedList(items);
            } catch (e) { console.error(`Ladefehler ${config.storageKey}:`, e); updateSavedList([]); }
        }

        function updateSavedList(items, newlySavedItem = null) {
            savedListElement.innerHTML = '';
            items.forEach((item, index) => {
                const li = document.createElement('li');
                li.textContent = item;
                if (item === newlySavedItem) {
                    li.classList.add('newly-saved');
                    setTimeout(() => li.classList.remove('newly-saved'), 1500);
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
             try {
                 const items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
                 if (!items.includes(currentResult)) {
                     items.push(currentResult);
                     localStorage.setItem(config.storageKey, JSON.stringify(items));
                     updateSavedList(items, currentResult);
                     animateSaveButton(true); // Erfolg
                     checkAchievements(config.type, 'saved');
                 } else {
                    animateSaveButton(false); // Duplikat
                 }
             } catch (e) { console.error(`Speicherfehler ${config.storageKey}:`, e); alert("Speichern fehlgeschlagen."); }
        }

         function deleteItem(indexToDelete) {
            try {
                let items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
                items.splice(indexToDelete, 1);
                localStorage.setItem(config.storageKey, JSON.stringify(items));
                updateSavedList(items);
                counts[`${config.type}Saved`] = items.length;
                // Kreativ-Trio ggf. neu prüfen (sowohl Sperren als auch Freischalten)
                checkAchievements(config.type, 'saved'); // Ruft implizit auch Trio-Check auf
                saveProgress(); // Speichere den aktualisierten Zählerstand
                updateCounterUI();
            } catch (e) { console.error(`Löschfehler ${config.storageKey}:`, e); }
        }

        function animateSaveButton(success) {
             saveBtn.style.transition = 'transform 0.1s ease-out, color 0.1s ease-out';
             saveBtn.style.transform = 'translateY(-50%) scale(1.2)';
             saveBtn.style.color = success ? 'var(--success-color)' : 'orange';
             setTimeout(() => {
                 saveBtn.style.transform = 'translateY(-50%) scale(1)';
                 saveBtn.style.color = '';
                 setTimeout(() => {
                     saveBtn.style.transition = 'opacity 0.3s ease-out, transform 0.2s ease-out, color 0.2s ease-out';
                 }, 100);
             }, 150);
        }

        generateBtn.addEventListener('click', () => {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<iconify-icon icon="eos-icons:loading" width="20" style="margin-right: 8px;"></iconify-icon> Generiere...';

            setTimeout(() => {
                // --- Generiere Prompt mit der neuen Funktion ---
                const generatedPrompt = generateInfinitePrompt(config.type);
                // ---

                displayResult(generatedPrompt); // Zeige Ergebnis an
                checkAchievements(config.type, 'generated'); // Melde Generierung für Gamification

                generateBtn.disabled = false;
                generateBtn.innerHTML = `<iconify-icon icon="${config.buttonIcon}" width="20" style="margin-right: 8px;"></iconify-icon> ${config.buttonText}`;
            }, 600); // Behalte Verzögerung für Ladeeffekt
        });

        saveBtn.addEventListener('click', saveItem);
        loadSavedItems(); // Initiale Liste laden
    }

    // --- Initialisierung der Generatoren ---
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
    if (typeof IntersectionObserver === 'function') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const gradient = entry.target.dataset.gradient;
                    if (gradient) {
                       document.documentElement.style.setProperty('--current-bg-gradient', gradient);
                    }
                }
            });
        }, { threshold: 0.6 });
        sections.forEach(section => observer.observe(section));
    } else {
        console.warn("IntersectionObserver nicht unterstützt.");
    }


    // --- Initiale UI Updates beim Laden ---
     updateCounterUI();
     updateAchievementUI();

}); // Ende DOMContentLoaded