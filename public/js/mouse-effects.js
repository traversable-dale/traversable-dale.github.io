// tiltStrength | line 156

// ============================================
// MOBILE DETECTION
// Automatically detect mobile/touch devices
// ============================================
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || ('ontouchstart' in window) 
    || (navigator.maxTouchPoints > 0);
};

const IS_MOBILE = isMobile();

// Log for debugging
if (IS_MOBILE) {
  console.log('Mobile/Touch device detected - mouse effects disabled');
} else {
  console.log('Desktop device - mouse effects enabled');
}

// ============================================
// MOUSE EFFECTS CONFIGURATION
// Effects automatically disabled on mobile devices
// ============================================
const CONFIG = {
  spotlightEffect: !IS_MOBILE,   // Disabled on mobile
  rippleEffect: !IS_MOBILE,      // Disabled on mobile
  glowEffect: !IS_MOBILE,        // Disabled on mobile
  tiltEffect: !IS_MOBILE,        // Disabled on mobile
  boldTextGlow: !IS_MOBILE,      // Disabled on mobile
  borderRepel: !IS_MOBILE,       // Disabled on mobile
  tiltStrength: 30
};

// ============================================
// MOUSE TRACKING (Desktop only)
// ============================================
let mouseX = 0;
let mouseY = 0;

if (!IS_MOBILE) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
}

// ============================================
// INITIALIZE - Add required HTML elements
// ============================================
function initMouseEffects() {
  // Add spotlight overlay if it doesn't exist (desktop only)
  if (!IS_MOBILE && !document.querySelector('.spotlight-overlay')) {
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight-overlay';
    document.body.appendChild(spotlight);
  }
  
  // Initialize all effects (automatically skipped on mobile via CONFIG)
  if (CONFIG.spotlightEffect) initSpotlight();
  if (CONFIG.rippleEffect) initRipples();
  if (CONFIG.glowEffect) initGlow();
  if (CONFIG.tiltEffect) initTilt();
  if (CONFIG.boldTextGlow) initBoldTextGlow();
  
  // ALWAYS initialize borders (but only add repel effect on desktop)
  initBorderRepel();
  
  initFooterAnimation(); // Always initialize footer animation
  initFooterIconRepel(); // Initialize footer icon repel effect  
  initFooterBorder(); // Initialize footer interactive border
}

// ============================================
// SPOTLIGHT EFFECT
// Only activates over images and bold text
// ============================================
function initSpotlight() {
  const spotlight = document.querySelector('.spotlight-overlay');
  if (!spotlight) return;
  
  // Track if mouse is over a spotlight target
  let isOverTarget = false;
  
  // Update spotlight position on mouse move
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    spotlight.style.setProperty('--mouse-x', x + '%');
    spotlight.style.setProperty('--mouse-y', y + '%');
    
    // Check if mouse is over an image or bold text
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const isOverImage = element && element.tagName === 'IMG';
    const isOverBold = element && (element.tagName === 'STRONG' || element.tagName === 'B');
    
    isOverTarget = isOverImage || isOverBold;
    spotlight.classList.toggle('active', isOverTarget);
  });
  
  // Add hover listeners to images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('mouseenter', () => {
      spotlight.classList.add('active');
    });
    img.addEventListener('mouseleave', () => {
      spotlight.classList.remove('active');
    });
  });
  
  // Add hover listeners to bold text
  const boldElements = document.querySelectorAll('strong, b');
  boldElements.forEach(bold => {
    bold.addEventListener('mouseenter', () => {
      spotlight.classList.add('active');
    });
    bold.addEventListener('mouseleave', () => {
      spotlight.classList.remove('active');
    });
  });
}

// ============================================
// RIPPLE EFFECT
// ============================================
function initRipples() {
  document.addEventListener('click', (e) => {
    // Create multiple ripples for variety (optional)
    createRipple(e.clientX, e.clientY);
    
    // Uncomment below for multiple ripples per click
    // setTimeout(() => createRipple(e.clientX, e.clientY), 100);
    // setTimeout(() => createRipple(e.clientX, e.clientY), 200);
  });
}

function createRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  document.body.appendChild(ripple);
  
  // Remove ripple after animation completes
  setTimeout(() => ripple.remove(), 600);
}

