// UI rendering functions (no logic)

/* ========== GLOBAL FLAGS ========== */
let isEditingRoundCounter = false;
let currentEditInput = null;

/* ========== TABLE FUNCTIONS - SAFE DOM OPERATIONS ========== */
function createMainTable() {
    if (mainTable) {
        mainTable.replaceChildren();
        for (let r = 0; r < rows; r++) {
            const tr = document.createElement('tr');
            for (let c = 0; c < cols; c++) {
                const td = document.createElement('td');
                tr.appendChild(td);
            }
            mainTable.appendChild(tr);
        }
    }
}

function createSubTable(table, rowCount = 3) {
    if (!table) return;
    table.replaceChildren();
    for (let r = 0; r < rowCount; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < cols; c++) tr.appendChild(document.createElement('td'));
        table.appendChild(tr);
    }
    const blank = document.createElement('tr');
    for (let c = 0; c < cols; c++) {
        const td = document.createElement('td');
        td.className = 'blank';
        blank.appendChild(td);
    }
    table.appendChild(blank);
    const money = document.createElement('tr');
    for (let c = 0; c < cols; c++) {
        money.appendChild(document.createElement('td'));
    }
    table.appendChild(money);
}

function createBigRoad(table) {
    if (!table) return;
    table.replaceChildren();
    const rowsBR = 6, colsBR = 100;
    for (let r = 0; r < rowsBR; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < colsBR; c++) tr.appendChild(document.createElement('td'));
        table.appendChild(tr);
    }
}

function createAccuracyTable(rowCount) {
    const table = document.getElementById('accuracyTable');
    if (!table) return;
    table.replaceChildren();
    for (let r = 0; r < rowCount; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < cols; c++) {
            const td = document.createElement('td');
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

/* ========== ROUND COUNTER EDIT - SAFE DOM ========== */
function setupRoundCounterEdit() {
    const roundCounter = document.getElementById('roundCounter');
    const roundCounterContainer = document.getElementById('roundCounterContainer');

    if (!roundCounter || !roundCounterContainer) return;

    const currentValue = parseInt(roundCounter.textContent.replace('#', '')) || 0;
    manualRoundCounter = currentValue;

    const newCounter = document.createElement('span');
    newCounter.id = 'roundCounter';
    newCounter.className = 'round-counter-display text-[10px] font-mono text-white bg-white/10 px-3 py-1 rounded border border-transparent';
    newCounter.textContent = `#${currentValue}`;

    roundCounterContainer.replaceChildren(newCounter);

    newCounter.addEventListener('click', function handleRoundCounterClick() {
        if (isEditingRoundCounter) return;

        isEditingRoundCounter = true;
        const currentValue = parseInt(this.textContent.replace('#', '')) || 0;

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'round-counter-edit';
        input.value = currentValue;
        input.min = 0;
        input.max = 999;

        roundCounterContainer.replaceChildren(input);
        input.focus();
        input.select();

        currentEditInput = input;

        const handleSave = () => {
            if (!isEditingRoundCounter) return;
            saveRoundCounterValue(input.value);
        };

        const handleCancel = () => {
            if (!isEditingRoundCounter) return;
            cancelRoundCounterEdit();
        };

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
            }
        });

        input.addEventListener('blur', handleSave);
    });

    newCounter.addEventListener('mouseenter', function () {
        this.style.cursor = 'pointer';
        this.title = 'Click để chỉnh sửa số ván';
    });
}

function resetEditState() {
    isEditingRoundCounter = false;
    currentEditInput = null;
}

function saveRoundCounterValue(value) {
    if (!isEditingRoundCounter) return;
    const roundCounterContainer = document.getElementById('roundCounterContainer');
    if (!roundCounterContainer) return;
    const numValue = parseInt(value) || 0;
    manualRoundCounter = numValue;
    resetEditState();
    const newCounter = document.createElement('span');
    newCounter.id = 'roundCounter';
    newCounter.className = 'round-counter-display text-[10px] font-mono text-white bg-white/10 px-3 py-1 rounded border border-transparent';
    newCounter.textContent = `#${numValue}`;
    roundCounterContainer.replaceChildren(newCounter);
    setupRoundCounterEdit();
    showToast(`Updated round: #${numValue}`, 'info');
}

