// Globale Variablen
let scene, camera, renderer, mainObject, clock;
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
let isMouseOverObject = false;
let initialColor; 
let isMobile = false; // Flag für mobile Geräte
let lowPerformanceMode = false; // Flag für niedrige Leistung

const loadingScreen = document.getElementById('loading-screen');
const contentContainer = document.getElementById('content-container');
const canvas = document.querySelector('#webgl-canvas');

// --- Geräteprüfung ---
function checkDeviceCapabilities() {
    // Prüft, ob es wahrscheinlich ein mobiles Gerät ist
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Wenn es ein mobiles Gerät ist, niedrige Leistung vermuten
    if (isMobile) {
        lowPerformanceMode = true;
        console.log("Mobiles Gerät erkannt, niedrige Leistungseinstellungen aktiviert");
    }
}

// --- Verbesserte WebGL-Unterstützungsprüfung ---
function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        // Versuche zuerst WebGL 1.0 (breiter unterstützt)
        let gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) || 
                canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false });
        
        if (!gl) {
            console.warn('WebGL 1.0 wird nicht unterstützt');
            return false;
        }
        
        console.log("WebGL wird unterstützt");
        return true;
    } catch (e) {
        console.error('Fehler bei WebGL-Prüfung:', e);
        return false;
    }
}

// --- Initialisierung ---
function init() {
    try {
        // Zuerst Gerätefähigkeiten prüfen
        checkDeviceCapabilities();

        // Prüfen, ob THREE vorhanden ist
        if (typeof THREE === 'undefined') {
            console.error('THREE.js nicht geladen!');
            showWebGLError("THREE.js konnte nicht geladen werden. Bitte laden Sie die Seite neu.");
            return;
        }

        // WebGL-Unterstützung prüfen
        const webGLSupported = checkWebGLSupport();
        if (!webGLSupported) {
            console.warn('WebGL wird nicht voll unterstützt - versuche trotzdem mit niedrigen Einstellungen');
            lowPerformanceMode = true;
            // Wir setzen fort, aber mit reduzierten Einstellungen
        }

        // Jetzt können wir initialColor initialisieren
        initialColor = new THREE.Color(0x3498db); // Blau

        // Clock für Animationen
        clock = new THREE.Clock();

        // Szene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x121212);
        
        // Nebel auf Mobilgeräten reduzieren oder deaktivieren
        if (lowPerformanceMode) {
            scene.fog = new THREE.Fog(0x121212, 8, 25); // Weniger dichter Nebel
        } else {
            scene.fog = new THREE.Fog(0x121212, 5, 20);
        }

        // Kamera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer mit mobiler Kompatibilität
        setupRenderer();

        // Lichter - reduzierte Komplexität für mobile Geräte
        setupLights();

        // 3D Hauptobjekt mit angepasster Komplexität
        setupMainObject();

        // Event Listener
        document.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);

        // GSAP Scroll-Animationen initialisieren
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            setupScrollAnimations();
        } else {
            console.warn('GSAP oder ScrollTrigger nicht geladen, Animationen deaktiviert');
        }

        // Raycaster für Maus-Hover (nur auf Desktop-Geräten)
        if (!isMobile) {
            setupRaycasting();
        }

        // Start der Animationsschleife
        animate();
        
        console.log('3D-Szene erfolgreich initialisiert');
    } catch (error) {
        console.error('Fehler bei der 3D-Initialisierung:', error);
        showWebGLError("Es gab ein Problem beim Erstellen der 3D-Szene. Bitte mit einem neueren Browser versuchen.");
    }
}

