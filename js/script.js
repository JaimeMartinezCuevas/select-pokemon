
const pokemonSelect = document.getElementById("pokemon-select");
const getPokemon = document.getElementById("get-pokemon");

let callPokemon = () => {
    const selectedPokemon = pokemonSelect.value;

    fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener datos del Pokémon');
            }
            return response.json();
        })
        .then((data) => {
            getPokemon.innerHTML = '';
            const pokemonInfo = document.createElement('div');

            pokemonInfo.innerHTML = `
                <img src="${data.sprites.front_default}" alt="${data.name}"/>
                <p>Nombre: <span>${data.name}</span></p>
                <p>Tipo: <span>${data.types.map(type => type.type.name).join(', ')}</span></p>
                <p>Altura: <span>${data.height}</span></p>
                <p>Peso: <span>${data.weight}</span></p>
            `;

            getPokemon.appendChild(pokemonInfo);
        })
        .catch((error) => {
            console.error('Error:', error.message);
        });
};

pokemonSelect.addEventListener('change', () => {
    callPokemon();
});

getPokemon.addEventListener('click', () => {
    callPokemon();
});