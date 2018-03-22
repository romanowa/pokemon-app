'use strict';

var express = require('express');
var request = require('request');
var Promise = require('promise');

var app = express();

const PORT = process.env.PORT || 3000;

var pikachu = {
    pokedex_number: 0,
    name: '',
    description: {
        genus: '',
        habitat: '',
        flavor_text: '',
        weight: 0,
        height: 0,
        color: '',
        shape: '',
        sprite: ''
    },
    forms: [],
    types: [],
    base_happiness: 0,
    growth_rate: '',
    stats: {
        speed: 0,
        sp_defense: 0,
        sp_attack: 0,
        defense: 0,
        attack: 0,
        hp: 0
    },
    base_exp: 0,
    ev_gain: {
        speed: 0
    },
    egg_groups: [],
    hatch_counter: 0,
    gender_rate: 0,
    abilities: [
        { name: '', slot: 0, hidden: true },
        { name: '', slot: 0, hidden: false },
    ],
    moves: [
        { name: '', method: '', level: 0 },
        { name: '', method: '', level: 0 },
        { name: '', method: '', level: 1 },
        { name: '', method: '', level: 0 },
        // ...
    ],
    held_items: [
        { name: '', rarity: 0 },
        { name: '', rarity: 0 }
    ]
};

app.get('/pokemon/:name', function(req, res) {
    var urlPokemonAPI = 'https://pokeapi.co/api/v2/pokemon/' + req.params.name + '/';
    var urlPokemonSpeciesAPI = 'https://pokeapi.co/api/v2/pokemon-species/' + req.params.name + '/';

    Promise.all([
        requestData(urlPokemonAPI),
        requestData(urlPokemonSpeciesAPI)
    ]).then(function(results) {
        const pokemonItem = results[0];
        const pokemonSpeciesItem = results[1];
        console.log('start');

        pikachu.name = pokemonItem.name;

        const { genera } = pokemonSpeciesItem;
        let generaObj = genera.find(function (obj) { return obj.language.name === 'en'; });
        let genus = generaObj.genus;

        const { habitat: {name: habitat}, color: {name: color}, shape: {name: shape}} = pokemonSpeciesItem;

        const { weight, height } = pokemonItem;
        pikachu = {
            description: { genus, habitat, weight, height, color, shape }
        };
        pikachu.pokedex_number = pokemonItem.id;

        console.log('end');

        pikachu.description.sprite = pokemonItem.sprites.front_default;
        pikachu.forms = [];
        pikachu.forms.push(pokemonItem.forms[0].name);
        pikachu.base_exp = pokemonItem.base_experience;

        res.send(pikachu);
    });
});

function requestData(url) {
    return new Promise(function(resolve, reject) {
        request.get(url, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
}

app.listen(PORT, function() {
    console.log(`Server started on: ${PORT}`);
});