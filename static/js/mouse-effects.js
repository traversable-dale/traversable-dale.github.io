// tiltStrength | line 156




// ============================================
// MOUSE EFFECTS CONFIGURATION
// Change true to false to disable any effect
// ============================================
const CONFIG = {
  spotlightEffect: true,   // Dims everything except where mouse is
  rippleEffect: true,      // Click to create ripples
  glowEffect: true,        // Cards glow where you hover
  tiltEffect: true,        // Cards tilt in 3D on hover
  boldTextGlow: true,      // Bold text glows when mouse is near
  tiltStrength: 30
};

// ============================================
// MOUSE TRACKING
// ============================================
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ============================================
// INITIALIZE - Add required HTML elements
// ============================================
function initMouseEffects() {
  // Add spotlight overlay if it doesn't exist
  if (!document.querySelector('.spotlight-overlay')) {
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight-overlay';
    document.body.appendChild(spotlight);
  }
  
  // Initialize all effects
  if (CONFIG.spotlightEffect) initSpotlight();
  if (CONFIG.rippleEffect) initRipples();
  if (CONFIG.glowEffect) initGlow();
  if (CONFIG.tiltEffect) initTilt();
  if (CONFIG.boldTextGlow) initBoldTextGlow();
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
