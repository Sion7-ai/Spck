// Globale Variablen
let scene, camera, renderer, mainObject, clock;
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
let isMouseOverObject = false;
let initialColor; // Wir deklarieren, aber initialisieren später wenn THREE verfügbar ist

const loadingScreen = document.getElementById('loading-screen');
const contentContainer = document.getElementById('content-container');
const canvas = document.querySelector('#webgl-canvas');

// --- WebGL-Unterstützungsprüfung ---
function checkWebGLSupport() {
    try {
        // Einfacher Test für WebGL-Unterstützung
        return !!window.WebGLRenderingContext;
    } catch (e) {
        return false;
    }
}

// --- Initialisierung ---
function init() {
    try {
        // Prüfen, ob THREE vorhanden ist
        if (typeof THREE === 'undefined') {
            console.error('THREE.js nicht geladen!');
            return; // Initialisierung abbrechen
        }

        // WebGL-Prüfung - aktiver Test ob Renderer erstellt werden kann
        try {
            const testRenderer = new THREE.WebGLRenderer();
            testRenderer.dispose(); // Aufräumen nach dem Test
        } catch (err) {
            console.error('WebGL-Rendering nicht unterstützt:', err);
            showWebGLError();
            return;
        }

        // Jetzt können wir initialColor initialisieren
        initialColor = new THREE.Color(0x3498db); // Blau

        // Clock für Animationen
        clock = new THREE.Clock();

        // Szene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x121212);
        scene.fog = new THREE.Fog(0x121212, 5, 20);

        // Kamera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lichter
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // 3D Hauptobjekt (z.B. Icosahedron)
        const geometry = new THREE.IcosahedronGeometry(1.2, 0);
        const material = new THREE.MeshStandardMaterial({
            color: initialColor,
            metalness: 0.3,
            roughness: 0.6,
        });
        mainObject = new THREE.Mesh(geometry, material);
        mainObject.userData.enableIdleRotation = true; // Standardmäßig aktiviert
        scene.add(mainObject);

        // Event Listener
        document.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);

        // GSAP Scroll-Animationen initialisieren
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            setupScrollAnimations();
        } else {
            console.warn('GSAP oder ScrollTrigger nicht geladen, Animationen deaktiviert');
        }

        // Raycaster für Maus-Hover
        setupRaycasting();

        // Start der Animationsschleife
        animate();
        
        console.log('3D-Szene erfolgreich initialisiert');
    } catch (error) {
        console.error('Fehler bei der 3D-Initialisierung:', error);
        showWebGLError();
    }
}

// Zeigt eine Fehlermeldung an, wenn WebGL oder die 3D-Initialisierung fehlschlägt
function showWebGLError() {
    // Canvas verstecken
    if (canvas) {
        canvas.style.display = 'none';
    }
    
    // Einfache Fehlermeldung erstellen und anzeigen
    const errorMsg = document.createElement('div');
    errorMsg.style.position = 'fixed';
    errorMsg.style.top = '10px';
    errorMsg.style.left = '10px';
    errorMsg.style.padding = '10px';
    errorMsg.style.background = 'rgba(255,0,0,0.7)';
    errorMsg.style.color = 'white';
    errorMsg.style.borderRadius = '5px';
    errorMsg.style.zIndex = '1000';
    errorMsg.innerHTML = 'WebGL wird nicht vollständig unterstützt. Die 3D-Elemente werden möglicherweise nicht richtig angezeigt.';
    document.body.appendChild(errorMsg);
}

// --- Mausbewegung ---
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);

    // Update mouse vector for raycasting (normalized device coordinates)
    if (mouseVector) { // Sicherstellen, dass mouseVector initialisiert ist
         mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
         mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
}

