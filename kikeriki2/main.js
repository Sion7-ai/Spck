document.addEventListener('DOMContentLoaded',function(){
    const preloader=document.getElementById('preloader');
    const body=document.body;

    function hidePreloader(){
        if(preloader){
            gsap.to(preloader,{
                autoAlpha:0,
                duration:.6,
                ease:"power2.out",
                onComplete:()=>{
                    if(preloader)preloader.style.display='none';
                    if(body)body.classList.remove('preloading');
                    console.log("Preloader hidden via GSAP.");
                    ScrollTrigger.refresh();
                    initializePageAnimations();
                }
            });
        } else {
            if(body)body.classList.remove('preloading');
            initializePageAnimations();
        }
    }

    function fallbackHidePreloader(){
        if(preloader){
            preloader.classList.add('loaded');
            preloader.addEventListener('transitionend',()=>{
                if(preloader)preloader.style.display='none';
            },{once:!0});
            console.log("Preloader fallback: GSAP not loaded, hiding preloader via CSS.");
        }
        if(body)body.classList.remove('preloading');
    }

    if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined'||typeof ScrollToPlugin==='undefined'){
        console.error('GSAP or its plugins could not be loaded.');
        fallbackHidePreloader();
        const mobileMenuToggleNoGsap=document.getElementById('mobile-menu-toggle');
        const mobileMenuNoGsap=document.getElementById('mobile-menu');
        if(mobileMenuToggleNoGsap&&mobileMenuNoGsap){
            mobileMenuToggleNoGsap.addEventListener('click',()=>{
                const isOpen=mobileMenuNoGsap.classList.toggle('open-no-gsap');
                document.body.classList.toggle('no-scroll',isOpen);
                mobileMenuToggleNoGsap.setAttribute('aria-expanded',isOpen);
            });
        }
        return;
    }

    gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);
    
    setTimeout(hidePreloader,1600);

    function initializePageAnimations(){
        const header=document.getElementById('header');
        const mobileMenuToggle=document.getElementById('mobile-menu-toggle');
        const mobileMenu=document.getElementById('mobile-menu');
        const navItems=document.querySelectorAll('.nav-item, .mobile-nav-item');
        const pageSections=document.querySelectorAll('.page-section');
        let lastScrollTop=0;

        ScrollTrigger.create({
            trigger:"body",start:"top top",end:"bottom bottom",
            onUpdate:self=>{
                const currentScrollTop=self.scrollY;
                currentScrollTop>100?header.classList.add('scrolled'):header.classList.remove('scrolled');
                const activeHeroSlide=document.querySelector('.hero-slide.active');
                if(activeHeroSlide){
                    const theme=activeHeroSlide.dataset.slideTheme||'dark';
                    const heroSection=document.getElementById('hero');
                    let heroInViewThreshold=window.innerHeight*.5;
                    if(heroSection.getBoundingClientRect().bottom>heroInViewThreshold){
                        header.classList.toggle('light-theme',theme==='light');
                    }else if(!header.classList.contains('scrolled')){
                        header.classList.remove('light-theme');
                    } else if (header.classList.contains('scrolled') && theme === 'light') {
                        header.classList.remove('light-theme');
                    }
                }else if(currentScrollTop<100){
                    header.classList.remove('light-theme');
                }
            }
        });

        if(mobileMenuToggle&&mobileMenu){
            const mobileNavItemsGSAP=mobileMenu.querySelectorAll('.mobile-nav-item');
            const menuTl=gsap.timeline({paused:!0,reversed:!0});
            menuTl.to(mobileMenu,{autoAlpha:1,y:'0%',duration:.5,ease:"power3.inOut"})
                  .fromTo(mobileNavItemsGSAP,{autoAlpha:0,y:30},{autoAlpha:1,y:0,stagger:.07,duration:.4,ease:"power2.out"},"-=.2");
            mobileMenuToggle.addEventListener('click',()=>{
                const isOpen=mobileMenuToggle.getAttribute('aria-expanded')==='false';
                mobileMenuToggle.setAttribute('aria-expanded',isOpen);
                body.classList.toggle('no-scroll',isOpen);
                mobileMenu.classList.toggle('open',isOpen);
                isOpen?menuTl.play():menuTl.reverse();
            });
        }

        function smoothScrollToTarget(targetId){
            const targetElement=document.querySelector(targetId);
            if(targetElement){
                let offsetValue=header.offsetHeight;
                if(targetId==='#hero')offsetValue=0;
                gsap.to(window,{duration:1.5,scrollTo:{y:targetElement,offsetY:offsetValue},ease:"power4.inOut"});
                if(mobileMenuToggle.getAttribute('aria-expanded')==='true'){
                    setTimeout(()=>{mobileMenuToggle.click()},100);
                }
            }
        }
        document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
            anchor.addEventListener('click',function(e){
                e.preventDefault();
                smoothScrollToTarget(this.getAttribute('href'));
            });
        });

        function setActiveLinkOnScroll(sectionId){
            navItems.forEach(link=>{
                link.classList.toggle('active-link',link.dataset.section===sectionId);
            });
        }
        if(pageSections.length>0&&navItems.length>0){
            pageSections.forEach(section=>{
                ScrollTrigger.create({
                    trigger:section,
                    start:()=>`top ${header.offsetHeight+window.innerHeight*.35}px`,
                    end:()=>`bottom ${header.offsetHeight+window.innerHeight*.35}px`,
                    onToggle:self=>{if(self.isActive){setActiveLinkOnScroll(section.id)}},
                    onEnterBack:()=>setActiveLinkOnScroll(section.id)
                });
            });
            setTimeout(()=>{
                let firstVisibleSectionId=null;
                for(let section of pageSections){
                    if(ScrollTrigger.isInViewport(section,-.4)){firstVisibleSectionId=section.id;break}
                }
                if(firstVisibleSectionId){setActiveLinkOnScroll(firstVisibleSectionId)}
                else if(pageSections.length>0&&window.scrollY<pageSections[0].offsetTop+pageSections[0].offsetHeight*.5){
                    if(pageSections[0].id==='hero')setActiveLinkOnScroll('hero');
                }
            },200);
        }
        if(window.location.hash)setActiveLinkOnScroll(window.location.hash.substring(1));
        else if(pageSections.length>0&&ScrollTrigger.isInViewport(pageSections[0],-.5)&&pageSections[0].id==='hero')setActiveLinkOnScroll('hero');

        const heroSlider=document.querySelector('.hero-slider-wrapper');
        const heroSlides=gsap.utils.toArray('.hero-slide',heroSlider);
        const heroSliderArrows=document.querySelectorAll('.hero-slider-arrow');
        const heroSliderDotsContainer=document.querySelector('.hero-slider-dots');
        let currentHeroSlide=0;let heroAutoplayInterval;let isHeroAnimating=!1;
        if(heroSlides.length>0){
            heroSlides.forEach((slide,index)=>{
                const dot=document.createElement('span');
                dot.classList.add('dot');dot.dataset.slide=index;
                if(index===0)dot.classList.add('active');
                dot.addEventListener('click',()=>{if(!isHeroAnimating)goToHeroSlide(index)});
                if(heroSliderDotsContainer)heroSliderDotsContainer.appendChild(dot);
            });
            const heroDots=gsap.utils.toArray('.hero-slider-dots .dot');
            function animateHeroSlideIn(slide){
                isHeroAnimating=!0;
                const tl=gsap.timeline({onComplete:()=>isHeroAnimating=!1});
                const bgImage=slide.querySelector('.hero-image-bg');
                const textItems=slide.querySelectorAll('.animate-hero-item');
                gsap.set(slide,{autoAlpha:1});
                tl.fromTo(bgImage,{scale:1.15,autoAlpha:0},{scale:1,autoAlpha:.8,duration:1.4,ease:"power3.out"});
                tl.fromTo(textItems,{autoAlpha:0,y:40,skewY:2},{autoAlpha:1,y:0,skewY:0,stagger:.1,duration:.8,ease:"power3.out"},"-=1.0");
                return tl;
            }
            function animateHeroSlideOut(slide){
                isHeroAnimating=!0;
                const tl=gsap.timeline({onComplete:()=>isHeroAnimating=!1});
                const bgImage=slide.querySelector('.hero-image-bg');
                const textItems=slide.querySelectorAll('.animate-hero-item');
                tl.to(textItems,{autoAlpha:0,y:-30,stagger:.05,duration:.5,ease:"power2.in"})
                  .to(bgImage,{autoAlpha:0,scale:1.05,duration:.7,ease:"power2.in"},"=-.4")
                  .set(slide,{autoAlpha:0});
                return tl;
            }
            function goToHeroSlide(index,direction="next"){
                if(index===currentHeroSlide&&heroSlides[index].classList.contains('active'))return;
                if(isHeroAnimating)return;isHeroAnimating=!0;
                const oldSlide=heroSlides[currentHeroSlide];const newSlide=heroSlides[index];
                clearInterval(heroAutoplayInterval);
                const outAnimation=animateHeroSlideOut(oldSlide);
                outAnimation.eventCallback("onComplete",()=>{
                    oldSlide.classList.remove('active');newSlide.classList.add('active');
                    animateHeroSlideIn(newSlide).eventCallback("onComplete",()=>{isHeroAnimating=!1;startHeroAutoplay()});
                    heroDots.forEach((dot,i)=>dot.classList.toggle('active',i===index));currentHeroSlide=index;
                    const theme=newSlide.dataset.slideTheme||'dark';
                    header.classList.toggle('light-theme',theme==='light');
                });
            }
            function startHeroAutoplay(){
                clearInterval(heroAutoplayInterval);
                heroAutoplayInterval=setInterval(()=>{
                    if(!isHeroAnimating)goToHeroSlide((currentHeroSlide+1)%heroSlides.length,"next");
                },7000);
            }
            gsap.set(heroSlides,{autoAlpha:0});heroSlides[0].classList.add('active');
            animateHeroSlideIn(heroSlides[0]).eventCallback("onComplete",()=>{isHeroAnimating=!1;startHeroAutoplay()});
            header.classList.toggle('light-theme',heroSlides[0].dataset.slideTheme==='light');
            heroSliderArrows.forEach(arrow=>{
                arrow.addEventListener('click',()=>{
                    if(isHeroAnimating)return;let newIndex;
                    if(arrow.classList.contains('next')){newIndex=(currentHeroSlide+1)%heroSlides.length}
                    else{newIndex=(currentHeroSlide-1+heroSlides.length)%heroSlides.length}
                    goToHeroSlide(newIndex);
                });
            });
        }

        const marqueeContent=document.querySelector(".marquee-content");
        if(marqueeContent&&marqueeContent.children.length>0){
            gsap.to(marqueeContent,{x:-marqueeContent.scrollWidth/2,duration:30,ease:"none",repeat:-1});
        }

        const mediaQueryDesktop=window.matchMedia("(min-width: 769px)");
        function initializeDesktopScrollEffects(){
            if(document.querySelector(".problem-solution-container")&&document.querySelector(".sticky-title-column")&&document.querySelector(".scrollable-content-column")){
                ScrollTrigger.create({
                    trigger:".problem-solution-container",pin:".sticky-title-column",
                    start:"top top+="+ (header.offsetHeight+40),
                    end:()=>"+="+(document.querySelector(".scrollable-content-column").offsetHeight-document.querySelector(".sticky-title-column").offsetHeight-40),
                    pinSpacing:"auto"
                });
            }
            const horizontalWrapper=document.querySelector(".horizontal-panels-wrapper");
            if(horizontalWrapper&&horizontalWrapper.children.length>0){
                const panels=gsap.utils.toArray(".horizontal-panel",horizontalWrapper);
                const scrollContainer=document.querySelector(".horizontal-scroll-container");
                let scrollTween=gsap.to(panels,{
                    xPercent:-100*(panels.length-1),ease:"none",
                    scrollTrigger:{
                        trigger:scrollContainer,pin:!0,scrub:1.2,
                        snap:{snapTo:1/(panels.length-1),duration:{min:.2,max:.6},ease:"power1.inOut"},
                        end:()=>"+="+(horizontalWrapper.offsetWidth-window.innerWidth)
                    }
                });
                panels.forEach(panel=>{
                    const img=panel.querySelector('.panel-image');
                    if(img){
                        gsap.fromTo(img,{backgroundPosition:"70% 50%"},{
                            backgroundPosition:"30% 50%",ease:"none",
                            scrollTrigger:{trigger:panel,containerAnimation:scrollTween,start:"left right",end:"right left",scrub:!0}
                        });
                    }
                });
            }
        }
        if(mediaQueryDesktop.matches){initializeDesktopScrollEffects()}
        mediaQueryDesktop.addEventListener('change', event => {
            ScrollTrigger.getAll().forEach(st => st.kill()); // Wichtig: Alte STs killen bei Resize
            if (event.matches) {initializeDesktopScrollEffects()}
             else { /* Ggf. mobile-spezifische Logik hier, falls nötig, oder einfach CSS die Arbeit machen lassen */ }
            ScrollTrigger.refresh(); // Positionen neu berechnen
        });


        const accordionMinimalItems=document.querySelectorAll(".accordion-minimal-item");
        accordionMinimalItems.forEach(item=>{
            const headerBtn=item.querySelector(".accordion-minimal-header");
            const content=item.querySelector(".accordion-minimal-content");
            const icon=headerBtn.querySelector(".accordion-minimal-icon");
            headerBtn.addEventListener('click',()=>{
                const isActive=item.classList.toggle('active');
                headerBtn.setAttribute('aria-expanded',isActive);
                if(icon)icon.setAttribute('icon',isActive?'mdi:minus':'mdi:plus');
                gsap.to(content,{maxHeight:isActive?content.scrollHeight:0,paddingBottom:isActive?'var(--spacing-l)':0,duration:.5,ease:"power3.inOut"});
            });
        });

        const testimonialSlidesModern=gsap.utils.toArray(".testimonial-slide-modern");
        const prevTestimonialModernBtn=document.querySelector(".prev-testimonial-modern");
        const nextTestimonialModernBtn=document.querySelector(".next-testimonial-modern");
        let currentTestimonialModern=0;let isTestimonialAnimating=!1;

        function showTestimonialModern(index,direction="next"){
            if(testimonialSlidesModern.length===0||isTestimonialAnimating)return;isTestimonialAnimating=!0;
            const oldSlide=testimonialSlidesModern[currentTestimonialModern];const newSlide=testimonialSlidesModern[index];
            gsap.timeline({onComplete:()=>isTestimonialAnimating=!1})
                .to(oldSlide,{autoAlpha:0,xPercent:direction==="next"?-25:25,duration:.4,ease:"power2.in"})
                .set(oldSlide,{display:'none'})
                .set(newSlide,{display:'block',autoAlpha:0,xPercent:direction==="next"?25:-25,scale:.98})
                .to(newSlide,{autoAlpha:1,xPercent:0,scale:1,duration:.55,ease:"power3.out"});
            currentTestimonialModern=index;
            testimonialSlidesModern.forEach(s=>s.classList.remove('active'));newSlide.classList.add('active');
        }
        if(testimonialSlidesModern.length>0){
            gsap.set(testimonialSlidesModern,{display:'none',autoAlpha:0});
            gsap.set(testimonialSlidesModern[0],{display:'block',autoAlpha:1});
            testimonialSlidesModern[0].classList.add('active');
            if(prevTestimonialModernBtn&&nextTestimonialModernBtn){
                nextTestimonialModernBtn.addEventListener('click',()=>{let newIndex=(currentTestimonialModern+1)%testimonialSlidesModern.length;showTestimonialModern(newIndex,"next")});
                prevTestimonialModernBtn.addEventListener('click',()=>{let newIndex=(currentTestimonialModern-1+testimonialSlidesModern.length)%testimonialSlidesModern.length;showTestimonialModern(newIndex,"prev")});
            }
        }

        const animateOnScrollElements=gsap.utils.toArray(".animate-on-scroll, .animate-sticky-title, .animate-scroll-item");
        animateOnScrollElements.forEach(elem=>{
            const delay=parseFloat(elem.dataset.delay)||0;
            let startY=50;let startX=0;let startScale=1;
            if(elem.classList.contains('animate-from-left')){startX=-50;startY=0}
            if(elem.classList.contains('animate-from-right')){startX=50;startY=0}
            if(elem.classList.contains('animate-scale-in')){startScale=.9}
            gsap.fromTo(elem,{autoAlpha:0,y:startY,x:startX,scale:startScale},{
                autoAlpha:1,y:0,x:0,scale:1,duration:1,delay:delay,
                scrollTrigger:{trigger:elem,start:"top 88%",toggleActions:"play none none none"},ease:"power3.out"
            });
        });
        document.querySelectorAll("#current-year-footer, #current-year-mobile").forEach(span=>{if(span)span.textContent=(new Date).getFullYear()});
        ScrollTrigger.refresh();
    }
});