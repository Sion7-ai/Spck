// script.js - Pulse Clash Spiel-Logik mit Phaser 3 (Code-Assets - Detailliertes Asset-Error-Handling - VOLLSTÄNDIG)

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM geladen. Pulse Clash Initialisierung startet...");

    // Referenzen zu HTML UI Elementen
    const body = document.body;
    const loader = document.getElementById('loader');
    const menuPanels = document.getElementById('menu-panels');
    const scoreElement = document.getElementById('score');
    const comboElement = document.getElementById('combo');
    const settingsIcon = document.getElementById('settings-icon-container');

    let gameInstance = null; // Hält die Phaser Spielinstanz
    let currentScore = 0;
    let currentCombo = 1;
    // Highscore aus localStorage laden (oder 0 wenn nicht vorhanden)
    let highscore = parseInt(localStorage.getItem('pulseClashHighscore') || '0');

    // Konstanten für Code-Assets
    const ENEMY_CYAN_KEY = 'enemy_shape_cyan';
    const ENEMY_MAGENTA_KEY = 'enemy_shape_magenta';
    const ORB_TEXTURE_KEY = 'orb_texture';
    const ENEMY_SIZE = 28;
    const ORB_RADIUS = 35;
    const PARTICLE_COUNT = 12;
    const PARTICLE_SIZE = 5;

    class GameScene extends Phaser.Scene {
        constructor() {
            super({ key: 'GameScene' });
            // Initialisiere alle Member-Variablen
            this.orb = null;
            this.enemies = null;
            this.spawnTimer = null;
            this.inputEnabled = false;
            this.baseSpawnInterval = 1600;
            this.minSpawnInterval = 450;
            this.spawnIntervalDecrease = 60;
            this.scoreToLevelUp = 150;
            this.lastLevelUpScore = 0;
            this.activeParticles = [];
            this.assetsGeneratedSuccessfully = false; // Flag für erfolgreiche Asset-Generierung
            this.startMenuShown = false;
        }

        preload() {
            console.log("Phaser: GameScene preload() started.");
            loader.textContent = 'Initializing Systems...';
             // Keine externen Assets laden
        }

        create() {
            console.log("Phaser: GameScene create() started.");
            this.cameras.main.setBackgroundColor('#050510');
            const centerX = this.cameras.main.width / 2;
            const centerY = this.cameras.main.height / 2;

            console.log("Attempting to generate game assets...");
            try {
                this.generateGameAssets(); // Erzeuge Orb- und Gegner-Texturen
                this.assetsGeneratedSuccessfully = true; // Setze Flag bei Erfolg
                console.log("Game assets generation completed successfully.");
            } catch (error) {
                 console.error("!!! CRITICAL ERROR during generateGameAssets !!!", error);
                 loader.textContent = 'Error creating assets!';
                 loader.style.color = 'red';
                 // Stoppe die weitere Ausführung von create(), da Assets fehlen
                 return;
            }

             // Nur fortfahren, wenn Assets erfolgreich generiert wurden
            if (!this.assetsGeneratedSuccessfully) {
                 console.error("Aborting create() because assets were not generated successfully.");
                 return;
             }

            console.log("Drawing background grid...");
            this.drawGrid(centerX, centerY);

            console.log("Creating Orb sprite...");
            try {
                this.orb = this.physics.add.sprite(centerX, centerY, ORB_TEXTURE_KEY)
                             .setCircle(ORB_RADIUS)
                             .setImmovable(true)
                             .setDepth(1);
                this.orb.body.onOverlap = true;
                console.log("Orb created.");
            } catch(error) {
                console.error("Error creating Orb sprite:", error);
                loader.textContent = 'Error creating Orb!'; return;
            }

            console.log("Creating Enemies group...");
             try {
                 this.enemies = this.physics.add.group({ maxSize: 50 });
                 console.log("Enemies group created.");
             } catch(error) {
                  console.error("Error creating Enemies group:", error);
                  loader.textContent = 'Error creating Enemies!'; return;
             }

            this.resetGameVariables();
            updateUI();

            this.inputEnabled = false;
            this.input.keyboard.on('keydown-A', () => this.handlePulse('left'));
            this.input.keyboard.on('keydown-D', () => this.handlePulse('right'));
            this.input.on('pointerdown', (pointer) => {
                if (!this.inputEnabled) return;
                if (pointer.x < this.cameras.main.width / 2) { this.handlePulse('left'); } else { this.handlePulse('right'); }
            });
            console.log("Input handlers set up.");

            this.physics.add.overlap(this.orb, this.enemies, this.enemyReachedOrb, null, this);
            console.log("Collision detection set up.");

            if (settingsIcon) {
                settingsIcon.addEventListener('click', () => {
                    if (this.inputEnabled && this.scene.isActive() && !this.scene.isPaused()) { this.pauseGame(); }
                });
                console.log("Settings icon listener added.");
            }

            // Übergang zum Startmenü
            if (this.assetsGeneratedSuccessfully && !this.startMenuShown) {
                 console.log("Initial setup complete. Removing loader and showing start menu...");
                 this.time.delayedCall(100, () => {
                      if(body.classList.contains('loading')) {
                           body.classList.remove('loading');
                           console.log("Loader class removed.");
                      } else {
                           console.warn("Loader class was already removed before timeout.");
                      }
                      this.showStartMenu();
                      this.startMenuShown = true;
                      console.log("Start menu should be visible.");
                 });
            } else {
                 console.error("Error: Could not transition to start menu. Assets generated:", this.assetsGeneratedSuccessfully, "Menu shown:", this.startMenuShown);
                 if (!body.classList.contains('loading')) {
                      menuPanels.innerHTML = `<h2>Error</h2><p>Initialization failed.</p>`;
                      body.classList.add('menu-visible');
                 } else {
                      loader.textContent = 'Initialization Error!';
                 }
            }
        } // Ende create()

        // --- Asset-Generierung mit detaillierter Fehlerbehandlung ---
        generateGameAssets() {
             console.log("generateGameAssets: Starting...");
             let graphics;
             try {
                 graphics = this.add.graphics();
                 if (!graphics) { throw new Error("Failed to get Graphics object from scene."); }
                 console.log("generateGameAssets: Graphics object obtained.");

                 let textureWidth, textureHeight;

                 // --- Orb ---
                 console.log("generateGameAssets: Generating Orb texture...");
                 graphics.fillStyle(0xcccccc, 1); graphics.fillCircle(ORB_RADIUS, ORB_RADIUS, ORB_RADIUS);
                 graphics.lineStyle(4, 0xffffff, 1); graphics.strokeCircle(ORB_RADIUS, ORB_RADIUS, ORB_RADIUS);
                 for (let i = 1; i <= 3; i++) { graphics.lineStyle(2, 0xffffff, 0.3 / i); graphics.strokeCircle(ORB_RADIUS, ORB_RADIUS, ORB_RADIUS + i * 3); }
                 textureWidth = ORB_RADIUS * 2 + 10; textureHeight = ORB_RADIUS * 2 + 10;
                 if (textureWidth <= 0 || textureHeight <= 0) throw new Error(`Invalid dimensions for Orb texture: ${textureWidth}x${textureHeight}`);
                 console.log(`generateGameAssets: Orb dimensions: ${textureWidth}x${textureHeight}`);
                 try { graphics.generateTexture(ORB_TEXTURE_KEY, textureWidth, textureHeight); console.log("generateGameAssets: Orb texture generated successfully."); }
                 catch (texError) { console.error(`generateGameAssets: FAILED to generate texture '${ORB_TEXTURE_KEY}'`, texError); throw texError; }
                 graphics.clear();

                 // --- Cyan Dreieck ---
                 console.log("generateGameAssets: Generating Cyan Triangle texture...");
                 graphics.fillStyle(0x00ffff, 1); graphics.lineStyle(3, 0xccffff, 1);
                 graphics.beginPath(); const triangleHeight = ENEMY_SIZE * Math.sqrt(3) / 2;
                 graphics.moveTo(ENEMY_SIZE / 2, -triangleHeight / 3 + triangleHeight/2); // Zentriert zeichnen
                 graphics.lineTo(ENEMY_SIZE, triangleHeight * 2 / 3 + triangleHeight/2);
                 graphics.lineTo(0, triangleHeight * 2 / 3 + triangleHeight/2);
                 graphics.closePath(); graphics.fillPath(); graphics.strokePath();
                 textureWidth = ENEMY_SIZE; textureHeight = Math.ceil(triangleHeight);
                 if (textureWidth <= 0 || textureHeight <= 0) throw new Error(`Invalid dimensions for Cyan Triangle texture: ${textureWidth}x${textureHeight}`);
                 console.log(`generateGameAssets: Cyan Triangle dimensions: ${textureWidth}x${textureHeight}`);
                 try { graphics.generateTexture(ENEMY_CYAN_KEY, textureWidth, textureHeight); console.log("generateGameAssets: Cyan Triangle texture generated successfully."); }
                 catch (texError) { console.error(`generateGameAssets: FAILED to generate texture '${ENEMY_CYAN_KEY}'`, texError); throw texError; }
                 graphics.clear();

                 // --- Magenta Quadrat ---
                 console.log("generateGameAssets: Generating Magenta Square texture...");
                 graphics.fillStyle(0xff00ff, 1); graphics.lineStyle(3, 0xffccff, 1);
                 // Zentriert zeichnen für generateTexture
                 const halfSize = ENEMY_SIZE / 2;
                 graphics.fillRect(-halfSize, -halfSize, ENEMY_SIZE, ENEMY_SIZE);
                 graphics.strokeRect(-halfSize, -halfSize, ENEMY_SIZE, ENEMY_SIZE);
                 textureWidth = ENEMY_SIZE; textureHeight = ENEMY_SIZE;
                 if (textureWidth <= 0 || textureHeight <= 0) throw new Error(`Invalid dimensions for Magenta Square texture: ${textureWidth}x${textureHeight}`);
                 console.log(`generateGameAssets: Magenta Square dimensions: ${textureWidth}x${textureHeight}`);
                 try { graphics.generateTexture(ENEMY_MAGENTA_KEY, textureWidth, textureHeight); console.log("generateGameAssets: Magenta Square texture generated successfully."); }
                 catch (texError) { console.error(`generateGameAssets: FAILED to generate texture '${ENEMY_MAGENTA_KEY}'`, texError); throw texError; }
                 graphics.clear();

                 console.log("generateGameAssets: Finished successfully.");

             } catch (error) {
                 console.error("generateGameAssets: General error during asset generation!", error);
                 this.assetsGeneratedSuccessfully = false;
                 throw error;
             } finally {
                 if (graphics) {
                     try { graphics.destroy(); console.log("generateGameAssets: Graphics object destroyed."); }
                     catch (destroyError) { console.error("Error destroying graphics object:", destroyError); }
                 }
             }
        } // Ende generateGameAssets()

        // --- Update-Schleife ---
        update(time, delta) {
            // Partikel aufräumen
            this.activeParticles = this.activeParticles.filter(p => {
                if (p && p.active) { return true; } // Behalte aktive Partikel
                else { if (p) p.destroy(); return false; } // Zerstöre inaktive und entferne aus Array
            });

            // Nur wenn Spiel aktiv ist
            if (!this.inputEnabled) return;

            // Gegner entfernen, die weit außerhalb des Bildschirms sind
            this.enemies.children.each(enemy => {
                const bounds = this.cameras.main.worldView;
                const margin = 100; // Zusätzlicher Rand
                if (enemy.active &&
                    (enemy.x > bounds.right + margin ||
                     enemy.x < bounds.left - margin ||
                     enemy.y > bounds.bottom + margin ||
                     enemy.y < bounds.top - margin))
                {
                    this.resetCombo();
                    enemy.disableBody(true, true); // Deaktivieren und verstecken
                }
            });

            // Schwierigkeit erhöhen basierend auf Score
            if (currentScore >= this.lastLevelUpScore + this.scoreToLevelUp) {
                this.increaseDifficulty();
                this.lastLevelUpScore = currentScore;
            }
        } // Ende update()

        // --- Spielzustandsfunktionen ---
        startGamePlay() {
            console.log("Starting Gameplay...");
            // Alte Gegner und Partikel entfernen
            this.enemies.clear(true, true);
            this.activeParticles.forEach(p => p.destroy());
            this.activeParticles = [];

            this.resetGameVariables(); // Score, Combo zurücksetzen
            this.lastLevelUpScore = 0; // Level-Up Zähler zurücksetzen
            this.currentSpawnInterval = this.baseSpawnInterval; // Startintervall setzen
            updateUI(); // HUD aktualisieren
            this.inputEnabled = true; // Eingabe erlauben
            body.classList.remove('menu-visible'); // Menü ausblenden

            // Startet den Spawn-Timer (oder startet ihn neu)
            if (this.spawnTimer) this.spawnTimer.remove(false);
            this.spawnTimer = this.time.addEvent({
                delay: this.currentSpawnInterval,
                callback: this.spawnEnemy,
                callbackScope: this,
                loop: true
            });
            console.log("Gameplay started. Spawn timer running.");
        }

        pauseGame() {
            if (!this.inputEnabled) return; // Nicht pausieren, wenn schon pausiert oder im Menü
            console.log("Pausing Game...");
            this.inputEnabled = false; // Eingabe sperren
            this.scene.pause(); // Pausiert Phaser-Szene (Update, Physik etc.)
            if (this.spawnTimer) this.spawnTimer.paused = true; // Timer anhalten
            this.enemies.getChildren().forEach(enemy => enemy.body?.stop()); // Physik-Bewegung stoppen
            this.showPauseMenu(); // Pause-Menü anzeigen
            console.log("Game paused.");
        }

        resumeGame() {
            console.log("Resuming Game...");
            body.classList.remove('menu-visible'); // Menü ausblenden
            this.inputEnabled = true; // Eingabe erlauben
            if (this.spawnTimer) this.spawnTimer.paused = false; // Timer fortsetzen
            this.scene.resume(); // Setzt Phaser-Szene fort
            console.log("Game resumed.");
        }

        gameOver() {
           // Verhindert mehrfaches Game Over, wenn z.B. zwei Gegner gleichzeitig treffen
           if (!this.inputEnabled && !this.startMenuShown) {
                console.log("Game Over prevented - game not running or already over.");
                return;
           }
           console.log("Game Over!");
           this.inputEnabled = false; // Eingabe sperren
           if (this.spawnTimer) this.spawnTimer.remove(false); // Timer komplett stoppen
           this.enemies.getChildren().forEach(enemy => enemy.body?.stop()); // Gegner anhalten

           if (currentScore > highscore) { // Highscore prüfen/speichern
               highscore = currentScore;
               localStorage.setItem('pulseClashHighscore', highscore.toString());
               console.log(`New Highscore saved: ${highscore}`);
           }
           this.showGameOverMenu(); // Game-Over-Menü anzeigen
        }

        resetGameVariables() {
            currentScore = 0;
            currentCombo = 1;
            updateUI(); // HUD direkt aktualisieren
        }

        // --- Gameplay-Logik ---
        spawnEnemy() {
            // Nicht spawnen, wenn pausiert, Game Over oder max. Gegner erreicht
            if (!this.inputEnabled || this.enemies.getLength() >= this.enemies.maxSize) return;

            const edgeMargin = 60; // Abstand vom Bildschirmrand
            let x, y;
            const edge = Phaser.Math.Between(0, 3); // Zufällige Kante (0: top, 1: right, 2: bottom, 3: left)

            // Position außerhalb des sichtbaren Bereichs bestimmen
             switch (edge) {
                 case 0: x = Phaser.Math.Between(edgeMargin, this.cameras.main.width - edgeMargin); y = -edgeMargin; break; // Top
                 case 1: x = this.cameras.main.width + edgeMargin; y = Phaser.Math.Between(edgeMargin, this.cameras.main.height - edgeMargin); break; // Right
                 case 2: x = Phaser.Math.Between(edgeMargin, this.cameras.main.width - edgeMargin); y = this.cameras.main.height + edgeMargin; break; // Bottom
                 case 3: x = -edgeMargin; y = Phaser.Math.Between(edgeMargin, this.cameras.main.height - edgeMargin); break; // Left
             }

            // Zufälligen Gegnertyp auswählen
            const enemyType = Phaser.Math.RND.pick(['cyan', 'magenta']);
            const textureKey = (enemyType === 'cyan') ? ENEMY_CYAN_KEY : ENEMY_MAGENTA_KEY;
            // Geschwindigkeit dynamisch basierend auf Schwierigkeit
            const baseSpeed = Phaser.Math.Between(130, 230);
            const difficultyBonus = (this.baseSpawnInterval - this.currentSpawnInterval) * 0.5;
            const speed = baseSpeed + difficultyBonus;

            // Gegner aus der Gruppe holen (oder neu erstellen)
            const enemy = this.enemies.get(x, y, textureKey);
            if (!enemy) return; // Pool ist voll oder Fehler

            // Gegner konfigurieren
            enemy.setActive(true).setVisible(true).setDepth(0); // Hinter dem Orb
            // Physik-Body anpassen (Kreis-Hitbox)
            const bodyRadius = ENEMY_SIZE * 0.55; // Hitbox etwas kleiner
            enemy.body.setCircle(bodyRadius);
            enemy.setData('type', enemyType); // Typ speichern für Trefferprüfung
            enemy.setData('speed', speed); // Geschwindigkeit speichern (optional)

            // Physik aktivieren und Ziel anvisieren
            this.physics.world.enable(enemy); // Sicherstellen, dass Physik aktiv ist
            enemy.body.setCollideWorldBounds(false); // Erlauben, außerhalb zu starten
            enemy.body.onOverlap = true; // Für Orb-Kollision

            // Bewegung zum Orb (Zielmitte)
            const angle = Phaser.Math.Angle.Between(x, y, this.orb.x, this.orb.y);
            this.physics.velocityFromRotation(angle, speed, enemy.body.velocity);
        }

        handlePulse(side) {
            if (!this.inputEnabled) return; // Nur wenn Eingabe erlaubt

            const requiredType = (side === 'left') ? 'cyan' : 'magenta';
            const pulseColor = (side === 'left') ? 0x00ffff : 0xff00ff;
            let hit = false; // Wurde ein Gegner getroffen?
            const hitRange = ORB_RADIUS + 70; // Reichweite des Pulses

            // --- Visuellen Puls-Effekt anzeigen ---
            const pulseCircle = this.add.circle(this.orb.x, this.orb.y, ORB_RADIUS, pulseColor, 0.1)
                                      .setStrokeStyle(3, pulseColor, 0.8)
                                      .setBlendMode('ADD')
                                      .setDepth(2); // Über Orb und Gegnern
            this.tweens.add({
                 targets: pulseCircle,
                 radius: hitRange * 1.1, // Expandiert über die Hit-Range
                 alpha: 0, strokeAlpha: 0, // Fade out
                 duration: 200, ease: 'Expo.easeOut',
                 onComplete: () => { pulseCircle.destroy(); } // Aufräumen
            });

            // --- Gegner im Zielbereich prüfen ---
            this.enemies.children.each(enemy => {
                if (!enemy.active || !enemy.body) return; // Nur aktive Gegner prüfen

                const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.orb.x, this.orb.y);
                const isOnCorrectSide = (side === 'left' && enemy.x < this.orb.x) || (side === 'right' && enemy.x >= this.orb.x);

                // Trefferbedingung
                if (distance < hitRange && enemy.getData('type') === requiredType && isOnCorrectSide) {
                    this.triggerHitEffect(enemy.x, enemy.y, pulseColor); // Partikel-Effekt
                    currentScore += 10 * currentCombo; // Punkte
                    currentCombo++; // Combo erhöhen
                    enemy.disableBody(true, true); // Gegner entfernen
                    hit = true;
                }
            });

            // --- Fehlschlag prüfen ---
            if (!hit) {
                 const enemyOnWrongSide = this.enemies.children.some(enemy => {
                     if (!enemy.active || !enemy.body) return false;
                      const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.orb.x, this.orb.y);
                      const isOnIncorrectSide = (side === 'left' && enemy.x >= this.orb.x) || (side === 'right' && enemy.x < this.orb.x);
                      return distance < hitRange && isOnIncorrectSide;
                 });
                 if (enemyOnWrongSide) { this.resetCombo(); } // Combo zurücksetzen bei falschem Puls
            }
            updateUI(); // UI aktualisieren
        }

        enemyReachedOrb(orb, enemy) {
             // Wird aufgerufen, wenn ein Gegner den Orb berührt
             if (!enemy.active || !enemy.body) return; // Nur einmal pro Gegner auslösen
             this.triggerHitEffect(enemy.x, enemy.y, 0xff4444, true); // Roter, stärkerer Effekt
             this.cameras.main.shake(250, 0.015); // Starker Screen Shake
             enemy.disableBody(true, true); // Gegner entfernen
             this.gameOver(); // Spiel beenden
        }

        // --- Partikel-Effekt mit Code-Grafiken ---
        triggerHitEffect(x, y, color, isOrbHit = false) {
            const count = isOrbHit ? PARTICLE_COUNT * 2.5 : PARTICLE_COUNT;
            const lifespan = isOrbHit ? 700 : 450;
            const baseSpeed = isOrbHit ? 180 : 120;

            for (let i = 0; i < count; i++) {
                const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
                const speedVariance = Phaser.Math.FloatBetween(0.7, 1.3);
                const distance = baseSpeed * speedVariance;
                const targetX = x + Math.cos(angle) * distance;
                const targetY = y + Math.sin(angle) * distance;

                // Kleines Kreis-Partikel erstellen
                const particle = this.add.circle(x, y, PARTICLE_SIZE, color, 0.9)
                                      .setStrokeStyle(1, 0xffffff, 0.5)
                                      .setBlendMode('ADD') // Leuchteffekt
                                      .setDepth(3); // Über allem

                this.activeParticles.push(particle); // Zum späteren Aufräumen hinzufügen

                // Tween für Animation (Bewegung, Fade, Schrumpfen)
                this.tweens.add({
                    targets: particle,
                    x: targetX, y: targetY,
                    alpha: 0, scale: 0,
                    angle: Phaser.Math.Between(-180, 180), // Leichte Drehung
                    duration: lifespan * Phaser.Math.FloatBetween(0.8, 1.2), // Dauer variieren
                    ease: 'Expo.easeOut',
                    onComplete: () => { particle.setActive(false); } // Markieren zum Aufräumen
                });
            }

            // Screen Shake (nur bei normalem Treffer)
            if (!isOrbHit) { this.cameras.main.shake(100, 0.006); }
        }

        resetCombo() {
            if (currentCombo > 1) { // Nur zurücksetzen, wenn Combo > 1 war
                currentCombo = 1;
                updateUI(); // HUD aktualisieren
                // Optional: Visuelles/Audio-Feedback für Combo-Reset
            }
        }

        increaseDifficulty() {
             // Verringert Spawn-Intervall (mindestens minSpawnInterval)
             this.currentSpawnInterval = Math.max(this.minSpawnInterval, this.currentSpawnInterval - this.spawnIntervalDecrease);
             console.log(`Level Up! Score: ${currentScore}. New Spawn Interval: ${this.currentSpawnInterval.toFixed(0)}ms`);
             // Timer mit neuer Rate aktualisieren
             if (this.spawnTimer) { this.spawnTimer.delay = this.currentSpawnInterval; }
             // Optional: Visuelles Feedback (z.B. Blitz)
             this.cameras.main.flash(300, 0, 255, 255, false); // Cyan-Blitz
        }

        // --- Hilfsfunktionen ---
        drawGrid(centerX, centerY) {
             // Zeichnet dynamisches Hintergrund-Grid
             const graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x151525, alpha: 0.7 } });
             const gridSize = 70;
             const width = this.cameras.main.width; const height = this.cameras.main.height;
             // Vertikale Linien
             for (let x = centerX - Math.floor(centerX / gridSize) * gridSize; x < width; x += gridSize) graphics.lineBetween(x, 0, x, height);
             for (let x = centerX - Math.ceil(centerX / gridSize) * gridSize; x > 0; x -= gridSize) graphics.lineBetween(x, 0, x, height);
             // Horizontale Linien
             for (let y = centerY - Math.floor(centerY / gridSize) * gridSize; y < height; y += gridSize) graphics.lineBetween(0, y, width, y);
             for (let y = centerY - Math.ceil(centerY / gridSize) * gridSize; y > 0; y -= gridSize) graphics.lineBetween(0, y, width, y);
             graphics.setDepth(-1); // Hinter alles legen
        }

        // --- Menü-Management Funktionen (HTML-Manipulation) ---
         showStartMenu() {
             menuPanels.innerHTML = `
                 <h2>Pulse Clash</h2>
                 <p>Highscore: ${highscore}</p>
                 <button id="start-game-button" class="menu-button">Start Game</button>
             `;
             body.classList.add('menu-visible'); // CSS-Klasse für Sichtbarkeit
             // Event Listener für Start-Button
             document.getElementById('start-game-button').onclick = () => this.startGamePlay();
         }

         showPauseMenu() {
             menuPanels.innerHTML = `
                 <h2>Paused</h2>
                 <button id="resume-game-button" class="menu-button">Resume</button>
                 <button id="quit-to-menu-button" class="menu-button">Quit to Menu</button>
             `;
             body.classList.add('menu-visible'); // Menü sichtbar
             // Event Listener
             document.getElementById('resume-game-button').onclick = () => this.resumeGame();
             document.getElementById('quit-to-menu-button').onclick = () => {
                 this.scene.stop(); // Szene komplett stoppen
                 this.inputEnabled = false; // Eingabe sicherheitshalber deaktivieren
                 this.startMenuShown = false; // Flag zurücksetzen für Neustart
                 this.showStartMenu(); // Zurück zum Startmenü
             };
         }

         showGameOverMenu() {
              menuPanels.innerHTML = `
                  <h2>Game Over</h2>
                  <p>Final Score: ${currentScore}</p>
                  <p>Highscore: ${highscore}</p>
                  <button id="restart-game-button" class="menu-button">Retry</button>
                  <button id="back-to-menu-button" class="menu-button">Main Menu</button>
              `;
              body.classList.add('menu-visible'); // Menü sichtbar
              // Event Listener
              document.getElementById('restart-game-button').onclick = () => this.startGamePlay(); // Neues Spiel
              document.getElementById('back-to-menu-button').onclick = () => this.showStartMenu(); // Zum Startmenü
         }

    } // Ende GameScene Class

    // --- Globale UI Update Funktion ---
    function updateUI() {
        if (scoreElement) scoreElement.textContent = `Score: ${currentScore}`;
        if (comboElement) comboElement.textContent = `Combo: x${currentCombo}`;
    }

    // --- Phaser Spielkonfiguration ---
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: 'game-container',
        canvas: document.getElementById('game-canvas'),
        backgroundColor: '#050510',
        physics: {
            default: 'arcade',
            arcade: { debug: false }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: [GameScene] // Unsere Spielszene einbinden
    };

    // --- Spiel starten ---
    console.log("Creating Phaser Game instance with config:", config);
    try {
        gameInstance = new Phaser.Game(config); // Erzeugt die Spielinstanz
        console.log("Phaser Game instance created successfully.");
    } catch (error) {
         console.error("!!! CRITICAL: Failed to create Phaser Game instance !!!", error);
         loader.textContent = 'Error creating game!'; // Fehler im HTML anzeigen
         loader.style.color = 'red';
    }

    // Optional: Fenstergrößenänderung behandeln
    window.addEventListener('resize', () => {
        if (gameInstance && gameInstance.isBooted) {
            // FIT Modus sollte das handhaben, ggf. explizit:
            // gameInstance.scale.resize(window.innerWidth, window.innerHeight);
        }
    });

}); // Ende DOMContentLoaded Event Listener