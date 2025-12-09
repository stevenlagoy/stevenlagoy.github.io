import { pokemonJSONPath, movesJSONPath, routesJSONPath, effectivenessJSONPath } from './FileLocations.js';

export enum Type {
    NORMAL,
    FIGHTING,
    POISON,
    GROUND,
    FLYING,
    BUG,
    ROCK,
    GHOST,
    STEEL,
    FIRE,
    WATER,
    ELECTRIC,
    GRASS,
    ICE,
    PSYCHIC,
    DRAGON,
    DARK,
    FAIRY,
    MYSTERY
}

export namespace Type {
    export function fromString(value: string): Type {
        const upperValue = value.toUpperCase();
        const enumEntry = Object.entries(Type)
            .find(([key, val]) => 
                typeof val === 'number' && key === upperValue
            );
        
        if (!enumEntry) {
            throw new Error(`Invalid Pokemon type: ${value}`);
        }
        
        return enumEntry[1] as Type;
    }

    export function toString(type: Type): string {
        return Type[type];
    }

    export const weaknesses: Map<Type, Type[]>  = new Map<Type, Type[]>();
    export const resistances: Map<Type, Type[]> = new Map<Type, Type[]>();
    export const immunities: Map<Type, Type[]>  = new Map<Type, Type[]>();

    async function loadTypeEffects() {
        return fetch(effectivenessJSONPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                weaknesses.clear();
                resistances.clear();
                immunities.clear();

                Object.entries(data.weakness).forEach(([type, weakTo]) => {
                    weaknesses.set(
                        Type.fromString(type),
                        (weakTo as string[]).map(t => Type.fromString(t))
                    );
                });
                Object.entries(data.resistance).forEach(([type, resistantTo]) => {
                    resistances.set(
                        Type.fromString(type),
                        (resistantTo as string[]).map(t => Type.fromString(t))
                    );
                });
                Object.entries(data.immunity).forEach(([type, immuneTo]) => {
                    immunities.set(
                        Type.fromString(type),
                        (immuneTo as string[]).map(t => Type.fromString(t))
                    );
                });
                return Promise.resolve();
            })
            .catch(error => {
                console.error(`Error fetching or parsing JSON: ${error}`);
                return Promise.reject(error);
            });
    }
    export async function getTypeEffect(attackerTypes: Type[], defenderTypes: Type[]): Promise<Number> {
        if (weaknesses.size === 0) {
            await loadTypeEffects();
        }

        // For each attacking type, find the best effectiveness
        const effectiveness = Math.max(...attackerTypes.map(attackerType => {
            // For each defending type, multiply the effectiveness
            return defenderTypes.reduce((product, defenderType) => {
                // Check immunities first (product becomes 0)
                const immunity = immunities.get(defenderType);
                if (immunity?.includes(attackerType)) {
                    return 0;
                }

                // Check weaknesses (multiply by 2)
                const weakness = weaknesses.get(defenderType);
                if (weakness?.includes(attackerType)) {
                    return product * 2;
                }

                // Check resistances (multiply by 0.5)
                const resistance = resistances.get(defenderType);
                if (resistance?.includes(attackerType)) {
                    return product * 0.5;
                }

                // No special effectiveness (multiply by 1)
                return product;
            }, 1.0);
        }));

        return effectiveness;
    }
}