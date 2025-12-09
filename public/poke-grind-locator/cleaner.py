def processPokemonFile():
    with open("pokemon_raw.json", "r", encoding="utf-8") as pokemon:
        contents = pokemon.readlines()
    
    processed = []

    i = 0
    while i < len(contents[::]):
        line = contents[i]
        if (line.find('"name":')) != -1:
            english_name = contents[i+1].strip()[11:].replace(",","")
            processed.append("\t\t\"name\": " + english_name + ",\n")
            
            base_exp = exp.get(english_name)
            base_exp = base_exp if base_exp else 0
            processed.append("\t\t\"base_exp\" : " + str(base_exp) + ",\n")
            i += 6
            continue
        else:
            processed.append(line)
        i += 1

    with open("pokemon.json", "w", encoding="utf-8") as result:
        for line in processed:
            result.write(line)

exp = {}

def processExpFile():
    global exp
    with open("exp_data_raw.txt", "r", encoding="utf-8") as file:
        contents = file.readlines()

    names = []
    processed = ["{\n"]

    i = 0
    while i < len(contents[::]):
        line = contents[i]
        try:
            pokemon_name = line.split("title=")[1].split("><")[0].strip()
            pokemon_name = pokemon_name.replace("&#39;","'")
            if pokemon_name not in names:
                names.append(pokemon_name)
                base_exp = contents[i+4].split(">")[1].strip()
                exp[pokemon_name] = base_exp
                processed.append("\t" + pokemon_name + " : " + base_exp + ",\n")
            i += 4
        except(IndexError):
            i += 1
            continue
        i += 1

    processed[-1] = processed[-1][:-2] + "\n"
    processed.append("}")

    with open("experience.json", "w", encoding="utf-8") as result:
        for line in processed:
            result.write(line)

def readEncounterRate():
    with open("input.in", "r", encoding="utf-8") as file:
        contents = file.readlines()
    
    contents = [line for line in contents if line]

    result = "\"available_pokemon\" : [\n"

    i = 0
    while i < len(contents[::]):
        line = contents[i]
        if line.find("Available") != -1:
            i += 1
            continue
        if line.find("Location") != -1:
            i += 1
            continue
        if line.find("Morning") != -1:
            i += 1
            continue
        if line.find("background") != -1:
            i += 1
            continue
        pokemon_name = line.split()[0].strip()
        location = contents[i+2].split()[0].strip()

        try:
            min_level = contents[i+3].split("-")[0].strip()
            max_level = contents[i+3].split("-")[1].split()[0].strip()
        except IndexError:
            # there may be only one level
            min_level = contents[i+3].split()[0].strip()
            max_level = min_level
        if min_level.find(",") != -1:
            levels = min_level.split(",")
            min_level = levels[0]
            max_level = levels[-1]

        morning_rate = float(contents[i+3].split()[1].strip().strip("%")) / 100
        try:
            day_rate = float(contents[i+3].split()[2].strip().strip("%")) / 100
            night_rate = float(contents[i+3].split()[3].strip().strip("%")) / 100
        except IndexError:
            # there may be only one encounter rate for the full day
            day_rate = morning_rate
            night_rate = morning_rate
        
        result += "\t{\n"
        result += "\t    \"name\" : \"" + pokemon_name + "\",\n"
        result += "\t    \"location\" : \"" + location + "\",\n"
        result += "\t    \"level_min\" : " + str(min_level) + ",\n"
        result += "\t    \"level_max\" : " + str(max_level) + ",\n"
        result += "\t    \"morning_encounter_rate\" : " + str(morning_rate) + ",\n"
        result += "\t    \"day_encounter_rate\" : " + str(day_rate) + ",\n"
        result += "\t    \"night_encounter_rate\" : " + str(night_rate) + "\n"
        result += "\t},\n"
        
        # print(result)

        i += 4
    
    result = result[:-2:] + "\n"
    result += "    ]"
    print(result)


def main():
    # processExpFile()
    # processPokemonFile()
    readEncounterRate()

if __name__ == "__main__":
    main()