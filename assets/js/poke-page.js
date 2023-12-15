const parametros = new URLSearchParams(window.location.search)
const pokeName = parametros.get('pokeName')
const pokeId = parametros.get('pokeId')
const divContainer = document.getElementById("container")
const divSpeciesInfo = document.getElementById("speciesInfo")
const backColor = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
}

let pokeType = []

document.title = pokeName

renderTela()

async function renderTela() {
    const pokemonBasicInfo = await fetchInfos(`https://pokeapi.co/api/v2/pokemon/${pokeId}`)
    const pokemonSpeciesInfo = await fetchInfos(`https://pokeapi.co/api/v2/pokemon-species/${pokeId}`)
    const pokemonChainEvoInfo = await fetchInfos(pokemonSpeciesInfo.evolution_chain.url)
    const typesColor = pokemonBasicInfo.types[1] == undefined ? [backColor[pokemonBasicInfo.types[0].type.name], backColor[pokemonBasicInfo.types[0].type.name]] :
        [backColor[pokemonBasicInfo.types[0].type.name], backColor[pokemonBasicInfo.types[1].type.name]]
    
    let typeTagHTML = ""
    let evolutionChart = ""
    let abilitiesChart = ""
    
    if (typesColor[0] == typesColor[1]) {
        typeTagHTML = `
            <div class="typeDiv" style="grid-template-columns: 100%;"><p>${pokemonBasicInfo.types[0].type.name}</p></div>
        `
    } else {
        typeTagHTML = `
        <div class="typeDiv" style="grid-template-columns: 50% 50%;">
            <p>${pokemonBasicInfo.types[0].type.name}</p>
            <p>${pokemonBasicInfo.types[1].type.name}</p>
        </div>`
    }

    if (pokemonBasicInfo.abilities.length == 3){
        abilitiesChart = `
            <div id="normalAbility" class="dualAbility">
                <p>${pokemonBasicInfo.abilities[0].ability.name}</p>
                <p>${pokemonBasicInfo.abilities[1].ability.name}</p>
            </div>
            <div id="hiddenAbility">
                <p>${pokemonBasicInfo.abilities[2].ability.name}</p>
            </div>
        `
    } else {
        abilitiesChart = `
            <div id="normalAbility" class="singleAbility">
                <p>${pokemonBasicInfo.abilities[0].ability.name}</p>
            </div>
            <div id="hiddenAbility">
                <p style="border:none">Hidden: ${pokemonBasicInfo.abilities[1].ability.name}</p>
            </div>
        `
    }

    if (pokemonChainEvoInfo.chain.evolves_to[0] != null) {
        if (pokemonChainEvoInfo.chain.evolves_to[0].evolves_to[0] != null) {
            evolutionChart = `
                <div class="evolutions">
                    <p>${pokemonChainEvoInfo.chain.species.name}</p>
                    <img src="${await returnPokemonSprite(pokemonChainEvoInfo.chain.species.name)}">
                </div>
                <div class="evolutions">
                    <p>
                        ${(pokemonChainEvoInfo.chain.evolves_to[0].species.name).charAt(0).toUpperCase() + 
                        pokemonChainEvoInfo.chain.evolves_to[0].species.name.slice(1)}
                    </p>
                    <img src="${await returnPokemonSprite(pokemonChainEvoInfo.chain.evolves_to[0].species.name)}">
                </div>
                <div class="evolutions">
                    <p>
                        ${(pokemonChainEvoInfo.chain.evolves_to[0].evolves_to[0].species.name).charAt(0).toUpperCase() + 
                        pokemonChainEvoInfo.chain.evolves_to[0].evolves_to[0].species.name.slice(1)}
                    </p>
                    <img src="${await returnPokemonSprite(pokemonChainEvoInfo.chain.evolves_to[0].evolves_to[0].species.name)}">
                </div>`
        } else {
            evolutionChart = `
            <div class="evolutions">
                <p>${pokemonChainEvoInfo.chain.species.name}</p>
                <img src="${await returnPokemonSprite(pokemonChainEvoInfo.chain.species.name)}">
            </div>
            <div class="evolutions">
                <p>
                    ${(pokemonChainEvoInfo.chain.evolves_to[0].species.name).charAt(0).toUpperCase() + 
                    pokemonChainEvoInfo.chain.evolves_to[0].species.name.slice(1)}
                </p>
                <img src="${await returnPokemonSprite(pokemonChainEvoInfo.chain.evolves_to[0].species.name)}">
            </div>`
        }
    } else {
        evolutionChart = `
        <div class="evolutions">
            <p>${pokemonChainEvoInfo.chain.species.name}</p>
            <img src="${await returnPokemonSprite(pokemonChainEvoInfo.chain.species.name)}">
        </div>`
    }


    divContainer.innerHTML += `
        <div class="pokeSpace pokeInfo" style="background-color: rgba(211, 211, 211, 0.151);">
            <div class="infoDiv">
                <p>#${pokeId.padStart(3, 0)}</p>
                <p>${pokeName.charAt(0).toUpperCase() + pokeName.slice(1)}</p>
                ${typeTagHTML}
            </div>
        <img src="${pokemonBasicInfo.sprites.front_default}" alt="">
        </div>

        <div id="speciesInfo">
            <h2>Descrição</h2>
            <p>${pokemonSpeciesInfo.flavor_text_entries[1].flavor_text}</p>
            <div id="speciesSize">
                <p>Height: ${correctSize(pokemonBasicInfo.height)}</p>
                <p>Weight: ${correctWeight(pokemonBasicInfo.weight)}</p>
            </div>
        </div>

        <div id="divAbilities">
            <h2>Habilidades</h2>
            ${abilitiesChart}
        </div>

        <div id="evolutionChain">
            <h2>Evoluções</h2>
            <div id="evolutionCards">${evolutionChart}</div>
        </div>
    `



    configurarTela(typesColor)
    console.log(pokemonBasicInfo, pokemonSpeciesInfo, pokemonChainEvoInfo)
}

function configurarTela(typesColor) {
    var body = document.body
    body.style.background = `linear-gradient(to bottom right, ${typesColor[0]}, ${typesColor[1]})`
    body.style.height = '100vh'
    body.style.margin = '0'
    body.style.overflow = 'hidden'
}

function correctSize(height) {
    var altura = height.toString()
    altura = altura.slice(0, altura.length - 1) + "," + altura.slice(-1)
    altura = altura.padStart(3, 0) + "m"
    return altura
}

function correctWeight(weight) {
    var peso = weight.toString()
    peso = peso.slice(0, peso.length - 1) + "," + peso.slice(-1)
    peso = peso.padStart(3, 0) + "kg"
    return peso
}

async function fetchInfos(url) {
    const response = await fetch(url)
    const json = await response.json()
    return json
}

async function returnPokemonSprite(pokemon) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    const json = await response.json()
    console.log(json.sprites.front_default)
    return json.sprites.front_default
}