import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemonData, setFilteredPokemonData] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=50")
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

  useEffect(() => {
    if (selectedType === "") {
      setFilteredPokemonData(pokemonData);
    } else {
      const filteredPokemon = pokemonData.filter((pokemon) =>
        pokemon.types.some((type) => type.type.name === selectedType)
      );
      setFilteredPokemonData(filteredPokemon);
    }
  }, [selectedType, pokemonData]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 3,
    stopOnHover: false,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: <button className="carousel-nav">Previous</button>,
    nextArrow: <button className="carousel-nav">Next</button>,
  };

  const openPokemonPage = (name) => {
    const searchQuery = encodeURIComponent(`${name} Pokémon`);
    const googleSearchURL = `https://www.google.com/search?q=${searchQuery}`;
    window.open(googleSearchURL, "_blank");
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div className="App">
      <h1>Pokémon Carousel</h1>
      <div className="type-selector">
        <label htmlFor="type-select">Select Pokémon Type:</label>
        <select id="type-select" value={selectedType} onChange={handleTypeChange}>
          <option value="">All</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
          {/* Add more Pokémon types as needed */}
        </select>
      </div>
      <Slider {...sliderSettings}>
        {filteredPokemonData.map((pokemon) => (
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
