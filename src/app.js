'use strict';

var express = require('express');
var request = require('request');

var app = express();

const PORT = process.env.PORT || 3000;

function getPokemon(url, getPokemonHandler) {
    request(url, function (error, response, body) {
        var result;
        if (error) {
            result = error;
        } else if (response.statusCode === 200) {
            result = JSON.parse(body, function(key, value) {
                if (key === 'url') {
                    return undefined;
                }
                return value;
            });
        } else {
            result = response.statusMessage;
        }
        getPokemonHandler(result);
    });
}

app.get('/pokemon/:name', function(req, res) {
    var url = 'https://pokeapi.co/api/v2/pokemon/' + req.params.name + '/';
    getPokemon(url, function(result) {
        res.send(result);
    });
});

app.listen(PORT, function() {
    console.log(`Server started on: ${PORT}`);
});