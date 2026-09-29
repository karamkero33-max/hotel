// 1. Procedural Web Audio API Sound Engine (Zero external files needed)
class SoundEngine {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    play(type) {
        try {
            this.init();
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            if (type === 'hover') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'flip') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } else if (type === 'reveal') {
                [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                    const o = this.ctx.createOscillator();
                    const g = this.ctx.createGain();
                    o.type = 'sine';
                    o.frequency.setValueAtTime(freq, now + i * 0.04);
                    g.gain.setValueAtTime(0.1, now + i * 0.04);
                    g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                    o.connect(g);
                    g.connect(this.ctx.destination);
                    o.start(now + i * 0.04);
                    o.stop(now + 0.6);
                });
            } else if (type === 'reroll') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'confirm') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            }
        } catch (e) {
            // Audio context fallback
        }
    }
}

const sounds = new SoundEngine();

// 2. Custom User Egyptian Premier League Database (8 players per slot = 4 for P1, 4 for P2)
const database = {
    goalkeepers: [
        { id: 1, name: "محمد الشناوي", rating: 85, team: "الأهلي", flag: "🇪🇬", stats: { pac: 83, sho: 84, pas: 80, dri: 86, def: 50, phy: 87 }, rarity: "special" },
        { id: 2, name: "محمد عواد", rating: 82, team: "الزمالك", flag: "🇪🇬", stats: { pac: 80, sho: 82, pas: 75, dri: 83, def: 45, phy: 81 }, rarity: "gold" },
        { id: 3, name: "مصطفى شوبير", rating: 81, team: "الأهلي", flag: "🇪🇬", stats: { pac: 82, sho: 80, pas: 76, dri: 82, def: 44, phy: 80 }, rarity: "special" },
        { id: 4, name: "محمد صبحي", rating: 80, team: "الزمالك", flag: "🇪🇬", stats: { pac: 80, sho: 79, pas: 73, dri: 81, def: 43, phy: 79 }, rarity: "gold" },
        { id: 5, name: "أحمد الشناوي", rating: 83, team: "بيراميدز", flag: "🇪🇬", stats: { pac: 81, sho: 82, pas: 78, dri: 84, def: 48, phy: 82 }, rarity: "gold" },
        { id: 6, name: "محمود جاد", rating: 79, team: "المصري", flag: "🇪🇬", stats: { pac: 78, sho: 79, pas: 72, dri: 80, def: 42, phy: 78 }, rarity: "gold" },
        { id: 7, name: "المهدي سليمان", rating: 78, team: "الاتحاد السكندري", flag: "🇪🇬", stats: { pac: 75, sho: 78, pas: 70, dri: 79, def: 45, phy: 80 }, rarity: "gold" },
        { id: 8, name: "محمود الزنفلي", rating: 77, team: "الأهلي", flag: "🇪🇬", stats: { pac: 74, sho: 76, pas: 68, dri: 77, def: 40, phy: 76 }, rarity: "gold" }
    ],
    defenders: [
        { id: 9, name: "ياسر إبراهيم", rating: 81, team: "الأهلي", flag: "🇪🇬", stats: { pac: 68, sho: 42, pas: 61, dri: 62, def: 83, phy: 85 }, rarity: "gold" },
        { id: 10, name: "أحمد رمضان بيكهام", rating: 81, team: "سيراميكا كليوباترا", flag: "🇪🇬", stats: { pac: 76, sho: 50, pas: 72, dri: 71, def: 82, phy: 80 }, rarity: "gold" },
        { id: 11, name: "محمد الشيبي", rating: 83, team: "بيراميدز", flag: "🇲🇦", stats: { pac: 84, sho: 68, pas: 82, dri: 80, def: 78, phy: 77 }, rarity: "special" },
        { id: 12, name: "كريم الدبيس", rating: 78, team: "الأهلي", flag: "🇪🇬", stats: { pac: 82, sho: 58, pas: 70, dri: 74, def: 76, phy: 72 }, rarity: "gold" },
        { id: 13, name: "أحمد سامي", rating: 80, team: "بيراميدز", flag: "🇪🇬", stats: { pac: 68, sho: 45, pas: 66, dri: 65, def: 81, phy: 82 }, rarity: "gold" },
        { id: 14, name: "ياسين مرعي", rating: 77, team: "فاركو", flag: "🇪🇬", stats: { pac: 72, sho: 40, pas: 62, dri: 63, def: 78, phy: 79 }, rarity: "gold" },
        { id: 15, name: "محمد إسماعيل", rating: 79, team: "زد FC", flag: "🇪🇬", stats: { pac: 74, sho: 46, pas: 65, dri: 66, def: 80, phy: 81 }, rarity: "gold" },
        { id: 16, name: "عمر فايد", rating: 80, team: "بيراميدز", flag: "🇪🇬", stats: { pac: 77, sho: 44, pas: 68, dri: 69, def: 81, phy: 80 }, rarity: "gold" }
    ],
    midfielders: [
        { id: 17, name: "إمام عاشور", rating: 86, team: "الأهلي", flag: "🇪🇬", stats: { pac: 82, sho: 83, pas: 85, dri: 86, def: 74, phy: 83 }, rarity: "special" },
        { id: 18, name: "مروان عطية", rating: 84, team: "الأهلي", flag: "🇪🇬", stats: { pac: 75, sho: 65, pas: 81, dri: 79, def: 84, phy: 82 }, rarity: "gold" },
        { id: 19, name: "محمد علي بن رمضان", rating: 84, team: "منتخب تونس", flag: "🇹🇳", stats: { pac: 79, sho: 80, pas: 83, dri: 84, def: 72, phy: 80 }, rarity: "special" },
        { id: 20, name: "حمدي فتحي", rating: 83, team: "الوكرة", flag: "🇪🇬", stats: { pac: 74, sho: 70, pas: 78, dri: 77, def: 85, phy: 85 }, rarity: "special" },
        { id: 21, name: "وليد الكرتي", rating: 83, team: "بيراميدز", flag: "🇲🇦", stats: { pac: 76, sho: 74, pas: 84, dri: 83, def: 75, phy: 78 }, rarity: "gold" },
        { id: 22, name: "مهند لاشين", rating: 81, team: "بيراميدز", flag: "🇪🇬", stats: { pac: 72, sho: 65, pas: 78, dri: 75, def: 80, phy: 80 }, rarity: "gold" },
        { id: 23, name: "ناصر ماهر", rating: 81, team: "الزمالك", flag: "🇪🇬", stats: { pac: 76, sho: 74, pas: 82, dri: 84, def: 48, phy: 62 }, rarity: "gold" },
        { id: 24, name: "عبد الله السعيد", rating: 84, team: "الزمالك", flag: "🇪🇬", stats: { pac: 62, sho: 82, pas: 89, dri: 82, def: 55, phy: 68 }, rarity: "special" }
    ],
    wingers: [
        { id: 25, name: "أحمد سيد زيزو", rating: 86, team: "الزمالك", flag: "🇪🇬", stats: { pac: 88, sho: 85, pas: 87, dri: 87, def: 60, phy: 76 }, rarity: "special" },
        { id: 26, name: "محمود حسن تريزيجيه", rating: 85, team: "الريان", flag: "🇪🇬", stats: { pac: 87, sho: 84, pas: 80, dri: 86, def: 52, phy: 77 }, rarity: "special" },
        { id: 27, name: "أشرف بن شرقي", rating: 84, team: "الريان", flag: "🇲🇦", stats: { pac: 86, sho: 82, pas: 82, dri: 87, def: 38, phy: 72 }, rarity: "special" },
        { id: 28, name: "حسين الشحات", rating: 84, team: "الأهلي", flag: "🇪🇬", stats: { pac: 85, sho: 81, pas: 80, dri: 86, def: 40, phy: 70 }, rarity: "gold" },
        { id: 29, name: "أحمد عبد القادر", rating: 82, team: "الأهلي", flag: "🇪🇬", stats: { pac: 84, sho: 78, pas: 79, dri: 86, def: 36, phy: 65 }, rarity: "gold" },
        { id: 30, name: "إبراهيم عادل", rating: 84, team: "بيراميدز", flag: "🇪🇬", stats: { pac: 89, sho: 80, pas: 78, dri: 86, def: 38, phy: 71 }, rarity: "special" },
        { id: 31, name: "رمضان صبحي", rating: 83, team: "بيراميدز", flag: "🇪🇬", stats: { pac: 82, sho: 79, pas: 81, dri: 84, def: 42, phy: 78 }, rarity: "special" },
        { id: 32, name: "مصطفى فتحي", rating: 83, team: "بيراميدز", flag: "🇪🇬", stats: { pac: 86, sho: 81, pas: 80, dri: 85, def: 34, phy: 63 }, rarity: "gold" }
    ],
    attackers: [
        { id: 33, name: "عدي الدباغ", rating: 83, team: "شارلروا", flag: "🇵🇸", stats: { pac: 84, sho: 83, pas: 72, dri: 80, def: 40, phy: 81 }, rarity: "special" },
        { id: 34, name: "خوان بيزيرا 🌟", rating: 82, team: "الزمالك", flag: "🇧🇷", stats: { pac: 85, sho: 85, pas: 71, dri: 82, def: 37, phy: 79 }, rarity: "special", isJuan: true },
        { id: 35, name: "ناصر منسي", rating: 80, team: "الزمالك", flag: "🇪🇬", stats: { pac: 76, sho: 79, pas: 65, dri: 74, def: 35, phy: 76 }, rarity: "gold" },
        { id: 36, name: "فيستون ماييلي", rating: 85, team: "بيراميدز", flag: "🇨🇩", stats: { pac: 86, sho: 86, pas: 70, dri: 81, def: 42, phy: 86 }, rarity: "special" },
        { id: 37, name: "أحمد ياسر ريان", rating: 81, team: "البنك الأهلي", flag: "🇪🇬", stats: { pac: 81, sho: 81, pas: 68, dri: 76, def: 38, phy: 79 }, rarity: "gold" },
        { id: 38, name: "عمرو ناصر", rating: 79, team: "فاركو", flag: "🇪🇬", stats: { pac: 78, sho: 78, pas: 64, dri: 73, def: 36, phy: 77 }, rarity: "gold" },
        { id: 39, name: "عمر فرج", rating: 80, team: "الزمالك", flag: "🇵🇸", stats: { pac: 80, sho: 79, pas: 69, dri: 75, def: 37, phy: 78 }, rarity: "gold" },
        { id: 40, name: "شيكو بانزا", rating: 79, team: "زد FC", flag: "🇦🇴", stats: { pac: 83, sho: 77, pas: 67, dri: 77, def: 34, phy: 74 }, rarity: "gold" }
    ],
    managers: [
        { id: 41, name: "مارسيل كولر", tactic: "هجوم منظم وضغط", boost: 5, flag: "🇨🇭", rarity: "manager" },
        { id: 42, name: "جوزيه جوميز", tactic: "استحواذ وهجوم مرن", boost: 4, flag: "🇵🇹", rarity: "manager" },
        { id: 43, name: "كرونسلاف يورتشيتش", tactic: "توازن وهجمات خاطفة", boost: 4, flag: "🇭🇷", rarity: "manager" },
        { id: 44, name: "علي ماهر", tactic: "انضباط تكتيكي ومرتدات", boost: 4, flag: "🇪🇬", rarity: "manager" },
        { id: 45, name: "مجدي عبد العاطي", tactic: "تنظيم دفاعي وهجومي", boost: 3, flag: "🇪🇬", rarity: "manager" },
        { id: 46, name: "حسام حسن", tactic: "حماس وضغط عالي", boost: 5, flag: "🇪🇬", rarity: "manager" },
        { id: 47, name: "أيمن الرمادي", tactic: "كرة قدم هجومية", boost: 4, flag: "🇪🇬", rarity: "manager" },
        { id: 48, name: "طارق العشري", tactic: "تكتيك دفاعي صارم", boost: 3, flag: "🇪🇬", rarity: "manager" }
    ]
};

