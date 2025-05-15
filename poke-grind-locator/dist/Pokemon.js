import { Type } from './Type.js';
export class Pokemon {
    constructor(id, name, type, baseExp, level, stats) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.baseExp = baseExp;
        this.level = level;
        this.stats = stats;
    }
    async evaluateRouteMatchup(route, time) {
        return await aggregateMatchupResults(this, route.encounters, time);
    }
    async evaluateRouteExperience(route, time, acceptableMatchup) {
        // Returns a number representing the average expected experience to be gained from an encounter on this route
        // Only considers matchups where this Pokemon has an advantage. Scales winning matches by the advantage.
        return await aggregateExperienceResults(this, route.encounters, time, acceptableMatchup);
    }
    getImage() {
        return `gfx/poke-thumbnails/${("00" + this.id).slice(-3)}.png`;
    }
}
export class Stats {
    constructor(hp, attack, defense, spAttack, spDefense, speed) {
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.spAttack = spAttack;
        this.spDefense = spDefense;
        this.speed = speed;
    }
}
function compareStats(attackerStats, defenderStats) {
    const atkPower = attackerStats.attack + attackerStats.spAttack + attackerStats.speed;
    const defPower = defenderStats.defense + defenderStats.spDefense + defenderStats.hp;
    return (atkPower - defPower) / (atkPower + defPower); // range -1 to 1
}
async function evaluateMatchup(attacker, defender) {
    const typeMultiplier = await Type.getTypeEffect(attacker.type, defender.type); // e.g. 2, 1, 0.5
    const typeScore = Math.log2(typeMultiplier); // 1 for x2, 0 for x1, -1 for x0.5
    const statScore = compareStats(attacker.stats, defender.stats); // -1 to 1
    const combinedScore = (typeScore * 0.6 + statScore * 0.4); // weighted
    return Math.max(-1, Math.min(1, combinedScore)); // clamp to [-1, 1]
}
async function calculateExpectedExperience(attacker, defender, defenderLevel, acceptableMatchup) {
    let matchupScore = await evaluateMatchup(attacker, defender);
    if (matchupScore < acceptableMatchup)
        return 0;
    let experienceGain = calculateExperienceGain(attacker, defender, defenderLevel);
    return matchupScore * experienceGain;
}
function calculateExperienceGain(winner, loser, loserLevel) {
    // Δexp = ((b * L) / 7) * (1 / s) * e * a * t
    // a = loser owned by trainer?
    // b = base experience yield of species
    // e = winner holding lucky egg?
    // L = level of loser
    // s = number of pokemon in battle
    // t = is winner owned by original trainer?
    let a = 1; // 1.5 if owned by trainer, 1 otherwise
    let b = loser.baseExp;
    let e = 1; // 1.5 if holding lucky egg, 1 otherwise
    let L = loserLevel;
    let s = 1; // number of pokemon
    let t = 1; // 1 if owned by Original Trainer, 1.5 otherwise
    let exp = ((b * L) / 7) * (1 / 2) * e * a * t;
    return exp;
}
async function aggregateMatchupResults(pokemon, encounters, time) {
    // Filter encounters for the given time
    const relevantEncounters = encounters.filter(encounter => encounter.time === time);
    if (relevantEncounters.length === 0)
        return 0;
    // For each encounter, calculate matchup score (weighted by encounter rate)
    const matchupScores = await Promise.all(relevantEncounters.map(async (encounter) => {
        const score = await evaluateMatchup(pokemon, encounter.pokemon);
        return score * encounter.rate;
    }));
    // Sum weighted scores and divide by total rate to get average
    const totalRate = relevantEncounters.reduce((sum, e) => sum + e.rate, 0);
    const totalScore = matchupScores.reduce((sum, score) => sum + score, 0);
    return totalRate > 0 ? totalScore / totalRate : 0;
}
async function aggregateExperienceResults(pokemon, encounters, time, acceptableMatchup) {
    // Calculate the expected experience gain for each encounter at the given time
    const relevantEncounters = encounters.filter(encounter => encounter.time === time);
    if (relevantEncounters.length === 0)
        return 0;
    // For each encounter, calculate expected experience gain (weighted by encounter rate)
    const expGains = await Promise.all(relevantEncounters.map(async (encounter) => {
        var _a;
        // Use the encounter's pokemon and level for calculation
        const exp = await calculateExpectedExperience(pokemon, encounter.pokemon, (_a = encounter.level) !== null && _a !== void 0 ? _a : encounter.pokemon.level, acceptableMatchup);
        return exp * encounter.rate;
    }));
    // Sum weighted exp gains and divide by total rate to get average
    const totalRate = relevantEncounters.reduce((sum, e) => sum + e.rate, 0);
    const totalExp = expGains.reduce((sum, exp) => sum + exp, 0);
    return totalRate > 0 ? totalExp / totalRate : 0;
}