// ============================================
// CARD GLOW EFFECT
// ============================================
function initGlow() {
  const projectItems = document.querySelectorAll('.project-item');
  
  projectItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      item.style.setProperty('--glow-x', x + '%');
      item.style.setProperty('--glow-y', y + '%');
    });
  });
}

// ============================================
// 3D TILT EFFECT
// ============================================
function initTilt() {
  const projectItems = document.querySelectorAll('.project-item');
  
  projectItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // ADJUST THESE VALUES to change tilt intensity
      const tiltStrength = 0; // Lower = less tilt, Higher = more tilt
      const rotateX = ((y - centerY) / centerY) * -tiltStrength;
      const rotateY = ((x - centerX) / centerX) * tiltStrength;
      
      item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// ============================================
// BOLD TEXT MAGNETIC GRAVITY EFFECT
// Each character is individually pulled toward mouse like magnets
// ============================================
function initBoldTextGlow() {
  const boldElements = document.querySelectorAll('strong, b');
  const magneticRange = 20; // ADJUST THIS - max distance for magnetic effect (pixels)
  const magneticStrength = 3; // ADJUST THIS - how strong the pull is (0.1 = subtle, 0.5 = strong)
  
  // Get transition speed from CSS variable (fallback to 1s if not set)
  const transitionSpeed = getComputedStyle(document.documentElement)
    .getPropertyValue('--transition-speed').trim() || '1s';
  
  // Split each bold element into individual character spans
  boldElements.forEach(bold => {
    // Skip if already processed
    if (bold.classList.contains('magnetized')) return;
    
    const text = bold.textContent;
    bold.innerHTML = ''; // Clear the original text
    
    // Create a span for each character (including spaces)
    text.split('').forEach(char => {
      const span = document.createElement('span');
      // Preserve spaces by using a non-breaking space
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.transition = `transform ${transitionSpeed} ease-out`;
      span.style.position = 'relative';
      bold.appendChild(span);
    });
    
    // Mark as processed
    bold.classList.add('magnetized');
  });
  
  // Get all character spans
  const characterSpans = document.querySelectorAll('strong span, b span');
  
  document.addEventListener('mousemove', (e) => {
    let anyCharacterNear = false;
    
    characterSpans.forEach(span => {
      const rect = span.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;
      
      // Calculate distance and direction from character to mouse
      const deltaX = e.clientX - charCenterX;
      const deltaY = e.clientY - charCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < magneticRange) {
        // Calculate magnetic pull strength (stronger when closer)
        const pullStrength = (1 - distance / magneticRange) * magneticStrength;
        
        // Calculate how much to move the character
        const moveX = deltaX * pullStrength;
        const moveY = deltaY * pullStrength;
        
        // Apply the magnetic pull transform to this character
        span.style.transform = `translate(${moveX}px, ${moveY}px)`;
        
        anyCharacterNear = true;
      } else {
        // Reset position when mouse is far
        span.style.transform = 'translate(0, 0)';
      }
    });
    
    // Apply glow effect to parent bold elements if any character is near
    boldElements.forEach(bold => {
      const hasNearChar = Array.from(bold.querySelectorAll('span')).some(span => {
        const rect = span.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;
        const deltaX = e.clientX - charCenterX;
        const deltaY = e.clientY - charCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        return distance < magneticRange;
      });
      
      if (hasNearChar) {
        bold.classList.add('mouse-near');
      } else {
        bold.classList.remove('mouse-near');
      }
    });
  });
  
  // Reset all characters when mouse leaves the page
  document.addEventListener('mouseleave', () => {
    characterSpans.forEach(span => {
      span.style.transform = 'translate(0, 0)';
    });
    boldElements.forEach(bold => {
      bold.classList.remove('mouse-near');
    });
  });
}