const posNames = ['goalkeepers', 'defenders', 'midfielders', 'wingers', 'attackers', 'managers'];
const posLabels = ['حارس مرمى (GK)', 'مدافع (DEF)', 'خط وسط (MID)', 'جناح (WNG)', 'مهاجم (ATT)', 'مدرب (Manager)'];
const slotIds = ['gk', 'def', 'mid', 'wng', 'att', 'man'];

// 3. State Variables
let turnCounter = 0; // 0 to 11 (12 turns total for 6 categories x 2 players)
let currentOptions = [];
let openedBoxId = null;
let selectedEntity = null;
let hasRerolled = false;
let playerNames = { 1: 'اللاعب 1', 2: 'اللاعب 2' };

// Track offered IDs per position so Player 1 and Player 2 get distinct options
const offeredIds = {
    goalkeepers: [],
    defenders: [],
    midfielders: [],
    wingers: [],
    attackers: [],
    managers: []
};

const teams = {
    1: { goalkeepers: null, defenders: [], midfielders: [], wingers: [], attackers: [], managers: null },
    2: { goalkeepers: null, defenders: [], midfielders: [], wingers: [], attackers: [], managers: null }
};

const formationLayouts = {
    '2-1-1': [
        { key: 'gk', label: 'حارس مرمى', icon: '🧤', category: 'goalkeepers', left: '50%', top: '78%', hint: 'GK' },
        { key: 'def1', label: 'مدافع', icon: '🛡️', category: 'defenders', left: '28%', top: '60%', hint: 'DEF' },
        { key: 'def2', label: 'مدافع', icon: '🛡️', category: 'defenders', left: '72%', top: '60%', hint: 'DEF' },
        { key: 'mid', label: 'خط وسط', icon: '🎯', category: 'midfielders', left: '50%', top: '40%', hint: 'MID' },
        { key: 'att', label: 'مهاجم', icon: '⚽', category: 'attackers', left: '50%', top: '18%', hint: 'ATT' }
    ],
    '1-2-1': [
        { key: 'gk', label: 'حارس مرمى', icon: '🧤', category: 'goalkeepers', left: '50%', top: '78%', hint: 'GK' },
        { key: 'def1', label: 'مدافع', icon: '🛡️', category: 'defenders', left: '50%', top: '62%', hint: 'DEF' },
        { key: 'mid1', label: 'خط وسط', icon: '🎯', category: 'midfielders', left: '32%', top: '40%', hint: 'MID' },
        { key: 'mid2', label: 'خط وسط', icon: '🎯', category: 'midfielders', left: '68%', top: '40%', hint: 'MID' },
        { key: 'att', label: 'مهاجم', icon: '⚽', category: 'attackers', left: '50%', top: '18%', hint: 'ATT' }
    ],
    '1-1-2': [
        { key: 'gk', label: 'حارس مرمى', icon: '🧤', category: 'goalkeepers', left: '50%', top: '78%', hint: 'GK' },
        { key: 'def1', label: 'مدافع', icon: '🛡️', category: 'defenders', left: '50%', top: '62%', hint: 'DEF' },
        { key: 'mid', label: 'خط وسط', icon: '🎯', category: 'midfielders', left: '50%', top: '45%', hint: 'MID' },
        { key: 'att1', label: 'مهاجم', icon: '⚽', category: 'attackers', left: '32%', top: '20%', hint: 'ATT' },
        { key: 'att2', label: 'مهاجم', icon: '⚽', category: 'attackers', left: '68%', top: '20%', hint: 'ATT' }
    ],
    '3-0-1': [
        { key: 'gk', label: 'حارس مرمى', icon: '🧤', category: 'goalkeepers', left: '50%', top: '78%', hint: 'GK' },
        { key: 'def1', label: 'مدافع', icon: '🛡️', category: 'defenders', left: '18%', top: '60%', hint: 'DEF' },
        { key: 'def2', label: 'مدافع', icon: '🛡️', category: 'defenders', left: '50%', top: '58%', hint: 'DEF' },
        { key: 'def3', label: 'مدافع', icon: '🛡️', category: 'defenders', left: '82%', top: '60%', hint: 'DEF' },
        { key: 'att', label: 'مهاجم', icon: '⚽', category: 'attackers', left: '50%', top: '18%', hint: 'ATT' }
    ],
    '0-3-1': [
        { key: 'gk', label: 'حارس مرمى', icon: '🧤', category: 'goalkeepers', left: '50%', top: '78%', hint: 'GK' },
        { key: 'mid1', label: 'خط وسط', icon: '🎯', category: 'midfielders', left: '18%', top: '50%', hint: 'MID' },
        { key: 'mid2', label: 'خط وسط', icon: '🎯', category: 'midfielders', left: '50%', top: '38%', hint: 'MID' },
        { key: 'mid3', label: 'خط وسط', icon: '🎯', category: 'midfielders', left: '82%', top: '50%', hint: 'MID' },
        { key: 'att', label: 'مهاجم', icon: '⚽', category: 'attackers', left: '50%', top: '18%', hint: 'ATT' }
    ],
    '2-0-2': [
        { key: 'gk', label: 'حارس مرمى', icon: '🧤', category: 'goalkeepers', left: '50%', top: '78%', hint: 'GK' },
        { key: 'def1', label: 'مدافع', icon: '🛡️', category: 'defenders', left: '30%', top: '60%', hint: 'DEF' },
        { key: 'def2', label: 'مدافع', icon: '🛡️', category: 'defenders', left: '70%', top: '60%', hint: 'DEF' },
        { key: 'att1', label: 'مهاجم', icon: '⚽', category: 'attackers', left: '30%', top: '20%', hint: 'ATT' },
        { key: 'att2', label: 'مهاجم', icon: '⚽', category: 'attackers', left: '70%', top: '20%', hint: 'ATT' }
    ]
};

