// script.js - Pulse Clash Spiel-Logik mit Phaser 3 (Zurück zu GameScene - VOLLSTÄNDIG)

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

    // --- Die vollständige GameScene Klasse ---
    class GameScene extends Phaser.Scene {
        constructor() {
            super({ key: 'GameScene' });
            // Initialisiere alle Member-Variablen
            this.orb = null; this.enemies = null; this.spawnTimer = null; this.inputEnabled = false;
            this.baseSpawnInterval = 1600; this.minSpawnInterval = 450; this.spawnIntervalDecrease = 60;
            this.scoreToLevelUp = 150; this.lastLevelUpScore = 0; this.activeParticles = [];
            this.assetsGeneratedSuccessfully = false; this.startMenuShown = false;
        }

        preload() {
            console.log("Phaser: GameScene preload() started.");
            loader.textContent = 'Initializing Systems...';
             // Keine externen Assets laden
        }

        create() {
            console.log("Phaser: GameScene create() started.");
            this.cameras.main.setBackgroundColor('#050510');
            const centerX = this.cameras.main.width / 2; const centerY = this.cameras.main.height / 2;

            console.log("Attempting to generate game assets...");
            try {
                this.generateGameAssets(); // Erzeuge Orb- und Gegner-Texturen
                this.assetsGeneratedSuccessfully = true; // Setze Flag bei Erfolg
                console.log("Game assets generation completed successfully.");
            } catch (error) {
                 console.error("!!! CRITICAL ERROR during generateGameAssets !!!", error);
                 loader.textContent = 'Error creating assets!'; loader.style.color = 'red'; return;
            }
            if (!this.assetsGeneratedSuccessfully) { console.error("Aborting create() because assets were not generated successfully."); return; }

            console.log("Drawing background grid..."); this.drawGrid(centerX, centerY);
            console.log("Creating Orb sprite...");
            try {
                this.orb = this.physics.add.sprite(centerX, centerY, ORB_TEXTURE_KEY).setCircle(ORB_RADIUS).setImmovable(true).setDepth(1);
                this.orb.body.onOverlap = true; console.log("Orb created.");
            } catch(error) { console.error("Error creating Orb sprite:", error); loader.textContent = 'Error creating Orb!'; return; }
            console.log("Creating Enemies group...");
             try { this.enemies = this.physics.add.group({ maxSize: 50 }); console.log("Enemies group created."); }
             catch(error) { console.error("Error creating Enemies group:", error); loader.textContent = 'Error creating Enemies!'; return; }

            this.resetGameVariables(); updateUI(); this.inputEnabled = false;
            this.input.keyboard.on('keydown-A', () => this.handlePulse('left')); this.input.keyboard.on('keydown-D', () => this.handlePulse('right'));
            this.input.on('pointerdown', (pointer) => { if (!this.inputEnabled) return; if (pointer.x < this.cameras.main.width / 2) { this.handlePulse('left'); } else { this.handlePulse('right'); } });
            console.log("Input handlers set up.");
            this.physics.add.overlap(this.orb, this.enemies, this.enemyReachedOrb, null, this); console.log("Collision detection set up.");
            if (settingsIcon) { settingsIcon.addEventListener('click', () => { if (this.inputEnabled && this.scene.isActive() && !this.scene.isPaused()) { this.pauseGame(); } }); console.log("Settings icon listener added."); }

            // Übergang zum Startmenü (wichtig: am Ende von create!)
            if (this.assetsGeneratedSuccessfully && !this.startMenuShown) {
                 console.log("Initial setup complete. Removing loader and showing start menu...");
                 // Kurze Verzögerung, um sicherzustellen, dass alles gerendert ist
                 this.time.delayedCall(100, () => {
                      if(body.classList.contains('loading')) { // Prüfen, ob Klasse noch da ist
                           body.classList.remove('loading'); // Loader ausblenden
                           console.log("Loader class removed.");
                      } else {
                           console.warn("Loader class was already removed before timeout.");
                      }
                      this.showStartMenu(); // Startmenü anzeigen (fügt 'menu-visible' hinzu)
                      this.startMenuShown = true;
                      console.log("Start menu should be visible.");
                 });
            } else {
                 // Fallback, falls etwas schiefgeht
                 console.error("Error: Could not transition to start menu. Assets generated:", this.assetsGeneratedSuccessfully, "Menu shown:", this.startMenuShown);
                 if (!body.classList.contains('loading')) { menuPanels.innerHTML = `<h2>Error</h2><p>Initialization failed.</p>`; body.classList.add('menu-visible'); }
                 else { loader.textContent = 'Initialization Error!'; }
            }
        } // Ende create()

        // --- Asset-Generierung mit detaillierter Fehlerbehandlung ---
        generateGameAssets() {
             console.log("generateGameAssets: Starting...");
             let graphics;
             try {
                 graphics = this.add.graphics(); if (!graphics) { throw new Error("Failed to get Graphics object from scene."); }
                 console.log("generateGameAssets: Graphics object obtained."); let textureWidth, textureHeight;

                 // Orb
                 console.log("generateGameAssets: Generating Orb texture...");
                 graphics.fillStyle(0xcccccc, 1); graphics.fillCircle(ORB_RADIUS, ORB_RADIUS, ORB_RADIUS); graphics.lineStyle(4, 0xffffff, 1); graphics.strokeCircle(ORB_RADIUS, ORB_RADIUS, ORB_RADIUS);
                 for (let i = 1; i <= 3; i++) { graphics.lineStyle(2, 0xffffff, 0.3 / i); graphics.strokeCircle(ORB_RADIUS, ORB_RADIUS, ORB_RADIUS + i * 3); }
                 textureWidth = ORB_RADIUS * 2 + 10; textureHeight = ORB_RADIUS * 2 + 10; if (textureWidth <= 0 || textureHeight <= 0) throw new Error(`Invalid dimensions for Orb texture: ${textureWidth}x${textureHeight}`);
                 try { graphics.generateTexture(ORB_TEXTURE_KEY, textureWidth, textureHeight); console.log("generateGameAssets: Orb texture generated successfully."); } catch (texError) { console.error(`generateGameAssets: FAILED to generate texture '${ORB_TEXTURE_KEY}'`, texError); throw texError; } graphics.clear();

                 // Cyan Dreieck
                 console.log("generateGameAssets: Generating Cyan Triangle texture...");
                 graphics.fillStyle(0x00ffff, 1); graphics.lineStyle(3, 0xccffff, 1); graphics.beginPath(); const triangleHeight = ENEMY_SIZE * Math.sqrt(3) / 2; textureWidth = ENEMY_SIZE; textureHeight = Math.ceil(triangleHeight);
                 graphics.moveTo(textureWidth / 2, textureHeight / 2 - triangleHeight / 2); graphics.lineTo(textureWidth / 2 + ENEMY_SIZE / 2, textureHeight / 2 + triangleHeight / 2); graphics.lineTo(textureWidth / 2 - ENEMY_SIZE / 2, textureHeight / 2 + triangleHeight / 2);
                 graphics.closePath(); graphics.fillPath(); graphics.strokePath(); if (textureWidth <= 0 || textureHeight <= 0) throw new Error(`Invalid dimensions for Cyan Triangle texture: ${textureWidth}x${textureHeight}`);
                 try { graphics.generateTexture(ENEMY_CYAN_KEY, textureWidth, textureHeight); console.log("generateGameAssets: Cyan Triangle texture generated successfully."); } catch (texError) { console.error(`generateGameAssets: FAILED to generate texture '${ENEMY_CYAN_KEY}'`, texError); throw texError; } graphics.clear();

                 // Magenta Quadrat
                 console.log("generateGameAssets: Generating Magenta Square texture...");
                 graphics.fillStyle(0xff00ff, 1); graphics.lineStyle(3, 0xffccff, 1); textureWidth = ENEMY_SIZE; textureHeight = ENEMY_SIZE; const halfSize = ENEMY_SIZE / 2;
                 graphics.fillRect(-halfSize, -halfSize, ENEMY_SIZE, ENEMY_SIZE); graphics.strokeRect(-halfSize, -halfSize, ENEMY_SIZE, ENEMY_SIZE); if (textureWidth <= 0 || textureHeight <= 0) throw new Error(`Invalid dimensions for Magenta Square texture: ${textureWidth}x${textureHeight}`);
                 try { graphics.generateTexture(ENEMY_MAGENTA_KEY, textureWidth, textureHeight); console.log("generateGameAssets: Magenta Square texture generated successfully."); } catch (texError) { console.error(`generateGameAssets: FAILED to generate texture '${ENEMY_MAGENTA_KEY}'`, texError); throw texError; } graphics.clear();

                 console.log("generateGameAssets: Finished successfully.");
             } catch (error) { console.error("generateGameAssets: General error during asset generation!", error); this.assetsGeneratedSuccessfully = false; throw error;
             } finally { if (graphics) { try { graphics.destroy(); console.log("generateGameAssets: Graphics object destroyed."); } catch (destroyError) { console.error("Error destroying graphics object:", destroyError); } } }
        } // Ende generateGameAssets()

        // --- Update-Schleife ---
        update(time, delta) {
            this.activeParticles = this.activeParticles.filter(p => { if (p && p.active) { return true; } else { if (p) p.destroy(); return false; } });
            if (!this.inputEnabled) return;
            this.enemies.children.each(enemy => { const bounds = this.cameras.main.worldView; const margin = 100; if (enemy.active && (enemy.x > bounds.right + margin || enemy.x < bounds.left - margin || enemy.y > bounds.bottom + margin || enemy.y < bounds.top - margin)) { this.resetCombo(); enemy.disableBody(true, true); } });
            if (currentScore >= this.lastLevelUpScore + this.scoreToLevelUp) { this.increaseDifficulty(); this.lastLevelUpScore = currentScore; }
        } // Ende update()

        // --- Spielzustandsfunktionen ---
        startGamePlay() {
            console.log("Starting Gameplay..."); this.enemies.clear(true, true); this.activeParticles.forEach(p => p.destroy()); this.activeParticles = [];
            this.resetGameVariables(); this.lastLevelUpScore = 0; this.currentSpawnInterval = this.baseSpawnInterval; updateUI(); this.inputEnabled = true; body.classList.remove('menu-visible');
            if (this.spawnTimer) this.spawnTimer.remove(false); this.spawnTimer = this.time.addEvent({ delay: this.currentSpawnInterval, callback: this.spawnEnemy, callbackScope: this, loop: true }); console.log("Gameplay started. Spawn timer running.");
        }

        pauseGame() {
            if (!this.inputEnabled) return; console.log("Pausing Game..."); this.inputEnabled = false; this.scene.pause(); if (this.spawnTimer) this.spawnTimer.paused = true;
            this.enemies.getChildren().forEach(enemy => enemy.body?.stop()); this.showPauseMenu(); console.log("Game paused.");
        }

        resumeGame() {
            console.log("Resuming Game..."); body.classList.remove('menu-visible'); this.inputEnabled = true; if (this.spawnTimer) this.spawnTimer.paused = false;
            this.scene.resume(); console.log("Game resumed.");
        }

        gameOver() {
           if (!this.startMenuShown && !this.inputEnabled) { console.log("Game Over prevented - game not running or already over."); return; }
           console.log("Game Over!"); this.inputEnabled = false; if (this.spawnTimer) this.spawnTimer.remove(false); this.enemies.getChildren().forEach(enemy => enemy.body?.stop());
           if (currentScore > highscore) { highscore = currentScore; localStorage.setItem('pulseClashHighscore', highscore.toString()); console.log(`New Highscore saved: ${highscore}`); } this.showGameOverMenu();
        }

        resetGameVariables() { currentScore = 0; currentCombo = 1; updateUI(); }

        // --- Gameplay-Logik ---
        spawnEnemy() {
            if (!this.inputEnabled || this.enemies.getLength() >= this.enemies.maxSize) return;
            const edgeMargin = 60; let x, y; const edge = Phaser.Math.Between(0, 3);
            switch (edge) {
                 case 0: x = Phaser.Math.Between(edgeMargin, this.cameras.main.width - edgeMargin); y = -edgeMargin; break; case 1: x = this.cameras.main.width + edgeMargin; y = Phaser.Math.Between(edgeMargin, this.cameras.main.height - edgeMargin); break;
                 case 2: x = Phaser.Math.Between(edgeMargin, this.cameras.main.width - edgeMargin); y = this.cameras.main.height + edgeMargin; break; case 3: x = -edgeMargin; y = Phaser.Math.Between(edgeMargin, this.cameras.main.height - edgeMargin); break;
             }
            const enemyType = Phaser.Math.RND.pick(['cyan', 'magenta']); const textureKey = (enemyType === 'cyan') ? ENEMY_CYAN_KEY : ENEMY_MAGENTA_KEY; const baseSpeed = Phaser.Math.Between(130, 230); const difficultyBonus = (this.baseSpawnInterval - this.currentSpawnInterval) * 0.5; const speed = baseSpeed + difficultyBonus;
            const enemy = this.enemies.get(x, y, textureKey); if (!enemy) return;
            enemy.setActive(true).setVisible(true).setDepth(0); const bodyRadius = ENEMY_SIZE * 0.55; enemy.body.setCircle(bodyRadius); enemy.setData('type', enemyType); enemy.setData('speed', speed);
            this.physics.world.enable(enemy); enemy.body.setCollideWorldBounds(false); enemy.body.onOverlap = true; const angle = Phaser.Math.Angle.Between(x, y, this.orb.x, this.orb.y); this.physics.velocityFromRotation(angle, speed, enemy.body.velocity);
        }

        handlePulse(side) {
            if (!this.inputEnabled) return;
            const requiredType = (side === 'left') ? 'cyan' : 'magenta'; const pulseColor = (side === 'left') ? 0x00ffff : 0xff00ff; let hit = false; const hitRange = ORB_RADIUS + 70;
            const pulseCircle = this.add.circle(this.orb.x, this.orb.y, ORB_RADIUS, pulseColor, 0.1).setStrokeStyle(3, pulseColor, 0.8).setBlendMode('ADD').setDepth(2);
            this.tweens.add({ targets: pulseCircle, radius: hitRange * 1.1, alpha: 0, strokeAlpha: 0, duration: 200, ease: 'Expo.easeOut', onComplete: () => { pulseCircle.destroy(); } });
            this.enemies.children.each(enemy => { if (!enemy.active || !enemy.body) return; const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.orb.x, this.orb.y); const isOnCorrectSide = (side === 'left' && enemy.x < this.orb.x) || (side === 'right' && enemy.x >= this.orb.x); if (distance < hitRange && enemy.getData('type') === requiredType && isOnCorrectSide) { this.triggerHitEffect(enemy.x, enemy.y, pulseColor); currentScore += 10 * currentCombo; currentCombo++; enemy.disableBody(true, true); hit = true; } });
            if (!hit) { const enemyOnWrongSide = this.enemies.children.some(enemy => { if (!enemy.active || !enemy.body) return false; const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.orb.x, this.orb.y); const isOnIncorrectSide = (side === 'left' && enemy.x >= this.orb.x) || (side === 'right' && enemy.x < this.orb.x); return distance < hitRange && isOnIncorrectSide; }); if (enemyOnWrongSide) { this.resetCombo(); } } updateUI();
        }

        enemyReachedOrb(orb, enemy) {
             if (!enemy.active || !enemy.body) return; this.triggerHitEffect(enemy.x, enemy.y, 0xff4444, true); this.cameras.main.shake(250, 0.015); enemy.disableBody(true, true); this.gameOver();
        }

        triggerHitEffect(x, y, color, isOrbHit = false) {
             const count = isOrbHit ? PARTICLE_COUNT * 2.5 : PARTICLE_COUNT; const lifespan = isOrbHit ? 700 : 450; const baseSpeed = isOrbHit ? 180 : 120;
             for (let i = 0; i < count; i++) { const angle = Phaser.Math.FloatBetween(0, Math.PI * 2); const speedVariance = Phaser.Math.FloatBetween(0.7, 1.3); const distance = baseSpeed * speedVariance; const targetX = x + Math.cos(angle) * distance; const targetY = y + Math.sin(angle) * distance; const particle = this.add.circle(x, y, PARTICLE_SIZE, color, 0.9).setStrokeStyle(1, 0xffffff, 0.5).setBlendMode('ADD').setDepth(3); this.activeParticles.push(particle); this.tweens.add({ targets: particle, x: targetX, y: targetY, alpha: 0, scale: 0, angle: Phaser.Math.Between(-180, 180), duration: lifespan * Phaser.Math.FloatBetween(0.8, 1.2), ease: 'Expo.easeOut', onComplete: () => { particle.setActive(false); } }); }
             if (!isOrbHit) { this.cameras.main.shake(100, 0.006); }
         }

        resetCombo() { if (currentCombo > 1) { currentCombo = 1; updateUI(); } }

        increaseDifficulty() {
              this.currentSpawnInterval = Math.max(this.minSpawnInterval, this.currentSpawnInterval - this.spawnIntervalDecrease); console.log(`Level Up! Score: ${currentScore}. New Spawn Interval: ${this.currentSpawnInterval.toFixed(0)}ms`);
              if (this.spawnTimer) { this.spawnTimer.delay = this.currentSpawnInterval; } this.cameras.main.flash(300, 0, 255, 255, false);
         }

        drawGrid(centerX, centerY) {
             const graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x151525, alpha: 0.7 } }); const gridSize = 70; const width = this.cameras.main.width; const height = this.cameras.main.height;
             for (let x = centerX - Math.floor(centerX / gridSize) * gridSize; x < width; x += gridSize) graphics.lineBetween(x, 0, x, height); for (let x = centerX - Math.ceil(centerX / gridSize) * gridSize; x > 0; x -= gridSize) graphics.lineBetween(x, 0, x, height);
             for (let y = centerY - Math.floor(centerY / gridSize) * gridSize; y < height; y += gridSize) graphics.lineBetween(0, y, width, y); for (let y = centerY - Math.ceil(centerY / gridSize) * gridSize; y > 0; y -= gridSize) graphics.lineBetween(0, y, width, y);
             graphics.setDepth(-1);
        }

        // --- Menü-Management Funktionen ---
         showStartMenu() {
             menuPanels.innerHTML = `<h2>Pulse Clash</h2><p>Highscore: ${highscore}</p><button id="start-game-button" class="menu-button">Start Game</button>`;
             body.classList.add('menu-visible'); document.getElementById('start-game-button').onclick = () => this.startGamePlay();
         }

        showPauseMenu() {
              menuPanels.innerHTML = `<h2>Paused</h2><button id="resume-game-button" class="menu-button">Resume</button><button id="quit-to-menu-button" class="menu-button">Quit to Menu</button>`;
              body.classList.add('menu-visible'); document.getElementById('resume-game-button').onclick = () => this.resumeGame();
              document.getElementById('quit-to-menu-button').onclick = () => { this.scene.stop(); this.inputEnabled = false; this.startMenuShown = false; this.showStartMenu(); };
         }

        showGameOverMenu() {
               menuPanels.innerHTML = `<h2>Game Over</h2><p>Final Score: ${currentScore}</p><p>Highscore: ${highscore}</p><button id="restart-game-button" class="menu-button">Retry</button><button id="back-to-menu-button" class="menu-button">Main Menu</button>`;
               body.classList.add('menu-visible'); document.getElementById('restart-game-button').onclick = () => this.startGamePlay(); document.getElementById('back-to-menu-button').onclick = () => this.showStartMenu();
         }

    } // Ende GameScene Class

    // --- Globale UI Update Funktion ---
    function updateUI() {
        if (scoreElement) scoreElement.textContent = `Score: ${currentScore}`;
        if (comboElement) comboElement.textContent = `Combo: x${currentCombo}`;
    }

    // --- Phaser Spielkonfiguration ---
    // WICHTIG: Zurück zu den ursprünglichen Werten nach dem Debugging
    const config = {
        type: Phaser.AUTO, // Bevorzugt WebGL, fällt auf Canvas zurück
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
        scene: [ GameScene ] // Starte direkt die Haupt-Spielszene
    };

    // --- Spiel starten ---
    console.log("DOM fully loaded. Checking Phaser object...");
    if (typeof Phaser === 'undefined') {
        console.error("!!! PHASER IS NOT LOADED !!! Check the script tag in index.html.");
        loader.textContent = 'Error: Phaser not loaded!';
        loader.style.color = 'red';
    } else {
        console.log("Phaser object found (version:", Phaser.VERSION, "). Proceeding to create game instance...");
        console.log("Using config:", config);

        try {
            gameInstance = new Phaser.Game(config); // Erzeugt die Spielinstanz
            console.log("Phaser Game instance should be created now.");
            // Der Loader wird in GameScene.create() ausgeblendet
        } catch (error) {
             console.error("!!! CRITICAL: Failed to create Phaser Game instance !!!", error);
             loader.textContent = 'Error creating game!';
             loader.style.color = 'red';
        }
    }

    // Optional: Fenstergrößenänderung behandeln
    window.addEventListener('resize', () => {
        if (gameInstance && gameInstance.isBooted) {
            // gameInstance.scale.resize(window.innerWidth, window.innerHeight);
        }
    });

}); // Ende DOMContentLoaded Event Listener