// ============================================
// BORDER REPEL EFFECT
// Make === characters scatter away from mouse
// ============================================
function initBorderRepel() {
  const repelRange = 100; // Distance at which characters start to repel (pixels)
  const repelStrength = 150; // How far characters push away (pixels)
  
  // Get transition speed from CSS variable
  const transitionSpeed = getComputedStyle(document.documentElement)
    .getPropertyValue('--transition-speed').trim() || '1s';
  
  // Find all headings that might have borders
  const headings = document.querySelectorAll('h1, h2, h3, h4, .terminal h1, .terminal h2, .terminal h3, .terminal h4');
  
  headings.forEach(heading => {
    // Skip if already processed
    if (heading.classList.contains('border-repelled')) return;
    
    // Look for the ::after pseudo-element border by checking computed styles
    const afterContent = window.getComputedStyle(heading, '::after').content;
    
    // If there's content in ::after (the border), we need to recreate it
    if (afterContent && afterContent !== 'none' && afterContent !== '""') {
      // Create a wrapper for the border characters
      const borderWrapper = document.createElement('div');
      borderWrapper.className = 'repel-border';
      borderWrapper.style.cssText = `
        display: block;
        width: 100%;
        overflow: visible;
        white-space: nowrap;
        line-height: 1;
        margin-top: 0.2em;
        position: relative;
        left: 0;
      `;
      
      // Insert after the heading first (needed for measurements)
      heading.parentNode.insertBefore(borderWrapper, heading.nextSibling);
      
      // Create a temporary character to measure its actual width
      const tempChar = document.createElement('span');
      tempChar.textContent = '=';
      tempChar.style.display = 'inline-block';
      tempChar.style.visibility = 'hidden';
      tempChar.style.position = 'absolute';
      borderWrapper.appendChild(tempChar);
      
      // Measure the actual character width
      const charWidth = tempChar.offsetWidth;
      borderWrapper.removeChild(tempChar);
      
      // Use the border wrapper's own width (which is already constrained by its parent)
      // This is more reliable than trying to calculate container width
      const availableWidth = borderWrapper.offsetWidth;
      const charCount = Math.floor(availableWidth / charWidth);
      
      for (let i = 0; i < charCount; i++) {
        const span = document.createElement('span');
        span.textContent = ' • ';
        span.style.display = 'inline-block';
        span.style.transition = `transform ${transitionSpeed} ease-out`;
        span.style.position = 'relative';
        borderWrapper.appendChild(span);
      }
      
      // Mark as processed
      heading.classList.add('border-repelled');
      
      // Store reference to border wrapper
      heading.borderWrapper = borderWrapper;
    }
  });
  
  // Recalculate heading borders on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      headings.forEach(heading => {
        const borderWrapper = heading.borderWrapper;
        
        if (!borderWrapper) return;
        
        // Clear existing characters
        borderWrapper.innerHTML = '';
        
        // Measure character width again
        const tempChar = document.createElement('span');
        tempChar.textContent = '=';
        tempChar.style.display = 'inline-block';
        tempChar.style.visibility = 'hidden';
        tempChar.style.position = 'absolute';
        borderWrapper.appendChild(tempChar);
        const newCharWidth = tempChar.offsetWidth;
        borderWrapper.removeChild(tempChar);
        
        // Use the border wrapper's own width
        const availableWidth = borderWrapper.offsetWidth;
        const newCharCount = Math.floor(availableWidth / newCharWidth);
        
        // Recreate characters
        for (let i = 0; i < newCharCount; i++) {
          const span = document.createElement('span');
          span.textContent = '•';
          span.style.display = 'inline-block';
          span.style.transition = `transform ${transitionSpeed} ease-out`;
          span.style.position = 'relative';
          borderWrapper.appendChild(span);
        }
      });
    }, 250); // Debounce resize events
  });
  
  // Mouse move handler for repel effect (DESKTOP ONLY)
  // We query the characters each time to catch any newly created ones
  if (!IS_MOBILE) {
    document.addEventListener('mousemove', (e) => {
      // Get all border characters (including newly created ones after resize)
      const borderChars = document.querySelectorAll('.repel-border span');
      
      borderChars.forEach(span => {
        const rect = span.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from character to mouse
        const deltaX = charCenterX - e.clientX;
        const deltaY = charCenterY - e.clientY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < repelRange) {
          // Calculate repel strength (stronger when closer)
          const pushStrength = (1 - distance / repelRange) * repelStrength;
          
          // Normalize direction vector
          const dirX = deltaX / distance;
          const dirY = deltaY / distance;
          
          // Calculate how much to move the character (push AWAY from mouse)
          const moveX = dirX * pushStrength;
          const moveY = dirY * pushStrength;
          
          // Apply the repel transform
          span.style.transform = `translate(${moveX}px, ${moveY}px)`;
          
          // Optional: Make characters turn orange when repelled
          span.style.color = '#ff6600';
        } else {
          // Reset position and color when mouse is far
          span.style.transform = 'translate(0, 0)';
          span.style.color = '';
        }
      });
    });
    
    // Reset all characters when mouse leaves the page
    document.addEventListener('mouseleave', () => {
      // Re-query to catch any newly created characters
      const borderChars = document.querySelectorAll('.repel-border span');
      borderChars.forEach(span => {
        span.style.transform = 'translate(0, 0)';
        span.style.color = '';
      });
    });
  }
}

