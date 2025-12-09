import { effectivenessJSONPath } from './FileLocations.js';
export var Type;
(function (Type) {
    Type[Type["NORMAL"] = 0] = "NORMAL";
    Type[Type["FIGHTING"] = 1] = "FIGHTING";
    Type[Type["POISON"] = 2] = "POISON";
    Type[Type["GROUND"] = 3] = "GROUND";
    Type[Type["FLYING"] = 4] = "FLYING";
    Type[Type["BUG"] = 5] = "BUG";
    Type[Type["ROCK"] = 6] = "ROCK";
    Type[Type["GHOST"] = 7] = "GHOST";
    Type[Type["STEEL"] = 8] = "STEEL";
    Type[Type["FIRE"] = 9] = "FIRE";
    Type[Type["WATER"] = 10] = "WATER";
    Type[Type["ELECTRIC"] = 11] = "ELECTRIC";
    Type[Type["GRASS"] = 12] = "GRASS";
    Type[Type["ICE"] = 13] = "ICE";
    Type[Type["PSYCHIC"] = 14] = "PSYCHIC";
    Type[Type["DRAGON"] = 15] = "DRAGON";
    Type[Type["DARK"] = 16] = "DARK";
    Type[Type["FAIRY"] = 17] = "FAIRY";
    Type[Type["MYSTERY"] = 18] = "MYSTERY";
})(Type || (Type = {}));
(function (Type) {
    function fromString(value) {
        const upperValue = value.toUpperCase();
        const enumEntry = Object.entries(Type)
            .find(([key, val]) => typeof val === 'number' && key === upperValue);
        if (!enumEntry) {
            throw new Error(`Invalid Pokemon type: ${value}`);
        }
        return enumEntry[1];
    }
    Type.fromString = fromString;
    function toString(type) {
        return Type[type];
    }
    Type.toString = toString;
    Type.weaknesses = new Map();
    Type.resistances = new Map();
    Type.immunities = new Map();
    async function loadTypeEffects() {
        return fetch(effectivenessJSONPath)
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
            .then(data => {
            Type.weaknesses.clear();
            Type.resistances.clear();
            Type.immunities.clear();
            Object.entries(data.weakness).forEach(([type, weakTo]) => {
                Type.weaknesses.set(Type.fromString(type), weakTo.map(t => Type.fromString(t)));
            });
            Object.entries(data.resistance).forEach(([type, resistantTo]) => {
                Type.resistances.set(Type.fromString(type), resistantTo.map(t => Type.fromString(t)));
            });
            Object.entries(data.immunity).forEach(([type, immuneTo]) => {
                Type.immunities.set(Type.fromString(type), immuneTo.map(t => Type.fromString(t)));
            });
            return Promise.resolve();
        })
            .catch(error => {
            console.error(`Error fetching or parsing JSON: ${error}`);
            return Promise.reject(error);
        });
    }
    async function getTypeEffect(attackerTypes, defenderTypes) {
        if (Type.weaknesses.size === 0) {
            await loadTypeEffects();
        }
        // For each attacking type, find the best effectiveness
        const effectiveness = Math.max(...attackerTypes.map(attackerType => {
            // For each defending type, multiply the effectiveness
            return defenderTypes.reduce((product, defenderType) => {
                // Check immunities first (product becomes 0)
                const immunity = Type.immunities.get(defenderType);
                if (immunity === null || immunity === void 0 ? void 0 : immunity.includes(attackerType)) {
                    return 0;
                }
                // Check weaknesses (multiply by 2)
                const weakness = Type.weaknesses.get(defenderType);
                if (weakness === null || weakness === void 0 ? void 0 : weakness.includes(attackerType)) {
                    return product * 2;
                }
                // Check resistances (multiply by 0.5)
                const resistance = Type.resistances.get(defenderType);
                if (resistance === null || resistance === void 0 ? void 0 : resistance.includes(attackerType)) {
                    return product * 0.5;
                }
                // No special effectiveness (multiply by 1)
                return product;
            }, 1.0);
        }));
        return effectiveness;
    }
    Type.getTypeEffect = getTypeEffect;
})(Type || (Type = {}));
