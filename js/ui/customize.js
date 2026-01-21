// customize.js - Theme Customization System

// Theme state
const themeState = {
    primaryColor: '#00ff88',
    backgroundColor: '#0a0a0f',
    textColor: '#d4d4d8',
    glassBlur: 20,
    glassOpacity: 0.2,
    borderThickness: 1,
    glowColor: '#00ff88',
    glowIntensity: 15,
    neonEnabled: true,
    animationSpeed: 1,
    bgImage: '',
    bgOverlay: 0.85,
    bgMusic: '',
    musicVolume: 0.5,
    profileName: 'Player',
    avatar: 'assets/icons/avatar-placeholder.png',
    animations: {
        hoverScale: true,
        hoverGlow: true,
        hoverShake: false
    },
    particles: {
        snow: true,
        stars: false,
        matrix: false
    }
};

// Audio element
let backgroundMusic = null;

/* ========== INITIALIZATION ========== */
function initCustomize() {
    loadThemeFromStorage();
    setupEventListeners();
    updateLivePreview();
    initAudio();
}

function setupEventListeners() {
    // Color pickers
    document.getElementById('colorPrimary').addEventListener('input', (e) => {
        updateColor('primary', e.target.value);
        document.getElementById('colorPrimaryHex').value = e.target.value;
    });
    
    document.getElementById('colorPrimaryHex').addEventListener('input', (e) => {
        const hex = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
        updateColor('primary', hex);
        document.getElementById('colorPrimary').value = hex;
    });
    
    document.getElementById('colorBg').addEventListener('input', (e) => {
        updateColor('bg', e.target.value);
    });
    
    document.getElementById('colorText').addEventListener('input', (e) => {
        updateColor('text', e.target.value);
    });
    
    document.getElementById('glowColor').addEventListener('input', (e) => {
        updateGlow(e.target.value);
    });
    
    // Sliders
    document.getElementById('blurAmount').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('blurValue').textContent = value;
        updateGlassBlur(value);
    });
    
    document.getElementById('glassOpacity').addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        document.getElementById('opacityValue').textContent = value.toFixed(2);
        updateGlassOpacity(value);
    });
    
    document.getElementById('borderThickness').addEventListener('input', (e) => {
        updateBorderThickness(parseFloat(e.target.value));
    });
    
    document.getElementById('glowIntensity').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('glowValue').textContent = value;
        updateGlowIntensity(value);
    });
    
    document.getElementById('animationSpeed').addEventListener('change', (e) => {
        updateAnimationSpeed(parseFloat(e.target.value));
    });
    
    document.getElementById('bgImage').addEventListener('change', (e) => {
        updateBackgroundImage(e.target.value);
    });
    
    document.getElementById('bgOverlay').addEventListener('input', (e) => {
        updateBackgroundOverlay(parseFloat(e.target.value));
    });
    
    document.getElementById('bgMusic').addEventListener('change', (e) => {
        updateBackgroundMusic(e.target.value);
    });
    
    document.getElementById('musicVolume').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('musicVolumeValue').textContent = value;
        updateMusicVolume(value / 100);
    });
    
    document.getElementById('profileName').addEventListener('input', (e) => {
        updateProfileName(e.target.value);
    });
}

/* ========== THEME UPDATERS ========== */
function updateColor(type, color) {
    switch(type) {
        case 'primary':
            document.documentElement.style.setProperty('--primary', color);
            themeState.primaryColor = color;
            break;
        case 'bg':
            document.documentElement.style.setProperty('--bg-col', color);
            themeState.backgroundColor = color;
            break;
        case 'text':
            document.documentElement.style.setProperty('--text-main', color);
            themeState.textColor = color;
            break;
    }
    updateLivePreview();
}

function updateGlassBlur(blur) {
    document.documentElement.style.setProperty('--glass-blur', `${blur}px`);
    themeState.glassBlur = blur;
    updateGlassEffects();
}

function updateGlassOpacity(opacity) {
    document.documentElement.style.setProperty('--glass-opacity', opacity);
    themeState.glassOpacity = opacity;
    updateGlassEffects();
}

