
class PokemonsController < ApplicationController

    def index 
        pokemons = Pokemon.all 
        render json: pokemons.to_json(:include => {
            :trainer => {:only => [:name]},
        }, :except => [:created_at, :updated_at])
    end 

    def show
        pokemon = Pokemon.find_by(id: params[:id])
        if pokemon
            render json: pokemon.to_json(:include => {
                :trainer => {:only => [:name]},
            }, :except => [:created_at, :updated_at])
        else 
            render json: { message: "No Pokemon was found" }
        end 
    end 

    def create 
        pkmn_trainer = Trainer.find_by(id: params[:trainer_id])
        if pkmn_trainer.pokemons.length < 6
            nickname = Faker::Name.first_name
            species = Faker::Games::Pokemon.name; 
            pokemon = Pokemon.create(nickname: nickname, species: species, trainer_id: params[:trainer_id])
            render json: pokemon
        else 
            render json: { message: "Team already full"}
        end 
    end 

    def destroy 
        pkmn = Pokemon.find_by(id: params[:id])
        pkmn.destroy
    end 

end