const slotPools = {
    goalkeepers: ['goalkeepers'],
    defenders: ['defenders'],
    midfielders: ['midfielders', 'wingers'],
    attackers: ['attackers', 'wingers'],
    managers: ['managers']
};

const slotAssignments = {
    1: {},
    2: {}
};

const usedPlayerIds = new Set();
let currentSearchTarget = null;
const teamFormations = { 1: '2-1-1', 2: '2-1-1' };

function getSlotCategoriesForKey(category) {
    if (category === 'MANAGER' || category === 'managers') {
        return ['managers'];
    }
    return slotPools[category] || [category];
}

function getPlayerById(id) {
    for (const pool in database) {
        const player = database[pool].find(item => item.id === id);
        if (player) return player;
    }
    return null;
}

function getTeamFeaturedPlayer(team) {
    const order = ['attackers', 'wingers', 'midfielders', 'defenders', 'goalkeepers'];
    for (const category of order) {
        const value = team[category];
        if (Array.isArray(value) && value.length) return value[0];
        if (value && typeof value === 'object') return value;
    }
    return null;
}

function syncTeamFromSlots(teamNum) {
    const assignments = slotAssignments[teamNum];
    const formation = teamFormations[teamNum];
    const layout = formationLayouts[formation] || [];

    teams[teamNum].goalkeepers = assignments.gk || null;
    teams[teamNum].defenders = layout
        .filter(slot => slot.category === 'defenders')
        .map(slot => assignments[slot.key])
        .filter(Boolean);
    teams[teamNum].midfielders = layout
        .filter(slot => slot.category === 'midfielders')
        .map(slot => assignments[slot.key])
        .filter(Boolean);
    teams[teamNum].attackers = layout
        .filter(slot => slot.category === 'attackers')
        .map(slot => assignments[slot.key])
        .filter(Boolean);
    teams[teamNum].wingers = layout
        .filter(slot => slot.category === 'wingers')
        .map(slot => assignments[slot.key])
        .filter(Boolean);
    teams[teamNum].managers = assignments.coach || null;
}

