import { companions, auras } from './data.js';
import { parseNumberWithSuffix, abbreviateNumber, formatNumber, formatTime } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    (function createParticles(){
        const particlesContainer = document.getElementById('particles');
        const particleCount = Math.floor(window.innerWidth / 15);
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            const size = Math.random() * 4 + 1;
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;
            const duration = Math.random() * 30 + 20;
            const delay = Math.random() * 5;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${posX}px`;
            p.style.top = `${posY}px`;
            p.style.animationDuration = `${duration}s`;
            p.style.animationDelay = `${delay}s`;
            const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            particlesContainer.appendChild(p);
        }
    })();

    const tabButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabContents.forEach(c => c.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    const ticksPerMinute = { strength:55, energy:28, defense:36, sword:55 };
    const companionTicksPerMinute = 10;

    const ranks = [
        { name:"Rookie", coinPerMinute:5 },
        { name:"Ninja", coinPerMinute:10 },
        { name:"Pirate", coinPerMinute:25 },
        { name:"Ghoul", coinPerMinute:50 },
        { name:"Hero", coinPerMinute:100 },
        { name:"Reaper", coinPerMinute:375 },
        { name:"Warrior", coinPerMinute:725 },
        { name:"Sin", coinPerMinute:1500 },
        { name:"Mage", coinPerMinute:7500 },
        { name:"Demon", coinPerMinute:15000 },
        { name:"Emperor", coinPerMinute:100000 },
        { name:"Elder", coinPerMinute:200000 },
        { name:"Overlord", coinPerMinute:1000000 },
        { name:"Leader", coinPerMinute:2000000 },
        { name:"Deity", coinPerMinute:10000000 },
        { name:"Sage", coinPerMinute:25000000 },
        { name:"Mask", coinPerMinute:125000000 },
        { name:"Shinigami", coinPerMinute:250000000 },
        { name:"Hashira", coinPerMinute:1250000000 },
        { name:"Destroyer", coinPerMinute:2500000000 },
        { name:"Otsutsuki", coinPerMinute:15000000000 },
        { name:"Pirate King", coinPerMinute:30000000000 },
        { name:"Kishin", coinPerMinute:150000000000 },
        { name:"Angel", coinPerMinute:750000000000 }
    ];

    function calculateGains() {
        const statType = document.getElementById("statType").value;
        const gainPerTick = parseNumberWithSuffix(document.getElementById("gainPerTick").value);
        const time = parseFloat(document.getElementById("time").value);
        const hasCompanion = document.getElementById("companionActive").value === "true";
        const companionGain = hasCompanion ? parseNumberWithSuffix(document.getElementById("companionGain").value) : 0;

        if (isNaN(gainPerTick)) return setResult("result", `<div class="result-item" style="color:var(--error)">Please enter a valid gain per tick</div>`);
        if (isNaN(time) || time <= 0) return setResult("result", `<div class="result-item" style="color:var(--error)">Please enter a valid time</div>`);
        if (hasCompanion && isNaN(companionGain)) return setResult("result", `<div class="result-item" style="color:var(--error)">Please enter valid companion gains</div>`);

        const ticks = ticksPerMinute[statType] * time;
        const mainGain = gainPerTick * ticks;
        const companionTotalGain = hasCompanion ? (companionGain * (companionTicksPerMinute * time)) : 0;
        const totalGain = mainGain + companionTotalGain;

        setResult("result", `
          <div class="result-item"><span class="result-label">Training Type:</span><span class="result-value">${capitalize(statType)}</span></div>
          <div class="result-item"><span class="result-label">Ticks Per Minute:</span><span class="result-value">${ticksPerMinute[statType]}</span></div>
          <div class="result-item"><span class="result-label">Total Ticks:</span><span class="result-value">${ticks}</span></div>
          <div class="result-item"><span class="result-label">Main Gain:</span><span class="result-value">${abbreviateNumber(mainGain)}</span></div>
          ${hasCompanion ? `
            <div class="result-item"><span class="result-label">Companion Ticks:</span><span class="result-value">${companionTicksPerMinute * time}</span></div>
            <div class="result-item"><span class="result-label">Companion Gain:</span><span class="result-value">${abbreviateNumber(companionTotalGain)}</span></div>
          `:''}
          <div class="result-item result-divider"><span class="result-label" style="font-weight:700">Total Gain:</span><span class="result-value" style="font-weight:700">${abbreviateNumber(totalGain)}</span></div>
          <div class="result-item"><span class="result-label">Gain Per Minute:</span><span class="result-value">${abbreviateNumber(totalGain / time)}</span></div>
          <div class="result-item"><span class="result-label">Gain Per Hour:</span><span class="result-value">${abbreviateNumber(totalGain / time * 60)}</span></div>
        `);
    }

    function calculateCoins() {
        const idx = parseInt(document.getElementById("rankSelect").value);
        const rank = ranks[idx];
        const doubleCoins = document.getElementById("doubleCoins").checked;
        const goldCompanion = document.getElementById("goldCompanion").checked;
        const time = parseInt(document.getElementById("coinTimeInput").value);

        if (!time || isNaN(time) || time <= 0) return setResult("coinResult", `<div class="result-item"><span style="color:var(--error);">Please enter a valid time</span></div>`);

        let cpm = rank.coinPerMinute;
        const bonuses = [];
        if (doubleCoins) { cpm *= 2; bonuses.push("2x Gamepass"); }
        if (goldCompanion) { cpm *= 1.2; bonuses.push("Gold Companion"); }

        const total = cpm * time;

        setResult("coinResult", `
            <div class="result-item"><span class="result-label">Coins/Min:</span><span class="result-value">${abbreviateNumber(cpm)}</span></div>
            ${bonuses.length ? `<div class="result-item"><span class="result-label">Active Bonuses:</span><span class="result-value">${bonuses.join(' + ')}</span></div>` : ''}
            <div class="result-item"><span class="result-label">Time:</span><span class="result-value">${time} minutes</span></div>
            <div class="result-item" style="margin-top:15px;border-top:1px solid var(--border);padding-top:10px;">
                <span class="result-label" style="font-size:1.1em;">Total Earnings:</span>
                <span class="result-value" style="font-size:1.1em;">${abbreviateNumber(total)}</span>
            </div>
        `);
    }

    function calculateTimeToGoal() {
        const statType = document.getElementById("goalStatType").value;
        const gainPerTick = parseNumberWithSuffix(document.getElementById("goalGainPerTick").value);
        const companionGain = parseNumberWithSuffix(document.getElementById("goalCompanionGain").value) || 0;
        const currentStat = parseNumberWithSuffix(document.getElementById("currentStat").value);
        const desiredStat = parseNumberWithSuffix(document.getElementById("desiredStat").value);

        if (isNaN(gainPerTick)) return setResult("goalResult", `<div class="result-item" style="color:var(--error)">Please enter a valid gain per tick</div>`);
        if (isNaN(currentStat)) return setResult("goalResult", `<div class="result-item" style="color:var(--error)">Please enter your current stat value</div>`);
        if (isNaN(desiredStat) || desiredStat <= currentStat) return setResult("goalResult", `<div class="result-item" style="color:var(--error)">Please enter a valid desired stat higher than current</div>`);

        const needed = desiredStat - currentStat;
        const perMinute = (gainPerTick * ticksPerMinute[statType]) + (companionGain * companionTicksPerMinute);
        const minutes = needed / perMinute;

        setResult("goalResult", `
          <div class="result-item"><span class="result-label">Training Type:</span><span class="result-value">${capitalize(statType)}</span></div>
          <div class="result-item"><span class="result-label">Current Stat:</span><span class="result-value">${abbreviateNumber(currentStat)}</span></div>
          <div class="result-item"><span class="result-label">Desired Stat:</span><span class="result-value">${abbreviateNumber(desiredStat)}</span></div>
          <div class="result-item"><span class="result-label">Gain Needed:</span><span class="result-value">${abbreviateNumber(needed)}</span></div>
          <div class="result-item"><span class="result-label">Gain Per Minute:</span><span class="result-value">${abbreviateNumber(perMinute)}</span></div>
          <div class="result-item" style="margin-top:1rem;padding-top:.75rem;border-top:1px solid var(--border)">
            <span class="result-label" style="font-weight:700">Time Needed:</span>
            <span class="result-value" style="font-weight:700">${formatTime(minutes)}</span>
          </div>
          <div class="result-item">
            <span class="result-label">At This Rate You'll Reach It:</span>
            <span class="result-value">${new Date(Date.now() + minutes * 60000).toLocaleString()}</span>
          </div>
        `);
    }

    let currentPanel = null;
    const yourOffer = [];
    const theirOffer = [];
    const modal = document.getElementById('companion-modal');
    const companionGrid = document.getElementById('companion-grid');

    function populateCompanionGrid() {
        companionGrid.innerHTML = '';
        companions.forEach(c => {
            const option = document.createElement('div');
            option.classList.add('companion-option');
            option.innerHTML = `
        <img src="${c.image}" alt="${c.name}">
        <span>${c.name}</span>
        <span class="companion-value">${formatNumber(c.value)}</span>
      `;
            option.addEventListener('click', () => { addCompanionToOffer(c); modal.style.display = 'none'; });
            companionGrid.appendChild(option);
        });
    }

    document.getElementById('add-your-companion').addEventListener('click', () => { currentPanel = 'yours'; modal.style.display = 'flex'; });
    document.getElementById('add-their-companion').addEventListener('click', () => { currentPanel = 'theirs'; modal.style.display = 'flex'; });
    document.getElementById('close-modal').addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    function addCompanionToOffer(c) {
        if (!currentPanel) return;
        const offer = currentPanel === 'yours' ? yourOffer : theirOffer;
        const container = document.getElementById(currentPanel === 'yours' ? 'your-offer' : 'their-offer');
        const existing = offer.findIndex(x => x.name === c.name && x.trait === undefined);
        if (existing >= 0) offer[existing].amount += 1;
        else offer.push({ ...c, amount:1, trait:undefined });
        updateOfferDisplay(offer, container);
    }

    function updateOfferDisplay(offer, container) {
        container.innerHTML = '';
        offer.forEach((c, index) => {
            const item = document.createElement('div');
            item.classList.add('companion-item');
            const badge =
                c.trait === 'gold' ? '<span class="trait-display gold">GOLD</span>' :
                    c.trait === 'atomic' ? '<span class="trait-display atomic">ATOMIC</span>' : '';

            item.innerHTML = `
                ${badge}
                <div class="companion-info">
                  <img class="companion-image" src="${c.image}" alt="${c.name}">
                  <span class="companion-name">${c.name}</span>
                </div>
                <div class="companion-amount">
                  <input type="number" class="amount-input" value="${c.amount}" min="1">
                  <button class="remove-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="trait-selector">
                  <i class="fas fa-tag"></i>
                  <div class="trait-options">
                    <div class="trait-option normal" data-trait="normal"><span class="trait-indicator normal"></span>Normal</div>
                    <div class="trait-option gold" data-trait="gold"><span class="trait-indicator gold"></span>Gold</div>
                    <div class="trait-option atomic" data-trait="atomic"><span class="trait-indicator atomic"></span>Atomic</div>
                  </div>
                </div>
            `;

            item.querySelector('.amount-input').addEventListener('change', (e) => {
                offer[index].amount = parseInt(e.target.value) || 1;
            });

            item.querySelector('.remove-btn').addEventListener('click', () => {
                offer.splice(index, 1);
                updateOfferDisplay(offer, container);
            });

            const traitSelector = item.querySelector('.trait-selector');
            const traitOptions = item.querySelector('.trait-options');
            traitSelector.addEventListener('click', (e) => {
                e.stopPropagation();
                traitOptions.style.display = traitOptions.style.display === 'flex' ? 'none' : 'flex';
            });
            item.querySelectorAll('.trait-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const trait = btn.dataset.trait;
                    offer[index].trait = (trait === 'normal') ? undefined : trait;
                    updateOfferDisplay(offer, container);
                });
            });
            document.addEventListener('click', function closeTraitSelector(e) {
                if (!traitSelector.contains(e.target)) traitOptions.style.display = 'none';
            });

            container.appendChild(item);
        });
    }

    function calculateTrade() {
        if (yourOffer.length === 0 || theirOffer.length === 0) {
            alert("Please add companions to both offers");
            return;
        }
        const sumOffer = (arr) => arr.reduce((sum, c) => {
            let v = c.value * c.amount;
            if (c.trait === 'gold' && c.goldValue) v = c.goldValue * c.amount;
            if (c.trait === 'atomic' && c.atomicValue) v = c.atomicValue * c.amount;
            return sum + v;
        }, 0);

        const yourTotal = sumOffer(yourOffer);
        const theirTotal = sumOffer(theirOffer);
        const diff = theirTotal - yourTotal;

        setText('your-value', formatNumber(yourTotal));
        setText('their-value', formatNumber(theirTotal));
        setText('difference-value', formatNumber(Math.abs(diff)));

        let label = "Fair Trade", color = "#7e22ce";
        if (diff > 0) { label = "Good Trade (You Profit)"; color = "#22c55e"; }
        else if (diff < 0) { label = "Bad Trade (You Lose)"; color = "#ef4444"; }

        const el = document.getElementById('trade-result-text');
        el.textContent = label;
        el.style.color = color;

        document.getElementById('trade-result').style.display = 'block';
    }

    function populateValuesTab() {
        const companionsContainer = document.getElementById('companions-values');
        const aurasContainer = document.getElementById('auras-values');
        companionsContainer.innerHTML = '';
        aurasContainer.innerHTML = '';

        companions.forEach(c => {
            if (!c.isAura) {
                const div = document.createElement('div');
                div.classList.add('value-item');
                const details = (c.goldValue && c.atomicValue) ? `
                  <div class="value-details">
                    <div class="value-detail"><span class="value-label">Normal:</span><span class="value-amount">${formatNumber(c.value)}</span></div>
                    <div class="value-detail"><span class="value-label gold-value">Gold:</span><span class="value-amount gold-value">${formatNumber(c.goldValue)}</span></div>
                    <div class="value-detail"><span class="value-label atomic-value">Atomic:</span><span class="value-amount atomic-value">${formatNumber(c.atomicValue)}</span></div>
                  </div>` : `
                  <div class="value-details">
                    <div class="value-detail"><span class="value-label">Value:</span><span class="value-amount">${formatNumber(c.value)}</span></div>
                  </div>`;
                        div.innerHTML = `
                  <img src="${c.image}" alt="${c.name}" class="value-image">
                  <div class="value-name">${c.name}</div>
                  ${details}
                `;
                companionsContainer.appendChild(div);
            }
        });

        auras.forEach(a => {
            const div = document.createElement('div');
            div.classList.add('value-item');
            div.innerHTML = `
                <img src="${a.image}" alt="${a.name}" class="value-image">
                <div class="value-name">${a.name}</div>
                <div class="value-details">
                  <div class="value-detail"><span class="value-label">Value:</span><span class="value-amount">${formatNumber(a.value)}</span></div>
                </div>
            `;
            aurasContainer.appendChild(div);
        });
    }

    function setupSearch() {
        const input = document.getElementById('values-search');
        input.addEventListener('input', () => {
            const term = input.value.toLowerCase();
            document.querySelectorAll('#companions-values .value-item').forEach(item => {
                const name = item.querySelector('.value-name').textContent.toLowerCase();
                item.style.display = name.includes(term) ? 'flex' : 'none';
            });
            document.querySelectorAll('#auras-values .value-item').forEach(item => {
                const name = item.querySelector('.value-name').textContent.toLowerCase();
                item.style.display = name.includes(term) ? 'flex' : 'none';
            });
        });
    }

    document.getElementById("calculateBtn").addEventListener("click", calculateGains);
    document.getElementById("calculateCoinsBtn").addEventListener("click", calculateCoins);
    document.getElementById("calculateGoalBtn").addEventListener("click", calculateTimeToGoal);
    document.getElementById('calculate-trade').addEventListener('click', calculateTrade);

    document.getElementById("saveProfileBtn").addEventListener("click", saveProfile);
    document.getElementById("loadProfileBtn").addEventListener("click", loadProfile);
    document.getElementById("saveGoalProfileBtn").addEventListener("click", saveGoalProfile);
    document.getElementById("loadGoalProfileBtn").addEventListener("click", loadGoalProfile);

    ["gainPerTick","time","companionGain","goalGainPerTick","goalCompanionGain","currentStat","desiredStat","coinTimeInput"]
        .forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener("keypress", (e) => {
                if (e.key !== "Enter") return;
                if (id === "coinTimeInput") calculateCoins();
                else if (["gainPerTick","time","companionGain"].includes(id)) calculateGains();
                else calculateTimeToGoal();
            });
        });

    function saveProfile() {
        const name = document.getElementById("profileName").value.trim();
        if (!name) return alert("Please enter a profile name");
        const profile = {
            statType: document.getElementById("statType").value,
            gainPerTick: document.getElementById("gainPerTick").value,
            companionActive: document.getElementById("companionActive").value,
            companionGain: document.getElementById("companionGain").value,
            time: document.getElementById("time").value
        };
        localStorage.setItem(`trainingProfile_${name}`, JSON.stringify(profile));
        alert(`Profile "${name}" saved!`);
    }
    function loadProfile() {
        const name = document.getElementById("profileName").value.trim();
        if (!name) return alert("Please enter a profile name");
        const raw = localStorage.getItem(`trainingProfile_${name}`);
        if (!raw) return alert(`Profile "${name}" not found!`);
        try {
            const p = JSON.parse(raw);
            document.getElementById("statType").value = p.statType;
            document.getElementById("gainPerTick").value = p.gainPerTick;
            document.getElementById("companionActive").value = p.companionActive;
            document.getElementById("companionGain").value = p.companionGain || "";
            if (p.time) document.getElementById("time").value = p.time;
        } catch(e){ alert("Error loading profile"); console.error(e); }
    }
    function saveGoalProfile() {
        const name = document.getElementById("goalProfileName").value.trim();
        if (!name) return alert("Please enter a profile name");
        const profile = {
            statType: document.getElementById("goalStatType").value,
            gainPerTick: document.getElementById("goalGainPerTick").value,
            companionGain: document.getElementById("goalCompanionGain").value,
            currentStat: document.getElementById("currentStat").value,
            desiredStat: document.getElementById("desiredStat").value
        };
        localStorage.setItem(`goalProfile_${name}`, JSON.stringify(profile));
        alert(`Profile "${name}" saved!`);
    }
    function loadGoalProfile() {
        const name = document.getElementById("goalProfileName").value.trim();
        if (!name) return alert("Please enter a profile name");
        const raw = localStorage.getItem(`goalProfile_${name}`);
        if (!raw) return alert(`Profile "${name}" not found!`);
        try {
            const p = JSON.parse(raw);
            document.getElementById("goalStatType").value = p.statType;
            document.getElementById("goalGainPerTick").value = p.gainPerTick;
            document.getElementById("goalCompanionGain").value = p.companionGain || "";
            document.getElementById("currentStat").value = p.currentStat || "";
            document.getElementById("desiredStat").value = p.desiredStat || "";
        } catch(e){ alert("Error loading profile"); console.error(e); }
    }

    populateCompanionGrid();
    populateValuesTab();
    setupSearch();

    function setResult(id, html){ document.getElementById(id).innerHTML = html; }
    function setText(id, text){ document.getElementById(id).textContent = text; }
    function capitalize(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }
});