// --- Fenstergröße ändern ---
function onWindowResize() {
    if (camera && renderer) { // Sicherstellen, dass Objekte existieren
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}

// --- Raycasting für Hover-Effekt ---
let raycaster, mouseVector;
function setupRaycasting() {
    if (typeof THREE === 'undefined') return;
    
    raycaster = new THREE.Raycaster();
    mouseVector = new THREE.Vector2();
}

function checkIntersection() {
    if (!mainObject || !raycaster || !camera || !mouseVector) return; // Robustheitsprüfung

    raycaster.setFromCamera(mouseVector, camera);
    const intersects = raycaster.intersectObject(mainObject);

    if (intersects.length > 0) {
        if (!isMouseOverObject) {
            isMouseOverObject = true;
            gsap.to(mainObject.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.3, ease: 'back.out(1.7)' });
            gsap.to(mainObject.material.color, { r: 0.9, g: 0.9, b: 0.9, duration: 0.3 });
        }
    } else {
        if (isMouseOverObject) {
            isMouseOverObject = false;
            gsap.to(mainObject.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'power3.out' });
            gsap.to(mainObject.material.color, { r: initialColor.r, g: initialColor.g, b: initialColor.b, duration: 0.3 });
        }
    }
}

// --- GSAP Scroll Animationen ---
function setupScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    // --- Globale Scroll-Timeline ---
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5 // Etwas weicheres Scrubbing
        }
    });

    // Animation: Gesamte Reise (Rotation, leichte Z-Bewegung)
    tl.to(mainObject.rotation, {
        x: Math.PI * 1.5,
        y: Math.PI * 3,
        ease: 'power1.inOut'
    }, 0);
    tl.to(mainObject.position, {
        z: 2, // Objekt kommt etwas näher während des Scrollens
        ease: 'power1.inOut'
    }, 0);
    tl.to(camera.position, {
        z: 7, // Kamera fährt leicht zurück
        ease: 'power1.inOut'
    }, 0);


    // --- Sektionen-spezifische Animationen ---

    // Features Sektion
    ScrollTrigger.create({
        trigger: '#features',
        start: 'top center+=100',
        end: 'bottom center-=100',
        onEnter: () => gsap.to(mainObject.material.color, { r: 0.9, g: 0.4, b: 0.1, duration: 0.5, ease: 'power2.out' }), // Orange
        onLeaveBack: () => gsap.to(mainObject.material.color, { r: initialColor.r, g: initialColor.g, b: initialColor.b, duration: 0.5, ease: 'power2.out'}), // Zurück zu Blau
        onLeave: () => gsap.to(mainObject.material.color, { r: initialColor.r, g: initialColor.g, b: initialColor.b, duration: 0.5, ease: 'power2.out'}), // Farbe am Ende wieder zurücksetzen
        onEnterBack: () => gsap.to(mainObject.material.color, { r: 0.9, g: 0.4, b: 0.1, duration: 0.5, ease: 'power2.out' }) // Farbe wiederherstellen beim Zurückscrollen
    });

     // How It Works Sektion - Stärkere Transformation
     const howTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#how-it-works',
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
        }
    });
    howTl.to(mainObject.scale, { x: 0.8, y: 1.5, z: 0.8, ease: 'power2.inOut' }) // Verformen
         .to(mainObject.material.color, { r: 0.2, g: 0.8, b: 0.3, ease: 'power1.inOut' }, 0) // Grün
         .to(mainObject.rotation, { z: Math.PI * 0.5, ease: 'power2.inOut' }, 0); // Kippen

     // Testimonials Sektion - Beruhigung
     const testTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#testimonials',
            start: 'top center',
            end: 'bottom center',
            scrub: 1.5, // Langsamer
        }
    });
    testTl.to(mainObject.scale, { x: 0.9, y: 0.9, z: 0.9, ease: 'power1.inOut' }) // Kleiner, ruhiger
          .to(mainObject.material.color, { r: 0.7, g: 0.7, b: 0.9, ease: 'power1.inOut' }, 0) // Blasseres Lila/Grau
          .to(mainObject.rotation, { x: '+=0.2', y: '+=0.5', ease: 'none' }, 0); // Sehr langsame Zusatzrotation

    // Final CTA Sektion - Fokus
     const finalTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.final-cta',
            start: 'top center',
            end: 'center center', // Animation endet in der Mitte der Sektion
            scrub: 1,
        }
    });
    finalTl.to(mainObject.scale, { x: 1.3, y: 1.3, z: 1.3, ease: 'back.out(1.2)' }) // Größer, auffälliger
           .to(mainObject.position, { x: 0, y: 0.5, z: 4, ease: 'power2.out' }, 0) // Näher und leicht nach oben
           .to(mainObject.material.color, { r: 0.9, g: 0.2, b: 0.2, ease: 'power2.out' }, 0); // Auffälliges Rot

    // Optional: Zusätzliche Hover-Effekte für CTAs
    document.querySelectorAll('.cta').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, { scale: 1.05, duration: 0.2, ease: 'power1.out' });
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(button, { scale: 1.0, duration: 0.2, ease: 'power1.out' });
        });
    });

     // Accessibility: Prefers Reduced Motion Check
     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
     const checkMotionPreference = () => {
         const reduceMotion = prefersReducedMotion.matches;
         if(mainObject) mainObject.userData.enableIdleRotation = !reduceMotion; // Aktiviere/Deaktiviere Idle-Rotation

         ScrollTrigger.getAll().forEach(st => {
             if (st.vars.scrub) {
                 st.vars.scrub = reduceMotion ? false : (st.vars.scrub === true ? 1 : st.vars.scrub); // Setze Scrub oder entferne es
                 st.render(st.scroll(), true); // Force render update
                 st.refresh(true); // Recalculate positions
             }
         });

         if (reduceMotion) {
             console.log("Reduced motion enabled.");
             gsap.globalTimeline.timeScale(0); // Stoppt alle GSAP Animationen quasi
         } else {
             console.log("Reduced motion disabled.");
             gsap.globalTimeline.timeScale(1); // Normale Geschwindigkeit
         }
     };

     checkMotionPreference(); // Beim Laden prüfen
     prefersReducedMotion.addEventListener('change', checkMotionPreference); // Auf Änderungen hören
}