// ============================================
// FOOTER INTERACTIVE BORDER
// Create repel border at top of footer
// ============================================
function initFooterBorder() {
  const footer = document.querySelector('.custom-footer');
  
  if (!footer) return; // Exit if no footer found
  
  const repelRange = 100; // Same as your adjusted border repel
  const repelStrength = 150; // Same as your adjusted border repel
  
  // Get transition speed from CSS variable
  const transitionSpeed = getComputedStyle(document.documentElement)
    .getPropertyValue('--transition-speed').trim() || '1s';
  
  // Create the border wrapper
  const borderWrapper = document.createElement('div');
  borderWrapper.className = 'footer-border-wrapper repel-border';
  borderWrapper.style.cssText = `
    display: block;
    width: 100%;
    overflow: visible;
    white-space: nowrap;
    line-height: 1;
    position: relative;
    left: 0;
  `;
  
  // Create a temporary character to measure its actual width
  const tempChar = document.createElement('span');
  tempChar.textContent = '=';
  tempChar.style.visibility = 'hidden';
  tempChar.style.position = 'absolute';
  borderWrapper.appendChild(tempChar);
  footer.insertBefore(borderWrapper, footer.firstChild);
  
  // Measure the actual character width
  const charWidth = tempChar.offsetWidth;
  borderWrapper.removeChild(tempChar);
  
  // Calculate number of characters needed for full width
  const footerWidth = footer.offsetWidth;
  const charCount = Math.floor(footerWidth / charWidth);
  
  // Create individual span for each = character
  for (let i = 0; i < charCount; i++) {
    const span = document.createElement('span');
    span.textContent = '•';
    span.style.display = 'inline-block';
    span.style.transition = `transform ${transitionSpeed} ease-out, color 0.3s ease-in-out`;
    span.style.position = 'relative';
    span.className = 'footer-border-char';
    borderWrapper.appendChild(span);
  }
  
  // Recalculate on window resize to prevent overflow
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Clear existing characters
      borderWrapper.innerHTML = '';
      
      // Measure character width again
      const tempChar = document.createElement('span');
      tempChar.textContent = '=';
      tempChar.style.visibility = 'hidden';
      tempChar.style.position = 'absolute';
      borderWrapper.appendChild(tempChar);
      const newCharWidth = tempChar.offsetWidth;
      borderWrapper.removeChild(tempChar);
      
      // Recalculate character count
      const newFooterWidth = footer.offsetWidth;
      const newCharCount = Math.floor(newFooterWidth / newCharWidth);
      
      // Recreate characters
      for (let i = 0; i < newCharCount; i++) {
        const span = document.createElement('span');
        span.textContent = '•';
        span.style.display = 'inline-block';
        span.style.transition = `transform ${transitionSpeed} ease-out, color 0.3s ease-in-out`;
        span.style.position = 'relative';
        span.className = 'footer-border-char';
        borderWrapper.appendChild(span);
      }
    }, 250); // Debounce resize events
  });
  
  // Mouse move handler for repel effect (DESKTOP ONLY)
  if (!IS_MOBILE) {
    document.addEventListener('mousemove', (e) => {
      // Re-query footer border characters to catch newly created ones after resize
      const borderChars = borderWrapper.querySelectorAll('span');
      
      borderChars.forEach(span => {
        const rect = span.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from character to mouse
        const deltaX = charCenterX - e.clientX;
        const deltaY = charCenterY - e.clientY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < repelRange) {
          // Calculate repel strength (stronger when closer)
          const pushStrength = (1 - distance / repelRange) * repelStrength;
          
          // Normalize direction vector
          const dirX = deltaX / distance;
          const dirY = deltaY / distance;
          
          // Calculate how much to move the character (push AWAY from mouse)
          const moveX = dirX * pushStrength;
          const moveY = dirY * pushStrength;
          
          // Apply the repel transform
          span.style.transform = `translate(${moveX}px, ${moveY}px)`;
          
          // Make characters turn orange when repelled
          span.style.color = '#ff6600';
        } else {
          // Reset position and color when mouse is far
          span.style.transform = 'translate(0, 0)';
          span.style.color = '';
        }
      });
    });
    
    // Reset all characters when mouse leaves the page
    document.addEventListener('mouseleave', () => {
      // Re-query to catch newly created characters
      const borderChars = borderWrapper.querySelectorAll('span');
      borderChars.forEach(span => {
        span.style.transform = 'translate(0, 0)';
        span.style.color = '';
      });
    });
  }
}

