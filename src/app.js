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
    abilities: ['one'],
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

        const { genera } = pokemonSpeciesItem;
        let generaObj = genera.find(function (obj) { return obj.language.name === 'en'; });
        let genus = generaObj.genus;

        const { flavor_text_entries } = pokemonSpeciesItem;
        let flavorTextObj = flavor_text_entries.find(function (obj) { return obj.language.name === 'en'; });
        let flavor_text = flavorTextObj.flavor_text;

        const { habitat: {name: habitat}, color: {name: color}, shape: {name: shape}, growth_rate: {name: growth_rate}} = pokemonSpeciesItem;

        const { weight, height } = pokemonItem;

        const { stats } = pokemonItem;
        let statsSpeedObj = stats.find(function (obj) { return obj.stat.name === 'speed'; });
        let speed = statsSpeedObj.base_stat;
        let statsSpDefObj = stats.find(function (obj) { return obj.stat.name === 'special-defense'; });
        let sp_defense = statsSpDefObj.base_stat;
        let statsSpAttObj = stats.find(function (obj) { return obj.stat.name === 'special-attack'; });
        let sp_attack = statsSpAttObj.base_stat;
        let statsDefObj = stats.find(function (obj) { return obj.stat.name === 'defense'; });
        let defense = statsDefObj.base_stat;
        let statsAttObj = stats.find(function (obj) { return obj.stat.name === 'attack'; });
        let attack = statsAttObj.base_stat;
        let statsHPObj = stats.find(function (obj) { return obj.stat.name === 'hp'; });
        let hp = statsHPObj.base_stat;

        const { base_happiness, hatch_counter, gender_rate } = pokemonSpeciesItem;

        pikachu = {
            pokedex_number: pokemonItem.id,
            name: pokemonItem.name,
            description: { genus, habitat, flavor_text, weight, height, color, shape },
            base_exp: pokemonItem.base_experience,
            base_happiness,
            growth_rate,
            stats: { speed, sp_defense, sp_attack, defense, attack, hp },
            hatch_counter,
            gender_rate
        };

        const { abilities } = pokemonItem;
        pikachu.abilities = [];
        for (let {ability: {name: name}, slot: slot, is_hidden: hidden } of abilities) {
            pikachu.abilities.push({name, slot, hidden});
        }

        pikachu.description.sprite = pokemonItem.sprites.front_default;

        const { forms } = pokemonItem;
        pikachu.forms = [];
        for (let { name: name } of forms) {
            pikachu.forms.push(name);
        }

        const { types } = pokemonItem;
        pikachu.types = [];
        for (let {type: {name: name} } of types) {
            pikachu.types.push(name);
        }

        const { egg_groups } = pokemonSpeciesItem;
        pikachu.egg_groups = [];
        for (let { name: name } of egg_groups) {
            pikachu.egg_groups.push(name);
        }

        console.log('end');

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