function updateBorderThickness(thickness) {
    document.documentElement.style.setProperty('--border-thickness', `${thickness}px`);
    themeState.borderThickness = thickness;
}

function updateGlow(color) {
    document.documentElement.style.setProperty('--glow-color', color);
    themeState.glowColor = color;
    updateLivePreview();
}

function updateGlowIntensity(intensity) {
    document.documentElement.style.setProperty('--glow-intensity', `${intensity}px`);
    themeState.glowIntensity = intensity;
}

function updateAnimationSpeed(speed) {
    document.documentElement.style.setProperty('--animation-speed', speed);
    themeState.animationSpeed = speed;
    
    const speedText = speed === 0.5 ? 'Slow' : 
                     speed === 1 ? 'Normal' : 
                     speed === 1.5 ? 'Fast' : 'Very Fast';
    document.getElementById('speedValue').textContent = speedText;
}

function updateBackgroundImage(url) {
    if (url) {
        document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,var(--bg-overlay)), rgba(0,0,0,var(--bg-overlay))), url('${url}')`;
    } else {
        document.body.style.backgroundImage = '';
    }
    themeState.bgImage = url;
}

function updateBackgroundOverlay(opacity) {
    document.documentElement.style.setProperty('--bg-overlay', opacity);
    themeState.bgOverlay = opacity;
}

/* ========== GLASS EFFECTS ========== */
function updateGlassEffects() {
    const blur = themeState.glassBlur;
    const opacity = themeState.glassOpacity;
    
    document.querySelectorAll('.glass-panel-outer').forEach(panel => {
        panel.style.backdropFilter = `blur(${blur}px)`;
        panel.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
    });
}

/* ========== ANIMATION CONTROLS ========== */
function toggleAnimation(type) {
    themeState.animations[type] = !themeState.animations[type];
    
    const button = document.querySelector(`[onclick="toggleAnimation('${type}')"]`);
    if (themeState.animations[type]) {
        button.classList.remove('bg-red-500/20', 'text-red-400', 'border-red-500/30');
        button.classList.add('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
        
        // Add CSS class for animation
        document.body.classList.add(`anim-${type}`);
    } else {
        button.classList.remove('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
        button.classList.add('bg-red-500/20', 'text-red-400', 'border-red-500/30');
        
        // Remove CSS class
        document.body.classList.remove(`anim-${type}`);
    }
}

function toggleNeon() {
    themeState.neonEnabled = !themeState.neonEnabled;
    const button = document.getElementById('neonToggle');
    
    if (themeState.neonEnabled) {
        button.innerHTML = '<i class="fa-solid fa-lightbulb mr-1"></i> Neon: ON';
        button.classList.remove('bg-red-500/20', 'text-red-400', 'border-red-500/30');
        button.classList.add('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/30');
        
        // Add neon effects
        document.body.classList.add('neon-enabled');
    } else {
        button.innerHTML = '<i class="fa-solid fa-lightbulb mr-1"></i> Neon: OFF';
        button.classList.remove('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/30');
        button.classList.add('bg-red-500/20', 'text-red-400', 'border-red-500/30');
        
        // Remove neon effects
        document.body.classList.remove('neon-enabled');
    }
}

function pulseGlow() {
    document.body.classList.add('pulse-glow');
    setTimeout(() => {
        document.body.classList.remove('pulse-glow');
    }, 2000);
}

/* ========== PARTICLE EFFECTS ========== */
function toggleParticles(type) {
    themeState.particles[type] = !themeState.particles[type];
    
    const button = document.querySelector(`[onclick="toggleParticles('${type}')"]`);
    const container = document.getElementById('particlesContainer') || createParticlesContainer();
    
    if (themeState.particles[type]) {
        button.classList.remove('bg-red-500/20', 'text-red-400', 'border-red-500/30');
        button.classList.add('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
        startParticles(type);
    } else {
        button.classList.remove('bg-blue-500/20', 'text-blue-400', 'border-blue-500/30');
        button.classList.add('bg-red-500/20', 'text-red-400', 'border-red-500/30');
        stopParticles(type);
    }
}

function createParticlesContainer() {
    const container = document.createElement('div');
    container.id = 'particlesContainer';
    container.className = 'absolute inset-0 pointer-events-none z-0';
    document.querySelector('body').appendChild(container);
    return container;
}

function startParticles(type) {
    const container = document.getElementById('particlesContainer');
    
    switch(type) {
        case 'snow':
            initSnow(); // Reuse existing snow function
            break;
        case 'stars':
            createStars();
            break;
        case 'matrix':
            createMatrixRain();
            break;
    }
}

function stopParticles(type) {
    const container = document.getElementById('particlesContainer');
    if (container) {
        container.innerHTML = '';
    }
}

function createStars() {
    const container = document.getElementById('particlesContainer');
    for(let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.animationDuration = Math.random() * 3 + 1 + 's';
        star.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(star);
    }
}

function createMatrixRain() {
    const container = document.getElementById('particlesContainer');
    const chars = '01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for(let i = 0; i < 30; i++) {
        const stream = document.createElement('div');
        stream.className = 'matrix-stream';
        stream.style.left = (Math.random() * 100) + 'vw';
        
        for(let j = 0; j < 20; j++) {
            const char = document.createElement('span');
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            char.style.animationDelay = (Math.random() * 5) + 's';
            stream.appendChild(char);
        }
        
        container.appendChild(stream);
    }
}

/* ========== AUDIO CONTROLS ========== */
function initAudio() {
    backgroundMusic = new Audio();
    backgroundMusic.loop = true;
    backgroundMusic.volume = themeState.musicVolume;
}

function playMusic() {
    if (backgroundMusic && themeState.bgMusic) {
        if (backgroundMusic.src !== themeState.bgMusic) {
            backgroundMusic.src = themeState.bgMusic;
        }
        backgroundMusic.play().catch(e => {
            console.log("Audio play failed:", e);
            showToast("Click to enable audio", "info");
        });
    }
}

function pauseMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}

function updateBackgroundMusic(url) {
    themeState.bgMusic = url;
    if (backgroundMusic) {
        backgroundMusic.pause();
        if (url) {
            backgroundMusic.src = url;
            // Auto-play if user previously played music
            if (backgroundMusic.volume > 0) {
                playMusic();
            }
        }
    }
}

function updateMusicVolume(volume) {
    themeState.musicVolume = volume;
    if (backgroundMusic) {
        backgroundMusic.volume = volume;
    }
}

/* ========== PROFILE ========== */
function updateProfileName(name) {
    themeState.profileName = name;
    // Update header or profile display if exists
    const profileDisplay = document.querySelector('.profile-name');
    if (profileDisplay) {
        profileDisplay.textContent = name;
    }
}

function changeAvatar() {
    // In a real app, this would open a file picker
    const newAvatar = prompt("Enter avatar URL:", themeState.avatar);
    if (newAvatar) {
        themeState.avatar = newAvatar;
        document.getElementById('avatarPreview').src = newAvatar;
    }
}

/* ========== PRESETS ========== */
function loadPreset(presetName) {
    const presets = {
        cyberpunk: {
            primaryColor: '#00ff88',
            backgroundColor: '#0a0a0f',
            glowColor: '#00ff88',
            glassBlur: 25,
            neonEnabled: true
        },
        dark: {
            primaryColor: '#ffffff',
            backgroundColor: '#000000',
            glowColor: '#3b82f6',
            glassBlur: 10,
            neonEnabled: false
        },
        neon: {
            primaryColor: '#ff00ff',
            backgroundColor: '#110022',
            glowColor: '#ff00ff',
            glassBlur: 30,
            neonEnabled: true
        },
        matrix: {
            primaryColor: '#00ff00',
            backgroundColor: '#001100',
            glowColor: '#00ff00',
            glassBlur: 15,
            neonEnabled: true
        },
        synthwave: {
            primaryColor: '#ff6b9d',
            backgroundColor: '#1a0b2e',
            glowColor: '#ff6b9d',
            glassBlur: 20,
            neonEnabled: true
        },
        gold: {
            primaryColor: '#ffd700',
            backgroundColor: '#1a1500',
            glowColor: '#ffd700',
            glassBlur: 15,
            neonEnabled: true
        }
    };
    
    const preset = presets[presetName];
    if (preset) {
        Object.keys(preset).forEach(key => {
            if (themeState.hasOwnProperty(key)) {
                themeState[key] = preset[key];
            }
        });
        
        applyThemeState();
        updateUIFromState();
        updateLivePreview();
        showToast(`Loaded ${presetName} preset`, 'info');
    }
}

function applyThemeState() {
    // Apply all theme state to CSS variables
    updateColor('primary', themeState.primaryColor);
    updateColor('bg', themeState.backgroundColor);
    updateColor('text', themeState.textColor);
    updateGlow(themeState.glowColor);
    updateGlassBlur(themeState.glassBlur);
    updateGlassOpacity(themeState.glassOpacity);
    updateGlowIntensity(themeState.glowIntensity);
    updateAnimationSpeed(themeState.animationSpeed);
    updateBackgroundImage(themeState.bgImage);
    updateBackgroundOverlay(themeState.bgOverlay);
    updateMusicVolume(themeState.musicVolume);
    
    // Apply toggle states
    if (themeState.neonEnabled) {
        document.body.classList.add('neon-enabled');
    } else {
        document.body.classList.remove('neon-enabled');
    }
    
    Object.keys(themeState.animations).forEach(anim => {
        if (themeState.animations[anim]) {
            document.body.classList.add(`anim-${anim}`);
        } else {
            document.body.classList.remove(`anim-${anim}`);
        }
    });
}

function updateUIFromState() {
    // Update form inputs from state
    document.getElementById('colorPrimary').value = themeState.primaryColor;
    document.getElementById('colorPrimaryHex').value = themeState.primaryColor;
    document.getElementById('colorBg').value = themeState.backgroundColor;
    document.getElementById('colorText').value = themeState.textColor;
    document.getElementById('glowColor').value = themeState.glowColor;
    document.getElementById('blurAmount').value = themeState.glassBlur;
    document.getElementById('glassOpacity').value = themeState.glassOpacity;
    document.getElementById('borderThickness').value = themeState.borderThickness;
    document.getElementById('glowIntensity').value = themeState.glowIntensity;
    document.getElementById('animationSpeed').value = themeState.animationSpeed;
    document.getElementById('bgImage').value = themeState.bgImage;
    document.getElementById('bgOverlay').value = themeState.bgOverlay;
    document.getElementById('bgMusic').value = themeState.bgMusic;
    document.getElementById('musicVolume').value = themeState.musicVolume * 100;
    document.getElementById('profileName').value = themeState.profileName;
    document.getElementById('avatarPreview').src = themeState.avatar;
    
    // Update display values
    document.getElementById('blurValue').textContent = themeState.glassBlur;
    document.getElementById('opacityValue').textContent = themeState.glassOpacity.toFixed(2);
    document.getElementById('glowValue').textContent = themeState.glowIntensity;
    document.getElementById('musicVolumeValue').textContent = Math.round(themeState.musicVolume * 100);
    
    const speedText = themeState.animationSpeed === 0.5 ? 'Slow' : 
                     themeState.animationSpeed === 1 ? 'Normal' : 
                     themeState.animationSpeed === 1.5 ? 'Fast' : 'Very Fast';
    document.getElementById('speedValue').textContent = speedText;
    
    // Update toggle buttons
    document.getElementById('neonToggle').innerHTML = themeState.neonEnabled ? 
        '<i class="fa-solid fa-lightbulb mr-1"></i> Neon: ON' : 
        '<i class="fa-solid fa-lightbulb mr-1"></i> Neon: OFF';
    
    document.getElementById('neonToggle').className = themeState.neonEnabled ?
        'flex-1 text-xs px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30' :
        'flex-1 text-xs px-3 py-2 bg-red-500/20 text-red-400 rounded border border-red-500/30';
}

/* ========== STORAGE ========== */
function saveThemeToProfile() {
    localStorage.setItem('neuroGambleTheme', JSON.stringify(themeState));
    showToast('Theme saved to profile!', 'info');
}

function loadThemeFromStorage() {
    const saved = localStorage.getItem('neuroGambleTheme');
    if (saved) {
        try {
            const savedTheme = JSON.parse(saved);
            Object.keys(savedTheme).forEach(key => {
                if (themeState.hasOwnProperty(key)) {
                    themeState[key] = savedTheme[key];
                }
            });
            applyThemeState();
            updateUIFromState();
        } catch (e) {
            console.error('Failed to load theme:', e);
        }
    }
}

/* ========== LIVE PREVIEW ========== */
function updateLivePreview() {
    // Update preview boxes
    const primaryPreview = document.querySelector('.glass-panel-outer:first-child .h-6');
    if (primaryPreview) {
        primaryPreview.style.backgroundColor = themeState.primaryColor;
    }
    
    const glowPreview = document.querySelector('.glow-preview');
    if (glowPreview) {
        glowPreview.style.boxShadow = `0 0 ${themeState.glowIntensity}px ${themeState.glowColor}`;
        glowPreview.style.backgroundColor = themeState.glowColor;
    }
    
    const glassPreview = document.querySelector('.glass-preview');
    if (glassPreview) {
        glassPreview.style.backdropFilter = `blur(${themeState.glassBlur}px)`;
        glassPreview.style.backgroundColor = `rgba(0, 0, 0, ${themeState.glassOpacity})`;
    }
}

/* ========== RESET ========== */
function resetTheme() {
    if (confirm('Reset theme to default?')) {
        localStorage.removeItem('neuroGambleTheme');
        
        // Reset to default values
        themeState.primaryColor = '#00ff88';
        themeState.backgroundColor = '#0a0a0f';
        themeState.textColor = '#d4d4d8';
        themeState.glassBlur = 20;
        themeState.glassOpacity = 0.2;
        themeState.borderThickness = 1;
        themeState.glowColor = '#00ff88';
        themeState.glowIntensity = 15;
        themeState.neonEnabled = true;
        themeState.animationSpeed = 1;
        themeState.bgImage = '';
        themeState.bgOverlay = 0.85;
        themeState.bgMusic = '';
        themeState.musicVolume = 0.5;
        themeState.animations = {
            hoverScale: true,
            hoverGlow: true,
            hoverShake: false
        };
        themeState.particles = {
            snow: true,
            stars: false,
            matrix: false
        };
        
        applyThemeState();
        updateUIFromState();
        updateLivePreview();
        
        // Reset background
        document.body.style.backgroundImage = '';
        
        showToast('Theme reset to default', 'info');
    }
}

/* ========== INITIALIZE ========== */
// Add CSS variables to root
function initCSSVariables() {
    const root = document.documentElement;
    root.style.setProperty('--primary', themeState.primaryColor);
    root.style.setProperty('--bg-col', themeState.backgroundColor);
    root.style.setProperty('--text-main', themeState.textColor);
    root.style.setProperty('--glass-blur', `${themeState.glassBlur}px`);
    root.style.setProperty('--glass-opacity', themeState.glassOpacity);
    root.style.setProperty('--border-thickness', `${themeState.borderThickness}px`);
    root.style.setProperty('--glow-color', themeState.glowColor);
    root.style.setProperty('--glow-intensity', `${themeState.glowIntensity}px`);
    root.style.setProperty('--animation-speed', themeState.animationSpeed);
    root.style.setProperty('--bg-overlay', themeState.bgOverlay);
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    initCSSVariables();
    initCustomize();
});

// Make functions available globally
window.toggleNeon = toggleNeon;
window.pulseGlow = pulseGlow;
window.toggleAnimation = toggleAnimation;
window.toggleParticles = toggleParticles;
window.playMusic = playMusic;
window.pauseMusic = pauseMusic;
window.changeAvatar = changeAvatar;
window.loadPreset = loadPreset;
window.resetTheme = resetTheme;
window.saveThemeToProfile = saveThemeToProfile;