// ============================================
// FOOTER ICON REPEL EFFECT
// Make footer social icons push away from mouse and glow
// Uses same values as border repel (150px range, 15px strength)
// ============================================
function initFooterIconRepel() {
  const repelRange = 50; // Same as border repel
  const repelStrength = 150; // Same as border repel
  
  // Get all footer icon links
  const iconLinks = document.querySelectorAll('.footer-social a');
  
  if (!iconLinks.length) return; // Exit if no icons found
  
  // Mouse move handler for repel effect (DESKTOP ONLY)
  if (!IS_MOBILE) {
    document.addEventListener('mousemove', (e) => {
      iconLinks.forEach(link => {
        const rect = link.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const iconCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from icon to mouse
        const deltaX = iconCenterX - e.clientX;
        const deltaY = iconCenterY - e.clientY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < repelRange) {
          // Calculate repel strength (stronger when closer)
          const pushStrength = (1 - distance / repelRange) * repelStrength;
          
          // Normalize direction vector
          const dirX = deltaX / distance;
          const dirY = deltaY / distance;
          
          // Calculate how much to move the icon (push AWAY from mouse)
          const moveX = dirX * pushStrength;
          const moveY = dirY * pushStrength;
          
          // Apply the repel transform
          link.style.transform = `translate(${moveX}px, ${moveY}px)`;
          
          // Add glow class when near
          link.classList.add('icon-near');
        } else {
          // Reset position and remove glow when mouse is far
          link.style.transform = 'translate(0, 0)';
          link.classList.remove('icon-near');
        }
      });
    });
    
    // Reset all icons when mouse leaves the page
    document.addEventListener('mouseleave', () => {
      iconLinks.forEach(link => {
        link.style.transform = 'translate(0, 0)';
        link.classList.remove('icon-near');
      });
    });
  }
}

// ============================================
// FOOTER SCROLL ANIMATION
// Animate footer when it comes into view
// ============================================
function initFooterAnimation() {
  const footer = document.querySelector('.custom-footer');
  
  if (!footer) return; // Exit if no footer found
  
  // Create Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class when footer enters viewport
        footer.classList.add('visible');
        // Optional: Stop observing after first animation
        // observer.unobserve(footer);
      } else {
        // Remove visible class when footer leaves viewport
        // This makes it re-animate on each scroll
        footer.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.1 // Trigger when 10% of footer is visible
  });
  
  // Start observing the footer
  observer.observe(footer);
}

// ============================================
// TOGGLE EFFECTS (OPTIONAL CONTROLS)
// ============================================
function toggleEffect(effectName) {
  CONFIG[effectName] = !CONFIG[effectName];
  
  if (effectName === 'spotlightEffect') {
    const spotlight = document.querySelector('.spotlight-overlay');
    if (spotlight) {
      spotlight.classList.toggle('active', CONFIG[effectName]);
    }
  }
  
  console.log(`${effectName} is now ${CONFIG[effectName] ? 'ON' : 'OFF'}`);
}

// Example: Add this to your HTML if you want manual toggle buttons
// <button onclick="toggleEffect('glowEffect')">Toggle Glow</button>

// ============================================
// AUTO-INITIALIZE
// Run when page loads
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMouseEffects);
} else {
  initMouseEffects();
}

// Alternative: Export for manual initialization
// export { initMouseEffects, toggleEffect, CONFIG };
