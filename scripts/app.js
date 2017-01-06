import React from 'react';
import { render } from 'react-dom';

var minhaDiv = document.getElementById('app');

var PokeService = {
	API: {
		url: '//pokeapi.co/api/v1/',
		get: (url)=>{
			return fetch(`${PokeService.API.url}${url}`)
				.then(response => response.json())
		},
		Pokemon: {
			listAll: ()=>{
				return PokeService.API.get('pokedex/1')
				.then((response) => {
					return response.pokemon
					.filter(pokemon => PokeService.getNumberFromUrl(pokemon.resource_uri) < 1000)
					.sort((a,b)=> {
						var aNumber = PokeService.getNumberFromUrl(a.resource_uri),
							bNumber = PokeService.getNumberFromUrl(b.resource_uri);

						return (aNumber > bNumber ? 1 : -1);
					});
				});
			}
		}
	},
	getNumberFromUrl: (url, isString) => {
		var number = parseInt(url.replace(/.*\/(\d*)\/$/,'$1'));
		return (isString ? ("000" + number).slice(-3) : number);
	}
}


class PokerDex extends React.Component {

	state = {
		pokemonList: [],
		nameFilter: ""
	}


	componentDidMount = () => {
		PokeService.API.Pokemon.listAll().then((pokemonList) => {
			this.setState({pokemonList});
		});
	}

	setFilter = () => {
		var nameFilter = this.refs.pokeFilter.value;
		this.setState({nameFilter});
	}

	render() {
		var state = this.state;

		return(
			<div>
				<input onChange={this.setFilter} type="text" id="poke-filter" ref="pokeFilter" placeholder="Search" />

				<ul className="poke-list">
					{
						state.pokemonList
						.filter((pokemon)=>{
							return pokemon.name.indexOf(state.nameFilter.toLowerCase()) !== 1;
						})
						.map((pokemon, index)=>{
							var pokeNumber = PokeService.getNumberFromUrl(pokemon.resource_uri, true);
							return(
								<li className="poke-list-item" key={index}>
									<img src={"//serebii.net/pokedex-xy/icon/"+pokeNumber+".png"} />
									<span> {pokeNumber} - {pokemon.name}</span>
								</li>
							);
						})
					}
				</ul>
			</div>
		);
	}
}


render(
	<PokerDex />, 
	minhaDiv
);