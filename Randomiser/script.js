document.addEventListener('DOMContentLoaded', () => {

    // --- Platzhalter für Prompts (können beliebig erweitert werden) ---
    const drawPrompts = [
        "Ein Fuchs liest ein Buch im Wald",
        "Eine Katze fliegt auf einem Besen durch die Nacht",
        "Ein Roboter gießt Blumen auf dem Mars",
        "Ein Leuchtturm während eines Gewitters",
        "Ein magischer Baum mit leuchtenden Früchten",
        "Zwei Pinguine tanzen Tango auf einem Eisberg",
        "Ein Oktopus als Bibliothekar",
    ];
    const musicPrompts = [
        "Neonlichter im Regen",
        "Sonnenaufgang über den Bergen",
        "Verlorene Erinnerungen",
        "Tanz der Glühwürmchen",
        "Staubige Schallplatten",
        "Mitternachtszug ins Nirgendwo",
        "Flüstern des Windes",
    ];
    const storyPrompts = [
        "Eine Zeitreise geht schief, man landet im eigenen Kinderzimmer.",
        "Ein Detektiv findet heraus, dass sein Haustier der Hauptverdächtige ist.",
        "Die letzte Bibliothek der Welt wird von magischen Kreaturen bewacht.",
        "Ein Koch entdeckt ein Gewürz, das Emotionen hervorruft.",
        "Jemand erwacht auf einem Raumschiff, ohne Erinnerung, wie er dorthin kam.",
        "Zwei verfeindete Königreiche müssen durch eine arrangierte Heirat Frieden schließen.",
        "Eine alte Karte führt zu einem verborgenen Garten mitten in der Stadt.",
    ];

    // --- Funktion zur Initialisierung eines Generators ---
    function setupGenerator(config) {
        const generateBtn = document.getElementById(config.generateBtnId);
        const resultArea = document.getElementById(config.resultAreaId);
        const resultTextElement = resultArea.querySelector('.result-text');
        const saveBtn = document.getElementById(config.saveBtnId);
        const savedListElement = document.getElementById(config.savedListId);
        let currentResult = null; // Um das aktuelle Ergebnis für das Speichern zu halten

        // Funktion zum Anzeigen des Ergebnisses
        function displayResult(text) {
            currentResult = text; // Aktuelles Ergebnis merken
            resultTextElement.textContent = text;
            resultArea.classList.add('visible'); // Blendet Ergebnis ein (CSS Transition)
            // Save-Button erst jetzt sichtbar machen
            saveBtn.style.opacity = '1'; // Schneller als CSS für direktes Erscheinen
            saveBtn.style.transform = 'translateY(-50%) scale(1)';
        }

         // Funktion zum Laden gespeicherter Items
        function loadSavedItems() {
            const items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
            updateSavedList(items);
        }

        // Funktion zum Aktualisieren der Liste im DOM
        function updateSavedList(items) {
            savedListElement.innerHTML = ''; // Liste leeren
            items.forEach((item, index) => {
                const li = document.createElement('li');
                li.textContent = item;

                // Löschen-Button hinzufügen
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-item');
                deleteBtn.setAttribute('aria-label', `"${item}" löschen`);
                deleteBtn.innerHTML = '<iconify-icon icon="ph:trash-simple" width="18"></iconify-icon>';
                deleteBtn.onclick = () => deleteItem(index); // Index zum Löschen übergeben

                li.appendChild(deleteBtn);
                savedListElement.appendChild(li);
            });
        }

        // Funktion zum Speichern eines Items
        function saveItem() {
            if (!currentResult) return; // Nichts zu speichern
            const items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
            if (!items.includes(currentResult)) { // Duplikate vermeiden
                 items.push(currentResult);
                 localStorage.setItem(config.storageKey, JSON.stringify(items));
                 updateSavedList(items);
                 // Optional: Visuelles Feedback für erfolgreiches Speichern
                 animateSaveButton();
            } else {
                 // Optional: Hinweis, dass Item bereits gespeichert ist
                 alert('Dieses Element ist bereits gespeichert.');
            }
        }

        // Funktion zum Löschen eines Items
        function deleteItem(indexToDelete) {
            let items = JSON.parse(localStorage.getItem(config.storageKey)) || [];
            items = items.filter((_, index) => index !== indexToDelete); // Item am Index entfernen
            localStorage.setItem(config.storageKey, JSON.stringify(items));
            updateSavedList(items);
        }

        // Einfache Animation für den Speicher-Button nach Klick
        function animateSaveButton() {
            /*
            Vorschau-Beschreibung: Der Speicher-Icon pulsiert kurz nach erfolgreichem Speichern.
            Verwendete Technik: CSS Keyframes (oder JS-gesteuerte Transformation)
            Easing: easeOut (schnell rein, langsam raus)
            */
            saveBtn.style.transition = 'transform 0.1s ease-out'; // Kurzfristig Transition ändern
            saveBtn.style.transform = 'translateY(-50%) scale(1.2)'; // Größer werden
            setTimeout(() => {
                saveBtn.style.transform = 'translateY(-50%) scale(1)'; // Zurücksetzen
                 // Original-Transition wiederherstellen (falls unterschiedlich)
                 setTimeout(() => {
                    saveBtn.style.transition = 'opacity 0.3s ease-out, transform 0.2s ease-out';
                 }, 100);
            }, 100);
        }


        // Event Listener für Generieren-Button
        generateBtn.addEventListener('click', () => {
            // Optional: Ladeanimation starten
            generateBtn.disabled = true; // Button kurz deaktivieren
            generateBtn.innerHTML = '<iconify-icon icon="eos-icons:loading" width="20" style="margin-right: 8px;"></iconify-icon> Generiere...';

            // Kurze Verzögerung simulieren (für Ladeeffekt)
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * config.prompts.length);
                const randomPrompt = config.prompts[randomIndex];
                displayResult(randomPrompt);

                // Button wiederherstellen
                generateBtn.disabled = false;
                generateBtn.innerHTML = `<iconify-icon icon="${config.buttonIcon}" width="20" style="margin-right: 8px;"></iconify-icon> ${config.buttonText}`;

                // Optional: Confetti-Effekt hier auslösen
            }, 500); // 500ms Verzögerung
        });

        // Event Listener für Speichern-Button
        saveBtn.addEventListener('click', saveItem);

        // Beim Laden der Seite gespeicherte Items anzeigen
        loadSavedItems();
    }

    // --- Generatoren initialisieren ---
    setupGenerator({
        generateBtnId: 'generate-draw',
        resultAreaId: 'result-draw',
        saveBtnId: 'save-draw',
        savedListId: 'saved-list-draw',
        storageKey: 'draw-saved-items',
        prompts: drawPrompts,
        buttonIcon: 'ph:sparkle-fill',
        buttonText: 'Neues Motiv generieren'
    });

    setupGenerator({
        generateBtnId: 'generate-music',
        resultAreaId: 'result-music',
        saveBtnId: 'save-music',
        savedListId: 'saved-list-music',
        storageKey: 'music-saved-items',
        prompts: musicPrompts,
        buttonIcon: 'ph:music-notes-fill',
        buttonText: 'Neuen Titel generieren'
    });

    setupGenerator({
        generateBtnId: 'generate-story',
        resultAreaId: 'result-story',
        saveBtnId: 'save-story',
        savedListId: 'saved-list-story',
        storageKey: 'story-saved-items',
        prompts: storyPrompts,
        buttonIcon: 'ph:book-open-text-fill',
        buttonText: 'Neues Thema generieren'
    });


    // --- Intersection Observer für Hintergrundwechsel ---
    const sections = document.querySelectorAll('.generator-section');
    const options = {
        root: null, // Beobachtet Schnitte mit dem Viewport
        rootMargin: '0px',
        threshold: 0.6 // Wenn 60% der Section sichtbar sind
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const gradient = entry.target.dataset.gradient;
                // CSS Variable für den Body-Hintergrund aktualisieren
                document.documentElement.style.setProperty('--current-bg-gradient', gradient);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

}); // Ende DOMContentLoaded