function renderCoachName(teamNum) {
    const coach = slotAssignments[teamNum].coach;
    const coachNameEl = document.getElementById(`p${teamNum}-coach-name`);
    if (coachNameEl) {
        coachNameEl.innerText = coach ? `${coach.name}` : 'اختر مدرباً';
    }
}

function isTeamReady(teamNum) {
    const formation = teamFormations[teamNum];
    const layout = formationLayouts[formation] || [];
    if (!slotAssignments[teamNum].coach) return false;
    return layout.every(slot => Boolean(slotAssignments[teamNum][slot.key]));
}

function updateStartButton() {
    const ready = isTeamReady(1) && isTeamReady(2);
    const btn = document.getElementById('btn-start-match');
    const note = document.querySelector('.start-match-note');

    if (btn) btn.disabled = !ready;
    if (note) {
        note.innerText = ready
            ? 'كل الفرق مكتملة، اضغط لبدء المباراة'
            : 'املأ التشكيل الكامل لكل فريق لفتح المباراة';
    }
}

function renderField(teamNum) {
    const field = document.getElementById(`p${teamNum}-field`);
    if (!field) return;

    const formation = teamFormations[teamNum];
    const layout = formationLayouts[formation] || [];

    field.innerHTML = '';

    layout.forEach(slot => {
        const assigned = slotAssignments[teamNum][slot.key];
        const slotEl = document.createElement('div');
        slotEl.className = 'field-slot';
        slotEl.style.left = slot.left;
        slotEl.style.top = slot.top;
        slotEl.id = `p${teamNum}-${slot.key}`;
        slotEl.dataset.team = teamNum;
        slotEl.dataset.slotKey = slot.key;
        slotEl.dataset.category = slot.category;

        slotEl.onclick = () => openPlayerSearch(teamNum, slot.key, slot.category);

        if (assigned) {
            slotEl.innerHTML = `
                <div class="slot-card slot-card-filled">
                    <div class="slot-icon">${slot.icon}</div>
                    <div class="slot-name">${assigned.name}</div>
                    <div class="slot-meta">${assigned.rating ? assigned.rating : '+' + assigned.boost}</div>
                </div>
            `;
        } else {
            slotEl.classList.add('empty');
            slotEl.innerHTML = `
                <div class="slot-icon">${slot.icon}</div>
                <div class="slot-name">${slot.hint}</div>
                <div class="slot-meta">اضغط للاختيار</div>
            `;
        }

        field.appendChild(slotEl);
    });
}

function changeFormation(teamNum, newFormation) {
    const previous = teamFormations[teamNum];
    if (previous === newFormation) return;

    const layout = formationLayouts[newFormation] || [];
    const keepKeys = new Set(layout.map(slot => slot.key));

    Object.keys(slotAssignments[teamNum]).forEach(key => {
        if (key !== 'coach' && !keepKeys.has(key)) {
            const removed = slotAssignments[teamNum][key];
            if (removed) usedPlayerIds.delete(removed.id);
            delete slotAssignments[teamNum][key];
        }
    });

    teamFormations[teamNum] = newFormation;
    syncTeamFromSlots(teamNum);
    renderField(teamNum);
    updateLiveRatings();
    updateStartButton();
}

function openPlayerSearch(teamNum, slotKey, category) {
    currentSearchTarget = { teamNum, slotKey, category };
    const title = document.getElementById('search-modal-title');
    const subtitle = document.getElementById('search-modal-subtitle');
    const searchInput = document.getElementById('player-search-input');
    const overlay = document.getElementById('player-search-overlay');

    if (title) {
        title.innerText = category === 'MANAGER' ? 'اختر مدرباً' : `اختر ${slotKey.toUpperCase()}`;
    }

    if (subtitle) {
        subtitle.innerText = category === 'MANAGER'
            ? 'اختر مدرب فريق قوي لتقود تشكيلة النصر'
            : 'يمكنك البحث بالاسم أو النادي أو التقييم';
    }

    if (overlay) overlay.classList.remove('hidden');
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }

    renderSearchResults();
}