function cancelRoundCounterEdit() {
    if (!isEditingRoundCounter) return;
    const roundCounterContainer = document.getElementById('roundCounterContainer');
    if (!roundCounterContainer) return;
    resetEditState();
    const newCounter = document.createElement('span');
    newCounter.id = 'roundCounter';
    newCounter.className = 'round-counter-display text-[10px] font-mono text-white bg-white/10 px-3 py-1 rounded border border-transparent';
    newCounter.textContent = `#${manualRoundCounter}`;
    roundCounterContainer.replaceChildren(newCounter);
    setupRoundCounterEdit();
}

/* ========== TAB MANAGEMENT - GSAP SLIDE & FADE ========== */
function setActiveTab(tabName) {
    if (window.currentActiveTab === tabName) return;
    // 1. Identify Containers
    const gameContainer = document.querySelector('.middle-section-fixed') || document.getElementById('mainTable')?.closest('.grid')?.parentElement;
    const customizePanel = document.getElementById('customizePanel');
    const outgoingEl = window.currentActiveTab === 'Customization' ? customizePanel : gameContainer;
    const incomingEl = tabName === 'Customization' ? customizePanel : gameContainer;

    // 2. Update Internal State
    window.currentActiveTab = tabName;

    // 3. Update Sidebar UI (Active Class)
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems) {
        navItems.forEach(el => {
            if (el.classList) el.classList.remove('active');
        });
    }
    const tabMapping = {
        'Baccarat': 'nav-baccarat',
        'Tài Xỉu': 'nav-taixiu',
        'Chẵn/Lẻ': 'nav-chanle',
        'Chẵn/Lẻ 2': 'nav-chanle',
        'Long/Hổ': 'nav-longho',
        'Roulette': 'nav-roulette',
        'Customization': 'nav-customization'
    };
    const activeId = tabMapping[tabName];
    if (activeId) {
        const activeNav = document.getElementById(activeId);
        if (activeNav) activeNav.classList.add('active');
    }

    // 4. Define Visibility Swap Logic
    const performSwap = () => {
        if (tabName === 'Customization') {
            if (gameContainer) gameContainer.classList.add('hidden');
            if (customizePanel) customizePanel.classList.remove('hidden');
        } else {
            if (gameContainer) gameContainer.classList.remove('hidden');
            if (customizePanel) customizePanel.classList.add('hidden');
        }
    };

    // 5. Animation Execution
    if (typeof gsap !== 'undefined' && outgoingEl && incomingEl && outgoingEl !== incomingEl) {
        gsap.killTweensOf(outgoingEl);
        gsap.killTweensOf(incomingEl);
        // Step A: Animate Out
        gsap.to(outgoingEl, {
            opacity: 0,
            x: -30, // Slide left
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                // Step B: Swap Visibility
                performSwap();
                // Step C: Animate In
                gsap.fromTo(incomingEl,
                    { opacity: 0, x: 30 }, // Start from right
                    { opacity: 1, x: 0, duration: 0.25, ease: "power2.out", clearProps: "transform" }
                );
            }
        });
    } else {
        performSwap();
    }
}

