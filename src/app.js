'use strict';

var express = require('express');
var request = require('request');
var Promise = require('promise');

var app = express();

const PORT = process.env.PORT || 3000;

const pikachu = {
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
    var urlP = 'https://pokeapi.co/api/v2/pokemon/' + req.params.name + '/';
    var urlPS = 'https://pokeapi.co/api/v2/pokemon-species/' + req.params.name + '/';

    var initializePromiseOne = initialize(urlP);
    var initializePromiseTwo = initialize(urlPS);

    Promise.all([
        initializePromiseOne,
        initializePromiseTwo
    ]).then(function(results) {
        console.log('===' + results[0].weight);
        console.log('+++' + results[1].id);
        pikachu.description.weight = results[0].weight;
        pikachu.description.height = results[0].height;
        pikachu.description.sprite = results[0].sprites.front_default;
        pikachu.forms = [];
        pikachu.forms.push(results[0].forms[0].name);
        pikachu.base_exp = results[0].base_experience;

        pikachu.pokedex_number = results[1].id;
        res.send(pikachu);
    });
});

function initialize(url) {
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