function closePlayerSearch() {
    const overlay = document.getElementById('player-search-overlay');
    if (overlay) overlay.classList.add('hidden');
    currentSearchTarget = null;
}

function getSearchPool(category) {
    if (category === 'MANAGER' || category === 'managers') return ['managers'];
    return getSlotCategoriesForKey(category);
}

function renderSearchResults(filterText = '') {
    const results = document.getElementById('player-search-results');
    if (!results || !currentSearchTarget) return;

    const { teamNum, slotKey, category } = currentSearchTarget;
    const pools = getSearchPool(category);
    const searchTerm = filterText.toLowerCase();
    const currentAssigned = slotAssignments[teamNum][slotKey];
    const selectedIds = new Set(usedPlayerIds);
    if (currentAssigned) selectedIds.delete(currentAssigned.id);

    const candidates = pools.flatMap(pool => database[pool] || []);
    const filtered = candidates.filter(player => {
        const searchable = `${player.name} ${player.team || ''} ${player.flag || ''}`.toLowerCase();
        if (searchTerm && !searchable.includes(searchTerm)) return false;
        return !selectedIds.has(player.id);
    });

    if (!filtered.length) {
        results.innerHTML = `<div class="search-empty">لا يوجد لاعب مطابق. حاول كلمة أخرى.</div>`;
        return;
    }

    results.innerHTML = filtered.map(player => `
        <div class="search-card-item" onclick="selectPlayer(${player.id})">
            <div class="search-avatar">${player.flag || '⚽'}</div>
            <div class="search-details">
                <div class="search-name">${player.name}</div>
                <div class="search-meta">${player.team || player.tactic || ''}</div>
            </div>
            <div class="search-rating">${player.rating || (player.boost ? '+' + player.boost : '')}</div>
        </div>
    `).join('');
}

function selectPlayer(playerId) {
    if (!currentSearchTarget) return;
    const player = getPlayerById(playerId);
    if (!player) return;

    const { teamNum, slotKey } = currentSearchTarget;
    const previous = slotAssignments[teamNum][slotKey];
    if (previous) {
        usedPlayerIds.delete(previous.id);
    }

    slotAssignments[teamNum][slotKey] = player;
    usedPlayerIds.add(player.id);

    syncTeamFromSlots(teamNum);
    renderField(teamNum);
    renderCoachName(teamNum);
    updateLiveRatings();
    updateStartButton();
    closePlayerSearch();
}

function startMatchIfReady() {
    if (isTeamReady(1) && isTeamReady(2)) {
        startMatchSimulation();
    } else {
        const note = document.querySelector('.start-match-note');
        if (note) {
            note.innerText = 'لا يمكن البدء حتى يتم اختيار جميع اللاعبين والمدربين.';
        }
    }
}

function updateLiveRatings() {
    for (let player = 1; player <= 2; player++) {
        const assigned = Object.values(slotAssignments[player]).filter(Boolean);
        let total = 0;
        let count = 0;

        assigned.forEach(item => {
            if (item.rating) {
                total += item.rating;
                count++;
            } else if (item.boost) {
                total += item.boost * 2;
                count++;
            }
        });

        const liveOvr = count > 0 ? Math.round(total / count) : 0;
        const ratingEl = document.getElementById(`p${player}-live-rating`);
        if (ratingEl) {
            ratingEl.innerText = liveOvr;
        }
    }
}

function getTeamPlayers(team) {
    const selected = [];
    if (team.goalkeepers) selected.push(team.goalkeepers);
    selected.push(...(team.defenders || []));
    selected.push(...(team.midfielders || []));
    selected.push(...(team.wingers || []));
    selected.push(...(team.attackers || []));
    if (team.managers) selected.push(team.managers);
    return selected.filter(Boolean);
}

function syncTeamSelection(player) {
    const selected = slotAssignments[player];
    teams[player].goalkeepers = selected.gk || null;
    teams[player].defenders = [selected.def1, selected.def2, selected.def3].filter(Boolean);
    teams[player].midfielders = [selected.mid, selected.mid1, selected.mid2, selected.mid3].filter(Boolean);
    teams[player].attackers = [selected.att, selected.att1, selected.att2].filter(Boolean);
    teams[player].managers = selected.coach || null;
}

// 4. Initial Turn Tracker Generation (12 Turns Total)
function initTurnTracker() {
    const dotsContainer = document.getElementById('turn-dots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const dot = document.createElement('div');
        const playerClass = (i % 2 === 0) ? 'p1' : 'p2';
        dot.className = `turn-dot ${playerClass} ${i === 0 ? 'active' : ''}`;
        dot.id = `dot-${i}`;
        dotsContainer.appendChild(dot);
    }
}

// 5. Game Turn Logic (4 Cards Per Turn)
function startTurn() {
    openedBoxId = null;
    selectedEntity = null;
    hasRerolled = false;
    document.getElementById('actions').classList.add('hidden');

    const currentPlayer = (turnCounter % 2) + 1;
    const posIndex = Math.floor(turnCounter / 2);
    const currentPosKey = posNames[posIndex];

    // Update Turn Tracker Fill & Active Dot
    document.getElementById('progress-fill').style.width = `${((turnCounter + 1) / 12) * 100}%`;
    for (let i = 0; i < 12; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (i === turnCounter) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    }

    // Update Banner Text & Colors
    const playerTag = document.getElementById('turn-player-tag');
    const titleEl = document.getElementById('turn-title');

    playerTag.innerText = playerNames[currentPlayer];
    playerTag.className = `turn-player-tag ${currentPlayer === 1 ? 'p1-turn' : 'p2-turn'}`;
    titleEl.innerText = `اختر ${posLabels[posIndex]} من ${playerNames[currentPlayer]}`;

    // Filter out cards already offered in previous turns for this position
    const availableOptions = database[currentPosKey].filter(item => !offeredIds[currentPosKey].includes(item.id));

    // Randomize 4 cards from remaining available pool for current position
    currentOptions = [...availableOptions].sort(() => 0.5 - Math.random()).slice(0, 4);

    // Track offered IDs so the second player gets a completely distinct 4 cards
    currentOptions.forEach(opt => offeredIds[currentPosKey].push(opt.id));

    renderBoxes();
}

