// Main entry JavaScript (ES module)
// Extracted from inline scripts in index.html for modularization and build tooling.

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const menuOverlay = document.querySelector('.mobile-nav-overlay');
  const menuClose = document.querySelector('.mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  
  const openMobileMenu = () => {
    if (menuOverlay) {
      menuOverlay.classList.add('active');
      if (menuToggle) {
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
  };
  
  const closeMobileMenu = () => {
    if (menuOverlay) {
      menuOverlay.classList.remove('active');
      if (menuToggle) {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = ''; // Restore scroll
    }
  };
  
  // Open menu
  if (menuToggle) {
    menuToggle.addEventListener('click', openMobileMenu);
  }
  
  // Close menu
  if (menuClose) {
    menuClose.addEventListener('click', closeMobileMenu);
  }
  
  // Close menu when clicking nav links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('active')) {
      closeMobileMenu();
    }
  });
  
  // Custom Cursor Logic with RequestAnimationFrame for smooth tracking
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  
  let mouseX = 0;
  let mouseY = 0;

  // Smoothed positions for the dot and the follower
  let dotX = 0;
  let dotY = 0;
  let folX = 0;
  let folY = 0;

  // Easing factors (dot is quicker, follower lags a bit)
  const DOT_EASE = 0.35;
  const FOL_EASE = 0.12;

  // Center offsets (computed once, updated on resize)
  let cursorHalf = 6; // defaults match CSS (#cursor 12px)
  let followerHalf = 20; // defaults match CSS (#cursor-follower 40px)

  const updateSizes = () => {
    if (cursor) cursorHalf = cursor.offsetWidth / 2;
    if (follower) followerHalf = follower.offsetWidth / 2;
  };

  window.addEventListener('resize', updateSizes);
  updateSizes();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Use requestAnimationFrame + lerp for smooth, synchronized motion
  const animateCursor = () => {
    // Lerp small dot towards the current mouse position (fast)
    dotX += (mouseX - dotX) * DOT_EASE;
    dotY += (mouseY - dotY) * DOT_EASE;

    // Lerp follower (slower) for a natural trailing circle
    folX += (mouseX - folX) * FOL_EASE;
    folY += (mouseY - folY) * FOL_EASE;

    if (cursor) {
      // center the element by subtracting half its dimensions
      cursor.style.transform = `translate3d(${dotX - cursorHalf}px, ${dotY - cursorHalf}px, 0)`;
    }

    if (follower) {
      follower.style.transform = `translate3d(${folX - followerHalf}px, ${folY - followerHalf}px, 0)`;
    }

    requestAnimationFrame(animateCursor);
  };

  animateCursor();

  // Sticky Header
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Intersection Observer for Reveals
  const revealOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (entry.target.id === 'process-timeline') {
          entry.target.classList.add('active');
          document.querySelectorAll('.timeline-item').forEach((item, i) => {
            setTimeout(() => item.classList.add('visible'), i * 300);
          });
        }
      }
    });
  }, revealOptions);

  document.querySelectorAll('.reveal, #process-timeline').forEach(el => observer.observe(el));

  // Magnetic Button Effect
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  // Hero Text Entry
  const title = document.getElementById('hero-title');
  if (title) {
    title.style.transition = 'all 1.5s cubic-bezier(0.23, 1, 0.32, 1)';
    title.style.opacity = '1';
    title.style.transform = 'translateY(0)';
  }

  // Hero Slider functionality with advanced effects
  const initHeroSlider = () => {
    const sliderContainer = document.querySelector('.hero-slider-container');
    if (!sliderContainer) return; // Exit if no slider on this page

    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const heroSection = sliderContainer.closest('.hero-slider');
    let currentSlide = 0;
    let autoplayInterval = null;
    let cachedActiveSlide = null; // Cache for parallax performance
    const AUTOPLAY_DELAY_MS = 7000; // 7 seconds per slide for more immersive viewing

    // Function to go to a specific slide with enhanced transitions
    const goToSlide = (index) => {
      if (index === currentSlide) return;
      
      // Add exiting class to current slide for smooth transition
      slides[currentSlide].classList.add('exiting');
      dots[currentSlide].classList.remove('active');

      // Remove active class after a short delay
      setTimeout(() => {
        slides[currentSlide].classList.remove('active', 'exiting');
      }, 1000);

      // Update current slide index
      currentSlide = index;

      // Add active class to new slide and dot
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      
      // Update cached active slide for parallax
      if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        cachedActiveSlide = slides[currentSlide];
      }
      
      // Update slide counter
      updateSlideCounter();
    };

    // Function to go to next slide
    const nextSlide = () => {
      const next = (currentSlide + 1) % slides.length;
      goToSlide(next);
    };

    // Function to go to previous slide
    const prevSlide = () => {
      const prev = (currentSlide - 1 + slides.length) % slides.length;
      goToSlide(prev);
    };

    // Update slide counter display
    const updateSlideCounter = () => {
      const counter = document.querySelector('.hero-slide-counter');
      if (counter) {
        const current = counter.querySelector('.current');
        const total = counter.querySelector('.total');
        if (current) {
          current.textContent = String(currentSlide + 1).padStart(2, '0');
        }
        // Dynamically set total based on actual slide count
        if (total && !total.dataset.initialized) {
          total.textContent = String(slides.length).padStart(2, '0');
          total.dataset.initialized = 'true';
        }
      }
    };

    // Start autoplay
    const startAutoplay = () => {
      stopAutoplay(); // Clear any existing interval
      autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY_MS);
    };

    // Stop autoplay
    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    };

    // Add click handlers to dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        // Reset autoplay when user manually navigates
        startAutoplay();
      });
    });

    // Add arrow button handlers
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');
    
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        prevSlide();
        startAutoplay();
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        nextSlide();
        startAutoplay();
      });
    }

    // Pause autoplay on hover
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoplay);
      heroSection.addEventListener('mouseleave', startAutoplay);
    }

    // Parallax mouse tracking effect
    let mouseX = 0;
    let mouseY = 0;
    let isMouseInside = false;
    
    if (heroSection && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      sliderContainer.classList.add('parallax-active');
      
      heroSection.addEventListener('mousemove', (e) => {
        if (!isMouseInside || !cachedActiveSlide) return;
        
        const rect = heroSection.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        
        // Apply parallax effect to cached active slide
        const parallaxX = mouseX * 20;
        const parallaxY = mouseY * 20;
        const rotateX = mouseY * 2;
        const rotateY = -mouseX * 2;
        
        cachedActiveSlide.style.transform = `
          scale(1) 
          translateZ(0) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
        `;
        
        const img = cachedActiveSlide.querySelector('.hero-video-wrap img');
        if (img) {
          img.style.transform = `
            translate(${parallaxX}px, ${parallaxY}px)
          `;
        }
      });
      
      heroSection.addEventListener('mouseenter', () => {
        isMouseInside = true;
        cachedActiveSlide = document.querySelector('.hero-slide.active');
      });
      
      heroSection.addEventListener('mouseleave', () => {
        isMouseInside = false;
        // Reset transforms
        if (cachedActiveSlide) {
          cachedActiveSlide.style.transform = '';
          const img = cachedActiveSlide.querySelector('.hero-video-wrap img');
          if (img) {
            img.style.transform = '';
          }
          cachedActiveSlide = null;
        }
      });
    }

    // Keyboard navigation handler (scoped to this slider)
    const handleKeydown = (e) => {
      // Only handle keyboard if slider is in view
      const rect = sliderContainer.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (inView) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
          startAutoplay();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
          startAutoplay();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeydown);

    // Enhanced touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    const handleSwipe = () => {
      const swipeThreshold = 50; // Minimum swipe distance
      const horizontalSwipe = Math.abs(touchEndX - touchStartX);
      const verticalSwipe = Math.abs(touchEndY - touchStartY);
      
      // Only trigger if horizontal swipe is more dominant than vertical
      if (horizontalSwipe > verticalSwipe && horizontalSwipe > swipeThreshold) {
        if (touchEndX < touchStartX - swipeThreshold) {
          // Swipe left - next slide
          nextSlide();
          startAutoplay();
        } else if (touchEndX > touchStartX + swipeThreshold) {
          // Swipe right - previous slide
          prevSlide();
          startAutoplay();
        }
      }
    };

    if (heroSection) {
      heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      });

      heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
      });
    }

    // Initialize slide counter
    updateSlideCounter();

    // Start autoplay on page load
    startAutoplay();

    // Pause autoplay when page is not visible (performance optimization)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  };

  // Initialize hero slider
  initHeroSlider();

  // Simple Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Custom select / dropdown (accessible, keyboard-friendly)
  const initCustomSelects = () => {
    const selects = document.querySelectorAll('.custom-select');
    selects.forEach(select => {
      const toggle = select.querySelector('.custom-select__toggle');
      const list = select.querySelector('.custom-select__list');
      const hidden = select.querySelector('input[type="hidden"]');
      const options = Array.from(list.querySelectorAll('li'));

      const open = () => {
        select.classList.add('open');
        select.setAttribute('aria-expanded', 'true');
        list.focus();
      };

      const close = () => {
        select.classList.remove('open');
        select.setAttribute('aria-expanded', 'false');
      };

      const selectOption = (opt) => {
        const value = opt.getAttribute('data-value') || '';
        const label = opt.textContent.trim();
        // update hidden input for form
        if (hidden) hidden.value = value;
        // update button label
        if (toggle) toggle.textContent = label;
        // update aria-selected
        options.forEach(o => o.setAttribute('aria-selected', 'false'));
        opt.setAttribute('aria-selected', 'true');
        close();
      };

      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = select.classList.contains('open');
        if (isOpen) close(); else open();
      });

      // Option click
      options.forEach(opt => {
        opt.addEventListener('click', () => selectOption(opt));
        opt.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectOption(opt);
          }
        });
      });

      // keyboard support on toggle
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
          // focus first option
          const first = options[0];
          if (first) first.focus();
        }
      });

      // Close on outside click or escape
      document.addEventListener('click', (e) => {
        if (!select.contains(e.target)) close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
    });
  };

  // Initialize custom selects if present
  initCustomSelects();

  // Ensure the contact form validates custom select before submitting
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const custom = contactForm.querySelector('.custom-select');
      if (custom) {
        const hidden = custom.querySelector('input[type="hidden"]');
        // If project type is required but empty, prevent submission
        if (hidden && hidden.value === '') {
          e.preventDefault();
          // open the dropdown and focus the first option or toggle
          custom.classList.add('open');
          custom.setAttribute('aria-expanded', 'true');
          const firstOpt = custom.querySelector('.custom-select__list li:nth-child(2)');
          if (firstOpt) firstOpt.focus();
          return false;
        }
      }
    });
  }

  // Page enter/exit transitions for smoother navigation
  const initPageTransitions = () => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // respect user setting

    const docBody = document.body;
    // enable transition styling and queue the enter animation
    docBody.classList.add('transition-enabled');
    // Wait a tick so CSS can pick up the initial state, then add ready class
    requestAnimationFrame(() => {
      // Small delay so CSS picks up initial state; keep this as tiny as possible to avoid long blank screen
      setTimeout(() => docBody.classList.add('transition-ready'), 10);
    });

    // Delegate click handling to intercept internal navigation
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest && e.target.closest('a');
      if (!anchor) return;

      // skip if anchor has target, download, or no href
      const href = anchor.getAttribute('href');
      if (!href || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      // skip external links (hosts differ) and protocol-only links
      try {
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return; // external
      } catch (err) {
        return; // malformed URL, ignore
      }

      // allow same-page hash links to behave normally
      if (anchor.hash && anchor.pathname === location.pathname) return;

      // At this point we should intercept the click and animate out
      e.preventDefault();

      // If already exiting, ignore duplicate clicks
      if (docBody.classList.contains('transition-exit')) return;

      docBody.classList.remove('transition-ready');
      docBody.classList.add('transition-exit');

      // read duration from CSS variable if present
      const computed = getComputedStyle(document.documentElement).getPropertyValue('--page-transition-duration') || '480ms';
      const ms = parseFloat(computed) * (computed.indexOf('ms') > -1 ? 1 : 1000) || 480;
  const padding = 30; // extra ms to ensure animation completes but remain snappy

      setTimeout(() => {
        // navigate after animation
        window.location.href = anchor.href;
      }, ms + padding);
    }, { passive: false });
  };

  initPageTransitions();
});
