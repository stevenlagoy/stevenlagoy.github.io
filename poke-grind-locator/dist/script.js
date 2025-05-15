import { pokemonJSONPath, movesJSONPath, routesJSONPath } from './FileLocations.js';
import { Pokemon, Stats } from './Pokemon.js';
import { Move } from './Move.js';
import { Route } from './Route.js';
import { processEncounters, Time } from './Encounter.js';
import { Type } from './Type.js';
export const pokemon = [];
export const moves = [];
export const routes = [];
function readPokemonJSON() {
    fetch(pokemonJSONPath)
        .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
        .then(data => {
        pokemon.length = 0; // clear the existing array
        data.filter((poke) => poke.id && poke.name && poke.type && poke.base_exp && poke.base)
            .forEach((poke) => {
            let stats = new Stats(poke.base.HP, poke.base.Attack, poke.base.Defense, poke.base["Sp. Attack"], poke.base["Sp. Defense"], poke.base.Speed);
            let newPoke = new Pokemon(poke.id, poke.name, poke.type.map(type => Type.fromString(type)), poke.base_exp, 0, stats);
            pokemon.push(newPoke);
            addPokemonSelectEntry(newPoke);
        });
    })
        .catch(error => {
        console.error(`Error fetching or parsing JSON: ${error}`);
    });
}
function readMovesJSON() {
    fetch(movesJSONPath)
        .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
        .then(data => {
        moves.length = 0;
        data.filter((move) => move.accuracy && move.ename && move.power && move.pp && move.type)
            .forEach((move) => {
            let newMove = new Move(move.accuracy, move.ename, move.power, move.pp, Type.fromString(move.type));
            moves.push(newMove);
            addMoveSelectEntry(newMove);
        });
    })
        .catch(error => {
        console.error(`Error fetching or parsing JSON: ${error}`);
    });
}
function readRoutesJSON() {
    fetch(routesJSONPath)
        .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
        .then(data => {
        routes.length = 0;
        data.filter((route) => route.route_name && route.route_number && route.available_pokemon)
            .forEach((route) => {
            routes.push(new Route(route.route_name, route.route_number, processEncounters(route.available_pokemon)));
        });
    })
        .catch(error => {
        console.error(`Error fetching or parsing JSON: ${error}`);
    });
}
function addPokemonSelectEntry(pokemon) {
    const pokeSelect = document.getElementById("pokemon-selector");
    const newOption = document.createElement("option");
    newOption.value = pokemon.name;
    newOption.text = pokemon.name;
    if (pokeSelect && pokeSelect instanceof HTMLSelectElement) {
        pokeSelect.add(newOption);
    }
    else
        throw new Error("HTML element missing or of improper type.");
}
function addMoveSelectEntry(move) {
    for (let i = 1; i <= 4; i++) {
        const moveSelect = document.getElementById(`move${i}-select`);
        const newOption = document.createElement("option");
        newOption.value = move.name.toString();
        newOption.text = move.name.toString();
        if (moveSelect && moveSelect instanceof HTMLSelectElement) {
            moveSelect.add(newOption);
        }
        else
            throw new Error("HTML element missing or of improper type.");
    }
}
function updateLevelLabel() {
    const slider = document.getElementById("level-slider");
    const label = document.getElementById("level-value");
    if (slider && label && slider instanceof HTMLInputElement) {
        slider.addEventListener('input', function () {
            label.textContent = this.value;
        });
    }
    else
        throw new Error("HTML element missing or of improper type.");
}
function updateRatioLabel() {
    const slider = document.getElementById("ratio-slider");
    const label = document.getElementById("ratio-value");
    if (slider && label && slider instanceof HTMLInputElement) {
        slider.addEventListener('input', function () {
            label.textContent = this.value;
        });
    }
    else
        throw new Error("HTML element missing or of improper type.");
}
function addPokemonSelectListeners() {
    const selector = document.getElementById("pokemon-selector");
    const img1 = document.getElementById("pokemon-type-img1");
    const img2 = document.getElementById("pokemon-type-img2");
    const pokeImage = document.getElementById("pokemon-image");
    const statHP = document.getElementById("stat-hp");
    const statAttack = document.getElementById("stat-attack");
    const statDefence = document.getElementById("stat-defense");
    const statSpAtk = document.getElementById("stat-spattack");
    const statSpDef = document.getElementById("stat-spdefense");
    const statSpeed = document.getElementById("stat-speed");
    const weakList = document.getElementById("weak-list");
    const resistantList = document.getElementById("resistant-list");
    const immuneList = document.getElementById("immune-list");
    if (!selector || !(selector instanceof HTMLSelectElement) ||
        !img1 || !img2 || !pokeImage ||
        !statHP || !(statHP instanceof HTMLInputElement) ||
        !statAttack || !(statAttack instanceof HTMLInputElement) ||
        !statDefence || !(statDefence instanceof HTMLInputElement) ||
        !statSpAtk || !(statSpAtk instanceof HTMLInputElement) ||
        !statSpDef || !(statSpDef instanceof HTMLInputElement) ||
        !statSpeed || !(statSpeed instanceof HTMLInputElement) ||
        !weakList || !resistantList || !immuneList) {
        throw new Error("HTML element missing or of improper type.");
    }
    selector.addEventListener('input', async function () {
        const foundPokemon = pokemon.find(p => p.name === this.value);
        // Load type effect data
        if (Type.weaknesses.size === 0) {
            await Type.getTypeEffect([Type.NORMAL], [Type.NORMAL]);
        }
        // Update type images
        if (foundPokemon) {
            img1.src = `gfx/${Type.toString(foundPokemon.type[0]).toLowerCase()}_type.png`;
            img1.alt = Type.toString(foundPokemon.type[0]) + " Type";
            if (foundPokemon.type.length > 1) {
                img2.src = `gfx/${Type.toString(foundPokemon.type[1]).toLowerCase()}_type.png`;
                img2.alt = Type.toString(foundPokemon.type[1]) + " Type";
            }
            else {
                img2.src = "gfx/no_type.png";
                img2.alt = "";
            }
            pokeImage.src = foundPokemon.getImage();
        }
        else {
            img1.src = "gfx/no_type.png";
            img2.src = "gfx/no_type.png";
            img1.alt = "";
            img2.alt = "";
            pokeImage.src = "gfx/poke-thumbnails/none.png";
        }
        // Update stats
        if (foundPokemon) {
            statHP.value = foundPokemon.stats.hp.toString();
            statAttack.value = foundPokemon.stats.attack.toString();
            statDefence.value = foundPokemon.stats.defense.toString();
            statSpAtk.value = foundPokemon.stats.spAttack.toString();
            statSpDef.value = foundPokemon.stats.spDefense.toString();
            statSpeed.value = foundPokemon.stats.speed.toString();
        }
        else {
            statHP.value = "--";
            statAttack.value = "--";
            statDefence.value = "--";
            statSpAtk.value = "--";
            statSpDef.value = "--";
            statSpeed.value = "--";
        }
        // Update type effects
        if (foundPokemon) {
            // Assume weaknesses, resistances, immunities are Maps<Type, Type[]>
            const typeArr = foundPokemon.type;
            let weakTo = [];
            let resistantTo = [];
            let immuneTo = [];
            for (const t of typeArr) {
                const w = Type.weaknesses.get(t) || [];
                const r = Type.resistances.get(t) || [];
                const i = Type.immunities.get(t) || [];
                weakTo.push(...w.map(Type.toString));
                resistantTo.push(...r.map(Type.toString));
                immuneTo.push(...i.map(Type.toString));
            }
            // Remove duplicates
            weakTo = [...new Set(weakTo)];
            resistantTo = [...new Set(resistantTo)];
            immuneTo = [...new Set(immuneTo)];
            // Update lists
            weakList.innerHTML = weakTo.length ? weakTo.map(type => `<li>${type}</li>`).join('') : "<li>None</li>";
            resistantList.innerHTML = resistantTo.length ? resistantTo.map(type => `<li>${type}</li>`).join('') : "<li>None</li>";
            immuneList.innerHTML = immuneTo.length ? immuneTo.map(type => `<li>${type}</li>`).join('') : "<li>None</li>";
        }
        else {
            weakList.innerHTML = "<li>None</li>";
            resistantList.innerHTML = "<li>None</li>";
            immuneList.innerHTML = "<li>None</li>";
        }
    });
}
function addMoveSelectListeners() {
    const selector1 = document.getElementById("move1-select");
    const img1 = document.getElementById("move1-img");
    if (selector1 && img1 && selector1 instanceof HTMLSelectElement && img1 instanceof HTMLImageElement) {
        selector1.addEventListener('input', function () {
            const selectedMove = moves.find(m => m.name === this.value);
            if (selectedMove) {
                img1.src = `gfx/${Type.toString(selectedMove.type).toLowerCase()}_type.png`;
                img1.alt = selectedMove.type + " Type";
            }
            else {
                img1.src = "gfx/no_type.png";
                img1.alt = "";
            }
            updateMoveInfo("move1-select", "move1-info");
        });
        updateMoveInfo("move1-select", "move1-info");
    }
    else
        throw new Error("HTML element missing or of improper type.");
    const selector2 = document.getElementById("move2-select");
    const img2 = document.getElementById("move2-img");
    if (selector2 && img2 && selector2 instanceof HTMLSelectElement && img2 instanceof HTMLImageElement) {
        selector2.addEventListener('input', function () {
            const selectedMove = moves.find(m => m.name === this.value);
            if (selectedMove) {
                img2.src = `gfx/${Type.toString(selectedMove.type).toLowerCase()}_type.png`;
                img2.alt = selectedMove.type + " Type";
            }
            else {
                img2.src = "gfx/no_type.png";
                img2.alt = "";
            }
            updateMoveInfo("move2-select", "move2-info");
        });
        updateMoveInfo("move2-select", "move2-info");
    }
    else
        throw new Error("HTML element missing or of improper type.");
    const selector3 = document.getElementById("move3-select");
    const img3 = document.getElementById("move3-img");
    if (selector3 && img3 && selector3 instanceof HTMLSelectElement && img3 instanceof HTMLImageElement) {
        selector3.addEventListener('input', function () {
            const selectedMove = moves.find(m => m.name === this.value);
            if (selectedMove) {
                img3.src = `gfx/${Type.toString(selectedMove.type).toLowerCase()}_type.png`;
                img3.alt = selectedMove.type + " Type";
            }
            else {
                img3.src = "gfx/no_type.png";
                img3.alt = "";
            }
            updateMoveInfo("move3-select", "move3-info");
        });
        updateMoveInfo("move3-select", "move3-info");
    }
    else
        throw new Error("HTML element missing or of improper type.");
    const selector4 = document.getElementById("move4-select");
    const img4 = document.getElementById("move4-img");
    if (selector4 && img4 && selector4 instanceof HTMLSelectElement && img4 instanceof HTMLImageElement) {
        selector4.addEventListener('input', function () {
            const selectedMove = moves.find(m => m.name === this.value);
            if (selectedMove) {
                img4.src = `gfx/${Type.toString(selectedMove.type).toLowerCase()}_type.png`;
                img4.alt = selectedMove.type + " Type";
            }
            else {
                img4.src = "gfx/no_type.png";
                img4.alt = "";
            }
            updateMoveInfo("move4-select", "move4-info");
        });
        updateMoveInfo("move4-select", "move4-info");
    }
    else
        throw new Error("HTML element missing or of improper type.");
}
function updateMoveInfo(moveSelectId, infoBoxId) {
    const select = document.getElementById(moveSelectId);
    const infoBox = document.getElementById(infoBoxId);
    if (!select || !infoBox)
        return;
    select.addEventListener('input', function () {
        const selectedMove = moves.find(m => m.name === this.value);
        if (selectedMove) {
            infoBox.querySelector('.move-acc').textContent = `${selectedMove.accuracy}`;
            infoBox.querySelector('.move-pow').textContent = `${selectedMove.power}`;
            infoBox.querySelector('.move-pp').textContent = `${selectedMove.pp}`;
        }
        else {
            infoBox.querySelector('.move-acc').textContent = `--`;
            infoBox.querySelector('.move-pow').textContent = `--`;
            infoBox.querySelector('.move-pp').textContent = `--`;
        }
    });
}
function addLocateButtonListener() {
    const locateButton = document.getElementById("locate-button");
    if (locateButton && locateButton instanceof HTMLButtonElement) {
        locateButton.addEventListener('click', locate);
    }
    else
        throw new Error("HTML element missing or of improper type.");
}
let time;
function getTime() {
    const timeSelectors = document.querySelectorAll('input[name="time"]');
    for (const radio of timeSelectors) {
        if (radio instanceof HTMLInputElement && radio.checked) {
            switch (radio.value) {
                case "morning":
                    return Time.MORNING;
                case "day":
                    return Time.DAY;
                case "night":
                    return Time.NIGHT;
                default:
                    throw new Error("Invalid time value");
            }
        }
    }
    // If we get here, no radio button was checked
    throw new Error("No time selected");
}
let userPokemon;
function getUserPokemon() {
    const pokemonSelect = document.getElementById("pokemon-selector");
    const levelSelect = document.getElementById("level-slider");
    if (!pokemonSelect || !levelSelect ||
        !(pokemonSelect instanceof HTMLSelectElement) ||
        !(levelSelect instanceof HTMLInputElement)) {
        throw new Error("HTML element missing or of improper type.");
    }
    const selectedPokemon = pokemon.find(poke => poke.name === pokemonSelect.value);
    if (!selectedPokemon || pokemonSelect.value === "none") {
        const warning = document.getElementById("warning-select-pokemon-first");
        if (warning) {
            warning.style.display = "block";
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }
        throw new Error("No Pokemon selected");
    }
    return new Pokemon(selectedPokemon.id, selectedPokemon.name, selectedPokemon.type, selectedPokemon.baseExp, Number(levelSelect.value), selectedPokemon.stats);
}
let maxRouteNum;
function getMaxRouteNum() {
    const routeNumInput = document.getElementById("route-num-input");
    if (routeNumInput && routeNumInput instanceof HTMLInputElement) {
        return Number(routeNumInput.value);
    }
    throw new Error("HTML element missing or of improper type.");
}
let dangerRatio;
function getDangerRatio() {
    const dangerRatioInput = document.getElementById("ratio-slider");
    if (dangerRatioInput && dangerRatioInput instanceof HTMLInputElement) {
        return Number(dangerRatioInput.value);
    }
    throw new Error("HTML element missing or of improper type.");
}
async function locate() {
    try {
        userPokemon = getUserPokemon();
        time = getTime();
        maxRouteNum = getMaxRouteNum();
        dangerRatio = getDangerRatio();
        let acceptableMatchup = dangerToMatchup(dangerRatio);
        console.log("Locate!");
        let routeWeights = new Map();
        // Evaluate both experience and danger (matchup) for each route
        const evaluations = await Promise.all(routes
            .filter(route => route.routeNumber <= maxRouteNum)
            .map(async (route) => {
            const weight = await userPokemon.evaluateRouteExperience(route, time, acceptableMatchup);
            const avgMatchup = await userPokemon.evaluateRouteMatchup(route, time);
            const avgDanger = matchupToDanger(avgMatchup);
            return { route: route.routeName, weight, avgDanger };
        }));
        // Add all results to the Map
        evaluations.forEach(({ route, weight }) => {
            routeWeights.set(route, weight);
        });
        // Sort the routes by weight (descending) and get the top ten
        const topRoutes = evaluations
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 10);
        // Display the top results in the results div
        const resultsDiv = document.getElementById("results-div");
        if (resultsDiv) {
            // Build the HTML for the top routes
            let html = `
                <h2>Results</h2>
                <p>These results represent the top 10 results sorted by average expected experience gain from encounters on that Route.</p>
                <p>The name of the Route is listed, followed by the expected experience, then the danger ratio.</p>
                <h3>The best places to grind for levels are:</h3>
                <ol>
                    ${topRoutes.map(({ route, weight, avgDanger }) => `<li>${route} <span style="color:#888;font-size:0.9em;">(Exp: ${weight.toFixed(2)}, Danger: ${avgDanger.toFixed(2)})</span></li>`).join('')}
                </ol>
            `;
            resultsDiv.innerHTML = html;
            resultsDiv.style.display = "block";
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }
        const warning = document.getElementById("warning-select-pokemon-first");
        if (warning) {
            warning.style.display = "none";
        }
    }
    catch (error) {
        console.error("Error in locate function:", error);
    }
}
function dangerToMatchup(danger) {
    // Clamp danger to [1, 10]
    danger = Math.max(1, Math.min(10, danger));
    // Map 1 (safe) to 1.0, 10 (unsafe) to -1.0
    return 1 - ((danger - 1) / 9) * 2;
}
function matchupToDanger(matchup) {
    // Clamp matchup to [-1, 1]
    matchup = Math.max(-1, Math.min(1, matchup));
    // Map 1.0 (safe) to 1, -1.0 (unsafe) to 10
    return 1 + ((1 - matchup) / 2) * 9;
}
async function main() {
    readPokemonJSON();
    readMovesJSON();
    readRoutesJSON();
    updateLevelLabel();
    updateRatioLabel();
    addPokemonSelectListeners();
    addMoveSelectListeners();
    addLocateButtonListener();
}
main();
