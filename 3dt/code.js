import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// --- Globale Variablen ---
let scene, camera, renderer, mainObject, clock;
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
let isMouseOverObject = false;
const initialColor = new THREE.Color(0x3498db); // Blau

const loadingScreen = document.getElementById('loading-screen');
const contentContainer = document.getElementById('content-container');

// --- Initialisierung ---
function init() {
    // Clock für Animationen
    clock = new THREE.Clock();

    // Szene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212); // Passend zum CSS-Hintergrund
    scene.fog = new THREE.Fog(0x121212, 5, 20); // Nebel für Tiefe

    // Kamera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#webgl-canvas'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance-Optimierung

    // Lichter
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // 3D Hauptobjekt (z.B. Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(1.2, 0); // Radius 1.2, Detail 0
    const material = new THREE.MeshStandardMaterial({
        color: initialColor,
        metalness: 0.3,
        roughness: 0.6,
        // wireframe: true, // Für einen anderen Look
    });
    mainObject = new THREE.Mesh(geometry, material);
    scene.add(mainObject);

    // Event Listener
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);

    // GSAP Scroll-Animationen initialisieren
    setupScrollAnimations();

    // Raycaster für Maus-Hover
    setupRaycasting();

    // Start der Animationsschleife
    animate();

    // Ladebildschirm ausblenden, wenn alles bereit ist
    // In einem echten Projekt würde man auf das Laden von Assets warten (Texture, Models)
    window.onload = () => {
        loadingScreen.classList.add('hidden');
         // Machen Sie den Inhalt sichtbar, nachdem der Ladebildschirm ausgeblendet wurde
        setTimeout(() => {
             contentContainer.style.visibility = 'visible';
             contentContainer.style.opacity = 1; // Optional für einen Fade-In-Effekt
             contentContainer.style.transition = 'opacity 0.5s ease-in';
        }, 500); // Passen Sie die Verzögerung an die Übergangsdauer des Ladebildschirms an
    };
}

// --- Mausbewegung ---
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);

    // Update mouse vector for raycasting (normalized device coordinates)
    mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// --- Fenstergröße ändern ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// --- Raycasting für Hover-Effekt ---
let raycaster, mouseVector;
function setupRaycasting() {
    raycaster = new THREE.Raycaster();
    mouseVector = new THREE.Vector2();
}

function checkIntersection() {
    if (!mainObject) return;

    raycaster.setFromCamera(mouseVector, camera);
    const intersects = raycaster.intersectObject(mainObject);

    if (intersects.length > 0) {
        if (!isMouseOverObject) {
            // Maus ist jetzt über dem Objekt
            gsap.to(mainObject.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.3, ease: 'back.out(1.7)' });
            gsap.to(mainObject.material.color, { r: 0.9, g: 0.9, b: 0.9, duration: 0.3 }); // Heller werden
            isMouseOverObject = true;
        }
    } else {
        if (isMouseOverObject) {
            // Maus hat das Objekt verlassen
            gsap.to(mainObject.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'power3.out' });
            gsap.to(mainObject.material.color, { r: initialColor.r, g: initialColor.g, b: initialColor.b, duration: 0.3 });
            isMouseOverObject = false;
        }
    }
}

// --- GSAP Scroll Animationen ---
function setupScrollAnimations() {
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
        // markers: true, // Zum Debuggen
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
            // markers: true,
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
           // markers: true
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
            // markers: true
        }
    });
    finalTl.to(mainObject.scale, { x: 1.3, y: 1.3, z: 1.3, ease: 'back.out(1.2)' }) // Größer, auffälliger
           .to(mainObject.position, { x: 0, y: 0.5, z: 4, ease: 'power2.out' }, 0) // Näher und leicht nach oben
           .to(mainObject.material.color, { r: 0.9, g: 0.2, b: 0.2, ease: 'power2.out' }, 0); // Auffälliges Rot

    // Optional: Zusätzliche Hover-Effekte für CTAs
    document.querySelectorAll('.cta').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, { scale: 1.05, duration: 0.2, ease: 'power1.out' });
            // Optional: Leichte Reaktion des 3D-Objekts
            // gsap.to(mainObject.rotation, { y: '+=0.1', duration: 0.5 });
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(button, { scale: 1.0, duration: 0.2, ease: 'power1.out' });
        });
    });

     // Accessibility: Prefers Reduced Motion Check
     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
     if (prefersReducedMotion.matches) {
         console.log("Reduced motion enabled. Disabling scroll scrubbing.");
         // Deaktiviere Scrubbing, indem du die ScrollTrigger-Instanzen killst oder anpasst
         ScrollTrigger.getAll().forEach(st => {
             if (st.vars.scrub) {
                 // Option 1: Kill den Trigger (kann zu Sprüngen führen)
                 // st.kill();
                 // Option 2: Setze Scrub auf false (Animation spielt einmal ab, wenn getriggert)
                 st.vars.scrub = false;
                 st.render(0); // Setze auf Anfangszustand zurück
                 st.refresh(); // Aktualisiere den Trigger
             }
         });
         // Stoppe die kontinuierliche Rotation
         mainObject.userData.enableIdleRotation = false;
     } else {
         mainObject.userData.enableIdleRotation = true;
     }

     prefersReducedMotion.addEventListener('change', () => {
        // Handle Änderungen, wenn der Benutzer die Einstellung während der Sitzung ändert
        window.location.reload(); // Einfachste Lösung: Seite neu laden
     });
}


// --- Animationsschleife ---
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta(); // Zeit seit dem letzten Frame

    // Idle Animation (nur wenn nicht reduced motion)
    if (mainObject && mainObject.userData.enableIdleRotation) {
        mainObject.rotation.y += 0.2 * delta; // Zeitbasiert für gleichmäßige Geschwindigkeit
        mainObject.rotation.x += 0.1 * delta;
    }

    // Maus-Hover-Effekt prüfen
    checkIntersection();

    // Sanfte Maus-Blickrichtung (optional, kann mit Scroll-Animation kollidieren)
    // camera.position.x += ( (mouseX * 0.001) - camera.position.x ) * 0.05;
    // camera.position.y += ( -(mouseY * 0.001) - camera.position.y ) * 0.05;
    // camera.lookAt( scene.position );

    // Rendern
    renderer.render(scene, camera);
}

// --- Start ---
init();