// --- Renderer-Setup mit mobiler Anpassung ---
function setupRenderer() {
    try {
        const rendererOptions = {
            canvas: canvas,
            antialias: !lowPerformanceMode, // Antialias nur auf leistungsstarken Geräten
            powerPreference: lowPerformanceMode ? 'low-power' : 'high-performance',
            precision: lowPerformanceMode ? 'mediump' : 'highp', // Mittlere Präzision für bessere Kompatibilität
            failIfMajorPerformanceCaveat: false, // Wichtig: Erlaube auch "langsames" WebGL
            alpha: false // Kein Alpha-Kanal für bessere Performance
        };

        renderer = new THREE.WebGLRenderer(rendererOptions);
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Pixel-Ratio begrenzen auf mobilen Geräten
        const maxPixelRatio = lowPerformanceMode ? 1.5 : 2;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
        
        // Schattenerzeugung deaktivieren auf mobilen Geräten
        renderer.shadowMap.enabled = !lowPerformanceMode;
        
        console.log("Renderer erfolgreich erstellt");
    } catch (error) {
        console.error("Fehler beim Erstellen des Renderers:", error);
        throw error; // Weiterleiten, damit die Haupt-init-Funktion es fängt
    }
}

// --- Licht-Setup mit mobiler Anpassung ---
function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Etwas heller für mobile Geräte
    scene.add(ambientLight);

    // Auf leistungsschwachen Geräten nur ein Licht verwenden
    if (!lowPerformanceMode) {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
    }
}

// --- Hauptobjekt-Setup mit angepasster Komplexität ---
function setupMainObject() {
    // Geometrie-Details je nach Geräteleistung anpassen
    const detailLevel = lowPerformanceMode ? 0 : 1; // 0 = niedrigste Auflösung
    const geometry = new THREE.IcosahedronGeometry(1.2, detailLevel);
    
    // Material je nach Geräteleistung anpassen
    const material = new THREE.MeshStandardMaterial({
        color: initialColor,
        metalness: lowPerformanceMode ? 0.1 : 0.3,
        roughness: lowPerformanceMode ? 0.8 : 0.6,
        flatShading: lowPerformanceMode, // Flat Shading für bessere Performance
    });
    
    mainObject = new THREE.Mesh(geometry, material);
    mainObject.userData.enableIdleRotation = true; // Standardmäßig aktiviert
    scene.add(mainObject);
}

// Zeigt eine angepasste Fehlermeldung an
function showWebGLError(message = "WebGL wird nicht vollständig unterstützt. Die 3D-Elemente werden möglicherweise nicht richtig angezeigt.") {
    // Canvas verstecken
    if (canvas) {
        canvas.style.display = 'none';
    }
    
    // Einfache Fehlermeldung erstellen und anzeigen
    const errorMsg = document.createElement('div');
    errorMsg.style.position = 'fixed';
    errorMsg.style.top = '10px';
    errorMsg.style.left = '10px';
    errorMsg.style.right = '10px'; // Volle Breite auf mobilen Geräten 
    errorMsg.style.padding = '10px';
    errorMsg.style.background = 'rgba(255,0,0,0.7)';
    errorMsg.style.color = 'white';
    errorMsg.style.borderRadius = '5px';
    errorMsg.style.zIndex = '1000';
    errorMsg.style.textAlign = 'center'; // Zentrierter Text
    errorMsg.innerHTML = message;
    document.body.appendChild(errorMsg);
}

// --- Mausbewegung ---
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);

    // Update mouse vector for raycasting (nur wenn Raycasting aktiv ist)
    if (raycaster && mouseVector) {
         mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
         mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
}

