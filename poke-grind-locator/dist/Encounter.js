import { pokemon } from './script.js';
export const Time = {
    MORNING: "morning",
    DAY: "day",
    NIGHT: "night"
};
export class Encounter {
    constructor(pokemon, location, level, time, rate) {
        this.pokemon = pokemon;
        this.location = location;
        this.level = level;
        this.time = time;
        this.rate = rate;
    }
}
export function processEncounters(availablePokemon) {
    let encounters = [];
    availablePokemon.forEach(poke => {
        if (!poke.name)
            return; // Skip invalid entries
        // Find the corresponding Pokemon object
        const pokemonData = pokemon.find(p => p.name === poke.name);
        if (!pokemonData)
            return; // Skip if Pokemon not found
        let level = (poke.level_min + poke.level_max) / 2;
        if (poke.morning_encounter_rate > 0) {
            encounters.push(new Encounter(pokemonData, poke.location, level, Time.MORNING, poke.morning_encounter_rate));
        }
        if (poke.day_encounter_rate > 0) {
            encounters.push(new Encounter(pokemonData, poke.location, level, Time.DAY, poke.day_encounter_rate));
        }
        if (poke.night_encounter_rate > 0) {
            encounters.push(new Encounter(pokemonData, poke.location, level, Time.NIGHT, poke.night_encounter_rate));
        }
    });
    return encounters;
}
