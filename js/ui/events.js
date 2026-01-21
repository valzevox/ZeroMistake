// Event listeners

/* --- THÊM HÀM NÀY ĐỂ FIX CRASH --- */
function switchGameUI(gameName) {
    if (gameName === currentActiveTab) return;
    setActiveTab(gameName);
    const select = document.getElementById('gameSelect');
    if (select) select.value = gameName;
    changeGame(false);
}

/* ========== AUDIO ========== */
function setVolume(val) {
    globalGain = val / 100;
}

function playSound(type) {
    if (globalGain <= 0.01) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    osc.type = 'triangle';
    if (type === 'click') {
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.05, now);
        osc.start(now);
        osc.stop(now + 0.1);
    }
    if (type === 'dragon') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    }
    if (type === 'circuit_breaker') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
    }
}

function showToast(msg, type = 'info') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    let bgColor = 'bg-zinc-800';
    let borderColor = 'border-white/20';

    if (type === 'win') {
        bgColor = 'bg-emerald-900/80';
        borderColor = 'border-emerald-500/50';
    } else if (type === 'lose') {
        bgColor = 'bg-rose-900/80';
        borderColor = 'border-rose-500/50';
    } else if (type === 'warning') {
        bgColor = 'bg-yellow-900/80';
        borderColor = 'border-yellow-500/50';
    } else if (type === 'circuit_breaker') {
        bgColor = 'bg-red-900/80';
        borderColor = 'border-red-500/50';
    }

    t.className = `${bgColor} ${borderColor} text-white px-4 py-3 rounded shadow-lg animate-pulse max-w-xs`;
    t.innerHTML = `<span class="font-bold text-xs font-mono uppercase">${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => { t.remove(); }, 3000);
}

/* ========== MOUSE TILT INTERACTION ========== */
function initTiltEffect() {
    const targets = ['coreContent'];
    targets.forEach(id => {
        const element = document.getElementById(id);
        if (!element) return;
        element.addEventListener('mousemove', (e) => {
            if (!typeof gsap) return;
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            const maxTilt = 8;
            const tiltX = (mouseY / rect.height) * maxTilt * -1;
            const tiltY = (mouseX / rect.width) * maxTilt;
            gsap.to(element.querySelector('.tilt-child') || element, {
                rotationX: tiltX,
                rotationY: tiltY,
                transformPerspective: 1000,
                scale: 1.02,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        element.addEventListener('mouseleave', () => {
            if (!typeof gsap) return;
            gsap.to(element.querySelector('.tilt-child') || element, {
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

/* ========== INIT EVENT LISTENERS ========== */
function initEventListeners() {
    // Initialize Risk Management
    const targetInput = document.getElementById('qlvTarget');
    const stopLossInput = document.getElementById('qlvStopLoss');
    if (targetInput) {
        targetProfit = parseInt(targetInput.value) || 500;
        targetInput.addEventListener('change', function () {
            targetProfit = parseInt(this.value) || 500;
            checkCircuitBreaker();
        });
    }
    if (stopLossInput) {
        stopLoss = parseInt(stopLossInput.value) || 300;
        stopLossInput.addEventListener('change', function () {
            stopLoss = parseInt(this.value) || 300;
            checkCircuitBreaker();
        });
    }
    // === LIVEFEED SORT HANDLERS (ENTER KEY) ===
    const minWinInput = document.getElementById('minWinRate');
    const maxWinInput = document.getElementById('maxWinRate');
    const handleLivefeedSort = function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!minWinInput || !maxWinInput) return;
            let min = parseInt(minWinInput.value) || 0;
            let max = parseInt(maxWinInput.value) || 100;
            min = Math.max(0, Math.min(100, min));
            max = Math.max(0, Math.min(100, max));
            if (min > max) { const temp = min; min = max; max = temp; }
            minWinInput.value = min;
            maxWinInput.value = max;
            if (typeof window.runSmartAutoScan === 'function') {
                window.runSmartAutoScan();
                if (window.showToast) window.showToast('Livefeed Resorted', 'info');
            }
        }
    };
    if (minWinInput) minWinInput.addEventListener('keydown', handleLivefeedSort);
    if (maxWinInput) maxWinInput.addEventListener('keydown', handleLivefeedSort);

    // Initialize 3D Tilt
    initTiltEffect();
}

window.switchGameUI = switchGameUI;
window.setVolume = setVolume;
window.playSound = playSound;
window.showToast = showToast;
window.initEventListeners = initEventListeners;