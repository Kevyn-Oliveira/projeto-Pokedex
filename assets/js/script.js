const url = "https://pokeapi.co/api/v2/pokemon/"
let divContainer = document.getElementById("container")
divContainer.innerHTML = ""
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

async function fetchPokemon(i) {
    try {
        const response = await fetch(url + i);
        const json = await response.json();
        var pokeName = json.name
        var pokeId = json.id.toString()
        var pokeType = []
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

        console.log(pokeType)
        divContainer.innerHTML += `
            <div class="pokeSpace" style="background: linear-gradient(to bottom right, ${backColor[pokeType[0]]}, ${backColor[pokeType[1]]})">
            <div class="infoDiv">
                <p>#${pokeId.padStart(3, 0)}</p>
                <p>${pokeName.charAt(0).toUpperCase() + pokeName.slice(1)}</p>
                ${pokeTypeHTML}
            </div>
            <img src="${json.sprites.front_default}" alt="">
            </div>
        `;
    } catch (error) {
        console.error(error);
    }
}

async function fetchAllPokemon() {
    for (let i = 0; i <= 151; i++) {
        await fetchPokemon(i);
    }
}

fetchAllPokemon();