// --- Fenstergröße ändern ---
function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        const maxPixelRatio = lowPerformanceMode ? 1.5 : 2;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
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
    // Raycasting überspringen auf Mobilgeräten oder wenn nicht initialisiert
    if (isMobile || !mainObject || !raycaster || !camera || !mouseVector) return;

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

    // Reduzierte oder vereinfachte Animationen für mobile Geräte
    const scrubAmount = lowPerformanceMode ? 0.5 : 1.5; // Schnelleres Scrubbing auf Mobilgeräten

    // --- Globale Scroll-Timeline ---
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: scrubAmount
        }
    });

    // Animation: Gesamte Reise (Rotation, leichte Z-Bewegung) - reduziert für mobile Geräte
    const rotationAmount = lowPerformanceMode ? Math.PI * 0.75 : Math.PI * 1.5;
    tl.to(mainObject.rotation, {
        x: rotationAmount,
        y: Math.PI * (lowPerformanceMode ? 1.5 : 3),
        ease: 'power1.inOut'
    }, 0);
    
    // Weniger Bewegung auf mobilen Geräten
    if (!lowPerformanceMode) {
        tl.to(mainObject.position, {
            z: 2, // Objekt kommt etwas näher während des Scrollens
            ease: 'power1.inOut'
        }, 0);
        tl.to(camera.position, {
            z: 7, // Kamera fährt leicht zurück
            ease: 'power1.inOut'
        }, 0);
    }

    // --- Sektionen-spezifische Animationen ---
    // Auf Mobilgeräten nur die wichtigsten Animationen behalten

    // Features Sektion - Farbe ändern (funktioniert auch auf Mobilgeräten gut)
    ScrollTrigger.create({
        trigger: '#features',
        start: 'top center+=100',
        end: 'bottom center-=100',
        onEnter: () => gsap.to(mainObject.material.color, { r: 0.9, g: 0.4, b: 0.1, duration: 0.5, ease: 'power2.out' }), // Orange
        onLeaveBack: () => gsap.to(mainObject.material.color, { r: initialColor.r, g: initialColor.g, b: initialColor.b, duration: 0.5, ease: 'power2.out'}),
        onLeave: () => gsap.to(mainObject.material.color, { r: initialColor.r, g: initialColor.g, b: initialColor.b, duration: 0.5, ease: 'power2.out'}),
        onEnterBack: () => gsap.to(mainObject.material.color, { r: 0.9, g: 0.4, b: 0.1, duration: 0.5, ease: 'power2.out' })
    });

    // Komplexere Animationen nur auf leistungsfähigen Geräten
    if (!lowPerformanceMode) {
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
    }

    // Final CTA Sektion - Fokus (vereinfacht für mobile Geräte)
    const finalTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.final-cta',
            start: 'top center',
            end: 'center center', 
            scrub: lowPerformanceMode ? 0.5 : 1,
        }
    });
    
    // Vereinfachte Animation für mobile Geräte
    if (lowPerformanceMode) {
        finalTl.to(mainObject.material.color, { r: 0.9, g: 0.2, b: 0.2, ease: 'power2.out' }, 0); // Nur Farbe ändern
    } else {
        finalTl.to(mainObject.scale, { x: 1.3, y: 1.3, z: 1.3, ease: 'back.out(1.2)' }) // Größer
               .to(mainObject.position, { x: 0, y: 0.5, z: 4, ease: 'power2.out' }, 0) // Näher und leicht nach oben
               .to(mainObject.material.color, { r:1, g: 0.2, b: 0.2, ease: 'power2.out' }, 0); // Auffälliges Rot
    }

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

// --- Optimierte Animationsschleife ---
function animate() {
    requestAnimationFrame(animate);

    if (!renderer || !scene || !camera || !clock) return; // Abbruch, wenn nicht initialisiert

    const delta = clock.getDelta(); // Zeit seit dem letzten Frame

    // Idle Animation (nur wenn nicht reduced motion und Objekt existiert)
    if (mainObject && mainObject.userData.enableIdleRotation) {
        // Reduzierte Rotationsgeschwindigkeit auf mobilen Geräten
        const rotationSpeed = lowPerformanceMode ? 0.08 : 0.2;
        mainObject.rotation.y += rotationSpeed * delta;
        
        // Auf Desktop-Geräten zusätzliche X-Rotation
        if (!isMobile) {
            mainObject.rotation.x += 0.1 * delta;
        }
    }

    // Maus-Hover-Effekt prüfen (nur auf Desktop)
    if (!isMobile) {
        checkIntersection();
    }

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
    let maxRetries = 20;
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
            showWebGLError("THREE.js konnte nicht geladen werden. Bitte aktualisieren Sie Ihren Browser oder prüfen Sie Ihre Internetverbindung.");
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