function renderBoxes() {
    const container = document.getElementById('boxes-container');
    container.innerHTML = '';

    currentOptions.forEach((option, index) => {
        const box = document.createElement('div');
        box.className = 'box';
        box.dataset.index = index;

        const isManager = !option.rating;
        const rarityClass = isManager ? 'card-manager' : (option.rarity === 'special' ? 'card-special' : 'card-gold');

        const cardHeader = isManager 
            ? `<div class="card-ovr">+${option.boost}</div><div class="card-pos">MGR</div>` 
            : `<div class="card-ovr">${option.rating}</div><div class="card-pos">${posIdsToBadge(turnCounter)}</div>`;

        const subText = isManager ? option.tactic : option.team;

        // Player Avatar SVG Silhouette
        const avatarSvg = `
            <svg class="player-avatar-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="35" r="22" fill="url(#avatar-grad-${index})"/>
                <path d="M15 90C15 65 30 55 50 55C70 55 85 65 85 90H15Z" fill="url(#avatar-grad-${index})"/>
                <defs>
                    <linearGradient id="avatar-grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${isManager ? '#00d2ff' : '#f39c12'}"/>
                        <stop offset="100%" stop-color="${isManager ? '#0055ff' : '#d35400'}"/>
                    </linearGradient>
                </defs>
            </svg>
        `;

        const statsGridHTML = isManager ? '' : `
            <div class="card-stats-grid">
                <div class="stat-item"><span>PAC</span><span class="stat-val">${option.stats.pac}</span></div>
                <div class="stat-item"><span>SHO</span><span class="stat-val">${option.stats.sho}</span></div>
                <div class="stat-item"><span>PAS</span><span class="stat-val">${option.stats.pas}</span></div>
                <div class="stat-item"><span>DRI</span><span class="stat-val">${option.stats.dri}</span></div>
                <div class="stat-item"><span>DEF</span><span class="stat-val">${option.stats.def}</span></div>
                <div class="stat-item"><span>PHY</span><span class="stat-val">${option.stats.phy}</span></div>
            </div>
        `;

        box.innerHTML = `
            <div class="box-inner">
                <div class="front">
                    <div class="pack-shield-logo">🏆</div>
                    <div class="pack-label">EGY DRAFT</div>
                </div>
                <div class="back ${rarityClass}">
                    <div class="card-top">
                        <div class="card-rating-group">
                            ${cardHeader}
                        </div>
                        <div class="card-badge-icon">${option.flag || '🇪🇬'}</div>
                    </div>
                    <div class="card-player-img">
                        ${avatarSvg}
                    </div>
                    <div class="card-details">
                        <div class="card-name">${option.name}</div>
                        <div class="card-club">${subText}</div>
                        ${statsGridHTML}
                    </div>
                </div>
            </div>
        `;

        // Mouse Hover 3D Tilt Physics
        box.addEventListener('mousemove', (e) => handleCardTilt(e, box));
        box.addEventListener('mouseleave', () => resetCardTilt(box));
        box.addEventListener('mouseenter', () => sounds.play('hover'));

        box.onclick = () => handleBoxClick(index, box);
        container.appendChild(box);
    });
}

function posIdsToBadge(turn) {
    const posIndex = Math.floor(turn / 2);
    return ['GK', 'DEF', 'MID', 'WNG', 'ATT', 'MGR'][posIndex];
}

