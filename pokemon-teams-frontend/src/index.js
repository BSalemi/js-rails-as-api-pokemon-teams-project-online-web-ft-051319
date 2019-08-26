const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const mainContainer = document.querySelector('main');


function fetchTrainers(){
    fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(trainers => renderTrainers(trainers))
};





function renderTrainers(trainers){
    trainers.forEach(trainer => {
        let pokemonTeams = trainer.pokemons.map(function(poke){
            return `<li>${poke.nickname} (${poke.species}) <button class="release" onClick=removePokemon(event) data-pokemon-id="${poke.id}">Release</button></li>`
        })
        mainContainer.innerHTML += `<div class="card" id="trainer-${trainer.id}"><p>${trainer.name}</p>
        <button onClick=addPokemon(event) data-trainer-id="${trainer.id}"> Add Pokemon </button>
        <ul>
         ${pokemonTeams.join("")}
        </ul>
        </div>`
       
      })   
}

function addPokemon(event){ 
    fetch(TRAINERS_URL + `/${event.target.dataset.trainerId}`)
    .then(function(response){
        return response.json();
    })
    .then(function(trainer){
        event.preventDefault(); 
        let formData = {
            trainer_id: trainer.id
        };
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        };
        fetch(POKEMONS_URL, configObj)
        .then(function(response) {
            return response.json();
        })
        .then(function(object) {
            if(!object.message){
                
                let trainerCard = document.getElementById(`trainer-${event.target.dataset.trainerId}`)
                let ul = trainerCard.querySelector('ul')
                let li = document.createElement('li')
                li.innerText = `${object.nickname} (${object.species})`; 
                li.innerHTML += `<button class="release" onClick=removePokemon(event) data-pokemon-id="${object.id}">Release</button>`
                ul.appendChild(li)
                console.log(object);
            }   
        })
    })   
}
  

function removePokemon(event){
    let pokemon = event.target.dataset.pokemonId
    let parent = event.target.parentElement
    let grandParent = parent.parentElement
    console.log(grandParent);
    console.log(parent);
    
    let pokemonPage = `${BASE_URL}/pokemons/${pokemon}`

    let formData = {
        pokemon_id: pokemon
    };
    let configObj = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(formData)
    };
    fetch(pokemonPage, configObj)
    .then(function(response) {
        grandParent.removeChild(parent)
    })
}


fetchTrainers()
