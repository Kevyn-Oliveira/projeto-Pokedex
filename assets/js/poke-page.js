const parametros = new URLSearchParams(window.location.search)
const pokeName = parametros.get('pokeName')
const pokeId = parametros.get('pokeId')
const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`
const divContainer = document.getElementById("container")
let pokeType = []
console.log(pokeName)

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

fetchPokemon()

async function fetchPokemon() {
    try {
        const response = await fetch(url);
        const json = await response.json();
        var pokeTypeHTML = ""
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

        divContainer.innerHTML += `
            <div class="pokeSpace pokeInfo" style="background-color: rgba(211, 211, 211, 0.151);">
                <div class="infoDiv">
                    <p>#${pokeId.padStart(3, 0)}</p>
                    <p>${pokeName.charAt(0).toUpperCase() + pokeName.slice(1)}</p>
                    ${pokeTypeHTML}
                </div>
            <img src="${json.sprites.front_default}" alt="">
            </div>
        `;

        const body = document.body
        body.style.background = `linear-gradient(to bottom right, ${backColor[pokeType[0]]}, ${backColor[pokeType[1]]})`
        body.style.height = '100vh';
        body.style.margin = '0';
        body.style.overflow = 'hidden';
    } catch (error) {
        console.error(error);
    }
}