// --- Animationsschleife ---
function animate() {
    requestAnimationFrame(animate);

    if (!renderer || !scene || !camera || !clock) return; // Abbruch, wenn nicht initialisiert

    const delta = clock.getDelta(); // Zeit seit dem letzten Frame

    // Idle Animation (nur wenn nicht reduced motion und Objekt existiert)
    if (mainObject && mainObject.userData.enableIdleRotation) {
        mainObject.rotation.y += 0.2 * delta; // Zeitbasiert für gleichmäßige Geschwindigkeit
        mainObject.rotation.x += 0.1 * delta;
    }

    // Maus-Hover-Effekt prüfen
    checkIntersection();

    // Rendern
    renderer.render(scene, camera);
}

// --- Loading screen handling ---
function hideLoadingScreen() {
    console.log("Hiding loading screen");
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
    
    // Make content visible after loading screen hides
    if (contentContainer) {
        setTimeout(() => {
            contentContainer.style.visibility = 'visible';
            contentContainer.style.opacity = 1;
            contentContainer.style.transition = 'opacity 0.5s ease-in';
        }, 500); // Match CSS transition duration
    }
}

// Warten auf das Laden aller Ressourcen
window.addEventListener('load', hideLoadingScreen);

// Library loading check - wichtig für mobile Browser
function checkLibrariesLoaded() {
    let maxRetries = 20; // Erhöht von vorher
    let retryCount = 0;
    let retryInterval = 200; // Millisekunden zwischen Versuchen
    
    function checkThree() {
        if (typeof THREE !== 'undefined') {
            console.log('THREE.js erfolgreich geladen!');
            
            // Wichtig: Setze den z-index des Canvas richtig
            if (canvas) {
                canvas.style.zIndex = '1';
            }
            
            // Starten
            init();
            return;
        }
        
        retryCount++;
        if (retryCount <= maxRetries) {
            console.log(`THREE.js noch nicht geladen. Versuch ${retryCount}/${maxRetries}...`);
            setTimeout(checkThree, retryInterval);
        } else {
            console.error('THREE.js konnte nicht geladen werden nach mehreren Versuchen.');
            showWebGLError();
        }
    }
    
    // Erster Check
    checkThree();
}

// --- Start ---
// Defensive Programmierung: Sicherstellen, dass DOM geladen ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        checkLibrariesLoaded();
    });
} else {
    checkLibrariesLoaded();
}