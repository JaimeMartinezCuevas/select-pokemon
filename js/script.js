const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const prevBtn = document.getElementById('prevBtn');
const resenextBtntBtn = document.getElementById('nextBtn');

searchBtn.addEventListener('click', () => {searchPokemon();});

resetBtn.addEventListener('click', () => {
    app.innerHTML = '';
    getPokemon();
});



// Paginación de la pokedex
let currentPage = 1;

// Máximo de pokemon que se mostrarán por página. Sustituye a ?limit=10 en el fetch de getPokemon()
const maxPokemon = 10;

//Los botones para moverse entre páginas usan la variable current page para aumentar o disminuir el valor
prevBtn.addEventListener('click', () => {
    //Con el >1 nos aseguramos de que no se pase de rosca
    if (currentPage > 1) {
        currentPage--;
        getPokemon(currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    getPokemon(currentPage);
});


// Función para buscar el pokemon
const searchPokemon = async () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");

        if (!res.ok) {
            throw new Error("Ha habido un error al cargar la información del pokemon");
        }

        const catchPokemon = await res.json();

        // Filtrar la lista de Pokémon basándose en el nombre de búsqueda
        const filteredPokemonList = catchPokemon.results.filter(pokemon => pokemon.name.includes(searchInput));

        if (filteredPokemonList.length === 0) {
            app.innerHTML = "No se han encontrado pokémon con ese nombre";
        } else {

            // Llama a la función printPokemon para imprimir los nombres y las imágenes de los pokemon filtrados
            app.innerHTML = printPoke(filteredPokemonList);
        }
    } catch (error) {
        console.error(error);
        app.innerHTML = "Ha habido un error al cargar la información del pokemon";
    }
};

// Función para imprimir los pokemon en el HTML
const printPoke = async (pokemonList) => {

    //Se me generaba una entrada extraña de la pokedex que imprimía [object-promise] al buscar un pokemon
    //así que declaré una variable (entriesHTML) para que las entradas no se imprimieran directamente en el div app
    //según he estado investigando, ocurre porque el bucle for no es asíncrono. He intentado enmendarlo pero no he sido capaz del todo porque me generama otros errores en la consola
    //Parece que al encerrar los resultados en una variable lo maneja mejor y todo a la vez, pero bueno, si ye quien a afayase, yo me doy con un regodón en los dientes
    let entriesHTML = '';

    for (const poke of pokemonList) {
        try {
            const res = await fetch(poke.url);
            if (!res.ok) {
                throw new Error(`Hubo un error al cargar los datos de ${poke.name}`);
            }
            const pokemonData = await res.json();

            const imageUrl = pokemonData.sprites.other['official-artwork'].front_default;
            console.log(`Nombre: ${poke.name}, URL de la imagen: ${imageUrl}`);

            let tipos = pokemonData.types.map((type) => {
                return `<p class='${type.type.name} tipo'>${type.type.name}</p>`;
            });
            
            tipos = tipos.join('');
            console.log(`Nombre: ${poke.name}, tipos: ${tipos}`);


            // app.innerHTML +=
            entriesHTML += `
                <div class='entry'>
                    <img src="${imageUrl}" alt="Sprite pokemon"/>
                    <p>${poke.name}</p>
                    <div class='tipos'>${tipos}</div>
                </div>
            `;
        } catch (error) {
            console.error(error);
        }
    }

    // Actualizamos el contenido del elemento app después de construir todas las entradas
    app.innerHTML = entriesHTML;
};

const getPokemon = async (page) => {
    
    try {

        //he declarado una variable para cambiar la página y que se actualice según se mueven las páginas
        const cambioPagina = (page - 1) * maxPokemon;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}&offset=${cambioPagina}`);

        // const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");

        if (!res.ok) {
            throw new Error("Hubo un error al cargar los pokemon");
        }
        const catchPokemon = await res.json();
        console.log(catchPokemon)

        // Llama a la función printPokemon para imprimir los nombres y las imágenes de los pokemon
        printPoke(catchPokemon.results);

    } catch (error) {
        console.error(error);
        app.innerHTML = "Hubo un error al cargar los pokemon";
    }
};

//Encendemos el programa
getPokemon(currentPage);
