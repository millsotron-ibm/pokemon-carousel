import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then((response) => {
        const { results } = response.data;
        const pokemonPromises = results.map((pokemon) =>
          axios.get(pokemon.url)
        );
        Promise.all(pokemonPromises)
          .then((pokemonResponses) => {
            const pokemonDetails = pokemonResponses.map(
              (response) => response.data
            );
            setPokemonData(pokemonDetails);
          })
          .catch((error) => {
            console.error("Error fetching Pokémon data:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching Pokémon data:", error);
      });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <button className="carousel-nav">Previous</button>,
    nextArrow: <button className="carousel-nav">Next</button>,
  };

  const openPokemonPage = (name) => {
    const searchQuery = encodeURIComponent(`${name} Pokémon`);
    const googleSearchURL = `https://www.google.com/search?q=${searchQuery}`;
    window.open(googleSearchURL, "_blank");
  };

  return (
    <div className="App">
      <h1>Pokémon Carousel</h1>
      <Slider {...sliderSettings}>
        {pokemonData.map((pokemon) => (
          <div
            key={pokemon.id}
            onClick={() => openPokemonPage(pokemon.name)}
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
              alt={pokemon.name}
            />
            <p className="pokemon-name">{pokemon.name}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default App;