// 3D Card Tilt Physics Handlers
function handleCardTilt(e, box) {
    if (box.classList.contains('disabled')) return;
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    const inner = box.querySelector('.box-inner');
    if (box.classList.contains('open')) {
        inner.style.transform = `rotateY(180deg) rotateX(${rotateX}deg) rotateZ(${rotateY * 0.5}deg)`;
    } else {
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
}

function resetCardTilt(box) {
    const inner = box.querySelector('.box-inner');
    if (box.classList.contains('open')) {
        inner.style.transform = `rotateY(180deg)`;
    } else {
        inner.style.transform = `rotateY(0deg)`;
    }
}

// 6. Card Unboxing Interaction
function handleBoxClick(index, boxElement) {
    if (boxElement.classList.contains('disabled')) return;
    if (openedBoxId !== null && openedBoxId !== index) return;

    if (openedBoxId === null) {
        sounds.play('flip');
        boxElement.classList.add('open');
        openedBoxId = index;
        selectedEntity = currentOptions[index];

        setTimeout(() => {
            sounds.play('reveal');
            triggerConfetti();
        }, 300);

        const actionsDiv = document.getElementById('actions');
        const btnReroll = document.getElementById('btn-reroll');

        actionsDiv.classList.remove('hidden');
        btnReroll.style.display = hasRerolled ? 'none' : 'inline-flex';
    }
}

function rerollBox() {
    sounds.play('reroll');
    hasRerolled = true;

    const prevBox = document.querySelector(`.box[data-index='${openedBoxId}']`);
    prevBox.classList.add('disabled', 'shatter');

    openedBoxId = null;
    selectedEntity = null;

    document.getElementById('actions').classList.add('hidden');
}

function confirmSelection() {
    sounds.play('confirm');
    const currentPlayer = (turnCounter % 2) + 1;
    const posIndex = Math.floor(turnCounter / 2);
    const currentPosKey = posNames[posIndex];

    teams[currentPlayer][currentPosKey] = selectedEntity;

    // Update Field Slot
    const slotId = `p${currentPlayer}-${slotIds[posIndex]}`;
    const slotEl = document.getElementById(slotId);
    slotEl.classList.add('filled');

    const statText = selectedEntity.rating ? selectedEntity.rating : `+${selectedEntity.boost}`;
    slotEl.innerHTML = `
        <div class="slot-card-filled">
            <div class="slot-card-info">
                <span class="slot-pos">${slotIds[posIndex].toUpperCase()}</span>
                <span class="slot-card-name">${selectedEntity.name}</span>
            </div>
            <span class="slot-card-rating">${statText}</span>
        </div>
    `;

    // Recalculate Live Rating
    updateLiveRatings();

    turnCounter++;
    if (turnCounter < 12) {
        startTurn();
    } else {
        startMatchSimulation();
    }
}

function updateLiveRatings() {
    for (let player = 1; player <= 2; player++) {
        let total = 0;
        let count = 0;
        Object.values(teams[player]).forEach(item => {
            if (item) {
                if (item.rating) { total += item.rating; count++; }
                else if (item.boost) { total += item.boost * 2; }
            }
        });
        const liveOvr = count > 0 ? Math.round(total / count) : 0;
        document.getElementById(`p${player}-live-rating`).querySelector('span').innerText = liveOvr;
    }
}

// Live Goal Flash Banner Helper
function triggerGoalPopup(playerNum, scorerName, minute) {
    const banner = document.getElementById('goal-banner');
    const scorerEl = document.getElementById('goal-scorer-name');
    if (!banner || !scorerEl) return;

    scorerEl.innerText = `${scorerName} (${minute}') - اللاعب ${playerNum}`;
    banner.classList.remove('hidden');

    sounds.play('reveal');
    sounds.play('confirm');
    triggerConfetti();

    setTimeout(() => {
        banner.classList.add('hidden');
    }, 2200);
}

// 7. Interactive Live Match Simulation
function startMatchSimulation() {
    const simOverlay = document.getElementById('match-sim-overlay');
    simOverlay.classList.remove('hidden');

    function getTeamFeaturedName(team) {
        const player = getTeamFeaturedPlayer(team);
        return player ? player.name : 'النجم';
    }

    function calculateFinalPower(team) {
        const selected = [];
        if (team.goalkeepers) selected.push(team.goalkeepers);
        selected.push(...team.defenders);
        selected.push(...team.midfielders);
        selected.push(...team.wingers);
        selected.push(...team.attackers);

        const totalRating = selected.reduce((sum, item) => {
            if (!item) return sum;
            if (item.rating) return sum + item.rating;
            if (item.boost) return sum + item.boost * 2;
            return sum;
        }, 0);

        const avg = selected.length > 0 ? totalRating / selected.length : 0;
        return parseFloat((avg + (team.managers?.boost || 0)).toFixed(2));
    }

    const p1ScoreVal = calculateFinalPower(teams[1]);
    const p2ScoreVal = calculateFinalPower(teams[2]);

    const p1HasJuan = teams[1].attackers.some(att => att.isJuan);
    const p2HasJuan = teams[2].attackers.some(att => att.isJuan);

    const p1Featured = getTeamFeaturedName(teams[1]);
    const p2Featured = getTeamFeaturedName(teams[2]);

    let minute = 0;
    let p1Goals = 0;
    let p2Goals = 0;
    const p1Scorers = [];
    const p2Scorers = [];

    const timerEl = document.getElementById('match-timer');
    const p1GoalsEl = document.getElementById('p1-goals');
    const p2GoalsEl = document.getElementById('p2-goals');
    const commentaryEl = document.getElementById('match-commentary');
    const ballTracer = document.getElementById('ball-tracer');

    const commentaryEvents = [
        { min: 12, msg: `صفارة البداية! تمريرة من ${p1Featured} وانطلاقة سريعة على الجناح.`, side: 'left' },
        { min: 28, msg: `دفاع منظم من فريق اللاعب 1! لا توجد فرصة حقيقية حتى الآن.`, side: 'right' },
        { min: 44, msg: `تكتيك الكابتن ${teams[1].managers?.name || 'المدرب'} يُحكم السيطرة على منتصف الملعب!`, side: 'left' },
        { min: 62, msg: `دقائق حاسمة! كلا الفريقين يحافظ على الحذر الدفاعي!`, side: 'right' },
        { min: 78, msg: `الضغط يشتد لكن الدفاع ينهي جميع المحاولات بنجاح!`, side: 'center' }
    ];

    const matchInterval = setInterval(() => {
        minute += 3;
        timerEl.innerText = `${minute}'`;

        // Ball movement animation
        if (minute % 6 === 0) {
            const pos = 20 + Math.random() * 60;
            ballTracer.style.left = `${pos}%`;
        }

        // Check for Juan Bezerra default goals (2 goals if no one selected him)
        if (minute === 35 && !p1HasJuan && !p2HasJuan) {
            // Juan wasn't selected by anyone - he scores 2 dramatic goals
            p1Goals++;
            p2Goals++;
            p1GoalsEl.innerText = p1Goals;
            p2GoalsEl.innerText = p2Goals;
            commentaryEl.innerText = `⚽ الله اكبر! خوان بيزيرا 🌟 يسجل هدفاً درامياً للفريقين!`;
            triggerGoalPopup(1, 'خوان بيزيرا 🌟', minute);
        }
        // If Juan was selected by player 1
        else if (minute === 38 && p1HasJuan && !p2HasJuan) {
            p1Goals += 2;
            p1GoalsEl.innerText = p1Goals;
            commentaryEl.innerText = `⚽ خوان بيزيرا 🌟 ينطلق في هجمات ماكرة ويسجل هدفين رائعين!`;
            triggerGoalPopup(1, 'خوان بيزيرا 🌟', minute);
        }
        // If Juan was selected by player 2
        else if (minute === 38 && p2HasJuan && !p1HasJuan) {
            p2Goals += 2;
            p2GoalsEl.innerText = p2Goals;
            commentaryEl.innerText = `⚽ خوان بيزيرا 🌟 ينطلق في هجمات ماكرة ويسجل هدفين رائعين!`;
            triggerGoalPopup(2, 'خوان بيزيرا 🌟', minute);
        }
        // If both have Juan (rare scenario - they tie)
        else if (minute === 35 && p1HasJuan && p2HasJuan) {
            p1Goals++;
            p2Goals++;
            p1GoalsEl.innerText = p1Goals;
            p2GoalsEl.innerText = p2Goals;
            commentaryEl.innerText = `⚽ كلا نسخة خوان بيزيرا 🌟 تسجل هدفاً في نفس الوقت!`;
        }
        // Default: maintain 0-0 match
        else {
            const evt = commentaryEvents.find(e => Math.abs(e.min - minute) <= 2);
            if (evt) commentaryEl.innerText = evt.msg;
        }

        if (minute >= 90) {
            clearInterval(matchInterval);

            // Ensure the match never finishes 0-0.
            if (p1Goals === 0 && p2Goals === 0) {
                const winnerTeam = p1ScoreVal >= p2ScoreVal ? 1 : 2;
                const goalName = teams[winnerTeam].attackers?.name || teams[winnerTeam].wingers?.name || teams[winnerTeam].midfielders?.name || 'اللاعب القاتل';
                const goalMinute = 90;

                if (winnerTeam === 1) {
                    p1Goals = 1;
                    p1Scorers.push({ name: goalName, min: goalMinute });
                } else {
                    p2Goals = 1;
                    p2Scorers.push({ name: goalName, min: goalMinute });
                }

                commentaryEl.innerText = `⚽ هدف قاتل في الدقيقة ${goalMinute}! المباراة لن تنتهي 0-0.`;
                triggerGoalPopup(winnerTeam, goalName, goalMinute);
            }

            let penaltyResult = null;

            setTimeout(() => {
                simOverlay.classList.add('hidden');
                showResultModal(p1ScoreVal, p2ScoreVal, p1Goals, p2Goals, p1Scorers, p2Scorers, penaltyResult);
            }, 2200);
        }
    }, 120);
}

// 8. Result Victory Screen Modal with Detailed Goals, Scorers & Penalties
function showResultModal(p1Score, p2Score, p1Goals, p2Goals, p1Scorers = [], p2Scorers = [], penaltyResult = null) {
    document.getElementById('p1-score-text').innerText = `التقييم: ${p1Score}`;
    document.getElementById('p2-score-text').innerText = `التقييم: ${p2Score}`;

    const winnerText = document.getElementById('winner-text');

    if (penaltyResult) {
        document.getElementById('final-match-score').innerText = `${p1Goals} - ${p2Goals} (${penaltyResult.p1Pen} - ${penaltyResult.p2Pen} ترجيح)`;
        if (penaltyResult.p1Pen > penaltyResult.p2Pen) {
            winnerText.innerText = "🏆 فوز اللاعب 1 بركلات الترجيح!";
            winnerText.style.color = "var(--p1-color)";
        } else {
            winnerText.innerText = "🏆 فوز اللاعب 2 بركلات الترجيح!";
            winnerText.style.color = "var(--p2-color)";
        }
    } else {
        document.getElementById('final-match-score').innerText = `${p1Goals} - ${p2Goals}`;
        if (p1Goals > p2Goals) {
            winnerText.innerText = "🏆 فوز مستحق للاعب 1!";
            winnerText.style.color = "var(--p1-color)";
        } else if (p2Goals > p1Goals) {
            winnerText.innerText = "🏆 فوز مستحق للاعب 2!";
            winnerText.style.color = "var(--p2-color)";
        } else {
            winnerText.innerText = "🤝 تعادل عادل بين الفريقين!";
            winnerText.style.color = "var(--primary-gold)";
        }
    }

    // Render Goals Breakdown List
    const p1ListEl = document.getElementById('p1-goals-list');
    const p2ListEl = document.getElementById('p2-goals-list');

    if (p1Scorers.length === 0) {
        p1ListEl.innerHTML = `<div class="no-goals">لا يوجد أهداف</div>`;
    } else {
        p1ListEl.innerHTML = p1Scorers.map(g => `
            <div class="goal-item">
                <span>⚽ ${g.name}</span>
                <span class="goal-min">${g.min}'</span>
            </div>
        `).join('');
    }

    if (p2Scorers.length === 0) {
        p2ListEl.innerHTML = `<div class="no-goals">لا يوجد أهداف</div>`;
    } else {
        p2ListEl.innerHTML = p2Scorers.map(g => `
            <div class="goal-item">
                <span>⚽ ${g.name}</span>
                <span class="goal-min">${g.min}'</span>
            </div>
        `).join('');
    }

    triggerConfetti();
    document.getElementById('result-modal').classList.remove('hidden');
}

// 9. Particle / Confetti System
function triggerConfetti() {
    const canvas = document.getElementById('effects-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f39c12', '#00d2ff', '#ff3366', '#00e676', '#a855f7'];

    for (let i = 0; i < 75; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.5) * 16 - 4,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        particles.forEach(p => {
            if (p.life > 0) {
                active = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.3; // Gravity
                p.life -= 0.02;

                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        if (active) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

function validateAndStartGame() {
    const p1Input = document.getElementById('player1-name');
    const p2Input = document.getElementById('player2-name');

    const player1Name = p1Input.value.trim() || 'اللاعب 1';
    const player2Name = p2Input.value.trim() || 'اللاعب 2';

    playerNames[1] = player1Name;
    playerNames[2] = player2Name;

    document.getElementById('p1-team-title').innerText = player1Name;
    document.getElementById('p2-team-title').innerText = player2Name;
    document.getElementById('p1-scoreboard-name').innerText = player1Name;
    document.getElementById('p2-scoreboard-name').innerText = player2Name;
    document.getElementById('p1-final-title').innerText = player1Name;
    document.getElementById('p2-final-title').innerText = player2Name;

    document.getElementById('player-name-overlay').classList.add('hidden');

    renderField(1);
    renderField(2);
    renderCoachName(1);
    renderCoachName(2);
    updateLiveRatings();
    updateStartButton();
}

window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.addEventListener('click', validateAndStartGame);
    }

    const searchInput = document.getElementById('player-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            renderSearchResults(event.target.value);
        });
    }

    const overlay = document.getElementById('player-search-overlay');
    if (overlay) {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) closePlayerSearch();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closePlayerSearch();
    });

    renderField(1);
    renderField(2);
    updateLiveRatings();
    updateStartButton();
});