/* ========== SIDEBAR EVENT SETUP - GSAP INTEGRATED ========== */
function setupSidebarTabEvents() {
    // 1. Inject Customization Tab if missing
    const navList = document.querySelector('.nav-list') || document.querySelector('nav ul') || document.querySelector('.space-y-2');
    if (navList && !document.getElementById('nav-customization')) {
        const li = document.createElement('li');
        li.className = 'nav-item mb-2'; // Match existing classes
        li.id = 'nav-customization';
        li.innerHTML = `<button class="w-full text-left px-4 py-2 rounded transition-colors hover:bg-white/5 flex items-center gap-3" title="Customization">
            <i class="fa-solid fa-sliders"></i>
            <span class="text-xs font-mono uppercase">Theme</span>
        </button>`;
        navList.appendChild(li);
    }
    // 2. Setup Events
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(navItem => {
        const newNavItem = navItem.cloneNode(true);
        if (navItem.parentNode) navItem.parentNode.replaceChild(newNavItem, navItem);
        const button = newNavItem.tagName === 'BUTTON' ? newNavItem : newNavItem.querySelector('button');
        if (!button) return;
        const gameName = button.getAttribute('title');
        if (!gameName) return;

        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (window.currentActiveTab === gameName) return;
            // === GSAP TRANSITION ===
            const contentContainer = document.getElementById('mainTable')?.closest('.flex-1') || document.body.querySelector('.p-4.flex-1');

            if (contentContainer && typeof gsap !== 'undefined') {
                const tl = gsap.timeline();
                // 1. Slide Out Old
                tl.to(contentContainer, {
                    opacity: 0,
                    x: -30,
                    duration: 0.2,
                    ease: "power2.in",
                    onComplete: () => {
                        // 2. Switch Logic
                        setActiveTab(gameName);
                        // Trigger logic change if it's a game tab
                        if (gameName !== 'Customization') {
                            const select = document.getElementById('gameSelect');
                            if (select) select.value = gameName;
                            if (window.changeGame) window.changeGame(false);
                        }
                    }
                })
                    // 3. Slide In New
                    .fromTo(contentContainer, {
                        opacity: 0,
                        x: 30
                    }, {
                        opacity: 1,
                        x: 0,
                        duration: 0.3,
                        ease: "power2.out",
                        clearProps: "transform" // Clean up after animation
                    });
            } else {
                // Fallback if no GSAP or Container found
                setActiveTab(gameName);
                if (gameName !== 'Customization') {
                    const select = document.getElementById('gameSelect');
                    if (select) select.value = gameName;
                    if (window.changeGame) window.changeGame(false);
                }
            }
        });
    });
}

/* ========== UI UPDATE FUNCTIONS ========== */
function updateLockState() {
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    if (!btn1 || !btn2) return;
    if (isLocked) {
        document.body.style.filter = 'grayscale(0.3)';
        btn1.style.opacity = '0.5';
        btn2.style.opacity = '0.5';
        btn1.style.pointerEvents = 'none';
        btn2.style.pointerEvents = 'none';
    } else {
        document.body.style.filter = 'none';
        btn1.style.opacity = '1';
        btn2.style.opacity = '1';
        btn1.style.pointerEvents = 'auto';
        btn2.style.pointerEvents = 'auto';
    }
}

/* ========== SAFE DOM CLEARING FUNCTIONS ========== */
function safeClearElement(element) {
    if (element && element.firstChild) {
        element.replaceChildren();
    }
}
function safeReplaceElement(parent, oldChild, newChild) {
    if (parent && oldChild && parent.contains(oldChild)) {
        parent.replaceChild(newChild, oldChild);
    } else if (parent) {
        parent.appendChild(newChild);
    }
}

/* ========== INIT SNOW ========== */
function initSnow() {
    const snow = document.getElementById('snowContainer');
    if (!snow) return;
    snow.replaceChildren();
    for (let i = 0; i < 40; i++) {
        const f = document.createElement('div');
        f.className = 'snowflake';
        f.textContent = '❄';
        f.style.left = Math.random() * 100 + 'vw';
        f.style.animationDuration = Math.random() * 5 + 5 + 's';
        f.style.fontSize = Math.random() * 10 + 10 + 'px';
        snow.appendChild(f);
    }
}

window.createMainTable = createMainTable;
window.createSubTable = createSubTable;
window.createBigRoad = createBigRoad;
window.createAccuracyTable = createAccuracyTable;
window.setupRoundCounterEdit = setupRoundCounterEdit;
window.saveRoundCounterValue = saveRoundCounterValue;
window.cancelRoundCounterEdit = cancelRoundCounterEdit;
window.updateLockState = updateLockState;
window.setActiveTab = setActiveTab;
window.setupSidebarTabEvents = setupSidebarTabEvents;
window.safeClearElement = safeClearElement;
window.safeReplaceElement = safeReplaceElement;
window.initSnow = initSnow;