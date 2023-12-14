const parametros = new URLSearchParams(window.location.search)
const pokeName = parametros.get('pokeName')
const pokeId = parametros.get('pokeId')
const divContainer = document.getElementById("container")
const divSpeciesInfo = document.getElementById("speciesInfo")
const divEvolutionChain = document.getElementById("evolutionChain")
let pokeType = []

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

document.title = pokeName

renderTela()

async function renderTela() {
    const pokemonBasicInfo = await fetchInfos(`https://pokeapi.co/api/v2/pokemon/${pokeId}`)
    const pokemonSpeciesInfo = await fetchInfos(`https://pokeapi.co/api/v2/pokemon-species/${pokeId}`)
    const pokemonChainEvoInfo = await fetchInfos(pokemonSpeciesInfo.evolution_chain.url)
    let typeTagHTML = ""
    const typesColor = pokemonBasicInfo.types[1] == undefined ? [backColor[pokemonBasicInfo.types[0].type.name], backColor[pokemonBasicInfo.types[0].type.name]] :
        [backColor[pokemonBasicInfo.types[0].type.name], backColor[pokemonBasicInfo.types[1].type.name]]
    if (typesColor[0] == typesColor[1]) {
        typeTagHTML = `
            <div class="typeDiv" style="grid-template-columns: 100%;"><p>${pokemonBasicInfo.types[0].type.name}</p></div>
        `
    }
    else {
        typeTagHTML = `
        <div class="typeDiv" style="grid-template-columns: 50% 50%;">
            <p>${pokemonBasicInfo.types[0].type.name}</p>
            <p>${pokemonBasicInfo.types[1].type.name}</p>
        </div>
        `
    }


    divContainer.innerHTML += `
        <div class="pokeSpace pokeInfo" style="background-color: rgba(211, 211, 211, 0.151);">
            <div class="infoDiv">
                <p>#${pokeId.padStart(3, 0)}</p>
                <p>${pokeName.charAt(0).toUpperCase() + pokeName.slice(1)}</p>
            </div>
            ${typeTagHTML}
        <img src="${pokemonBasicInfo.sprites.front_default}" alt="">
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

async function fetchPokemon() {
    try {
        const response = await fetch(url)
        const json = await response.json()
        if (json.types[1] == null) {
            pokeType = [json.types[0].type.name, json.types[0].type.name]
            pokeTypeHTML = `
                <div class="typeDiv" style="
                grid-template-columns: 100%;">
                <p>${pokeType[0]}</p>
                </div>
            `
        } else {
            pokeType = [json.types[0].type.name, json.types[1].type.name]
            pokeTypeHTML = `
                <div class="typeDiv" style="
                grid-template-columns: 50% 50%;">
                    <p>${pokeType[0]}</p> <p>${pokeType[1]}</p>
                </div>
            `
        }


        await fetchSpecies()

        const divSpecieSize = document.getElementById("speciesSize")
        divSpecieSize.innerHTML += `
            <p>Height: ${correctSize(json.height)}</p>
            <p>Weight: ${correctWeight(json.weight)}</p>
        `
        const pokemonEvolutionChain = await fetchEvolutionChain(await returnEvolutionChain())


        if (pokemonEvolutionChain.chain.evolves_to.length != 0) {
            if (pokemonEvolutionChain.chain.evolves_to[0].evolves_to.length == 0) {
                divEvolutionChain.classList.add("evolucao1")
            }
            else {
                divEvolutionChain.classList.add("evolucao2")
            }
        }
        else {
            divEvolutionChain.classList.add("evolucao0")
        }

        divEvolutionChain.innerHTML += `
            <div>
            <div>
                <p>${pokemonEvolutionChain.chain.species.name}</p>
            </div>
            <div><p>${pokemonEvolutionChain.chain.species.name}</p></div>
            <div><p>${pokemonEvolutionChain.chain.species.name}</p></div></div>
        `

        const body = document.body
        body.style.background = `linear-gradient(to bottom right, ${backColor[pokeType[0]]}, ${backColor[pokeType[1]]})`
        body.style.height = '100vh'
        body.style.margin = '0'
        body.style.overflow = 'hidden'
    } catch (error) {
        console.error(error)
    }
}

async function fetchSpecies() {
    try {
        const response = await fetch(urlSpecies)
        const json = await response.json()

        divSpeciesInfo.innerHTML += `
            <h2>Descrição</h2>
            <p>${json.flavor_text_entries[17].flavor_text}</p>
            <div id="speciesSize"></div>
        `
    }
    catch (error) {
        console.error(error)
    }
}

async function fetchEvolutionChain(urlChain) {
    try {
        const response = await fetch(urlChain)
        const json = await response.json()
        return json
    }
    catch (error) {
        console.error(error)
    }
}

async function returnEvolutionChain() {
    const response = await fetch(urlSpecies)
    const json = await response.json()
    return json.evolution_chain.url
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