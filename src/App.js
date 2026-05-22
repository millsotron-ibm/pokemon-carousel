import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemonData, setFilteredPokemonData] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [cardTransforms, setCardTransforms] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=151")
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
      // Default to showing only normal type Pokemon on initial load
      const normalPokemon = pokemonData.filter((pokemon) =>
        pokemon.types.some((type) => type.type.name === "normal")
      );
      setFilteredPokemonData(normalPokemon.length > 0 ? normalPokemon : pokemonData);
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
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "60px",
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "40px",
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        }
      }
    ]
  };

  const openPokemonPage = (name) => {
    const searchQuery = encodeURIComponent(`${name} Pokémon`);
    const googleSearchURL = `https://www.google.com/search?q=${searchQuery}`;
    window.open(googleSearchURL, "_blank");
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const getTypeColor = (type) => {
    const typeColors = {
      fire: "#FF6B6B",
      water: "#4ECDC4",
      grass: "#95E1D3",
      electric: "#FFE66D",
      psychic: "#DDA0DD",
      ice: "#A8E6CF",
      dragon: "#8860D0",
      dark: "#5A5A5A",
      fairy: "#FFB3D9",
      normal: "#C8C8C8",
      fighting: "#D4A574",
      flying: "#A8C8E1",
      poison: "#B565D8",
      ground: "#D4A574",
      rock: "#B8A68A",
      bug: "#A8D08D",
      ghost: "#8860D0",
      steel: "#B8B8D0",
    };
    return typeColors[type] || "#A8A8A8";
  };

  const isLegendary = (pokemon) => {
    // Legendary Pokémon IDs from Gen 1
    const legendaryIds = [144, 145, 146, 150, 151]; // Articuno, Zapdos, Moltres, Mewtwo, Mew
    return legendaryIds.includes(pokemon.id);
  };

  const getGeneration = (pokemonId) => {
    if (pokemonId <= 151) return "I";
    if (pokemonId <= 251) return "II";
    if (pokemonId <= 386) return "III";
    if (pokemonId <= 493) return "IV";
    if (pokemonId <= 649) return "V";
    if (pokemonId <= 721) return "VI";
    if (pokemonId <= 809) return "VII";
    return "VIII";
  };

  const handleMouseMove = (e, pokemonId) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    setCardTransforms(prev => ({
      ...prev,
      [pokemonId]: {
        rotateX,
        rotateY,
        glareX,
        glareY
      }
    }));
  };

  const handleMouseLeave = (pokemonId) => {
    setCardTransforms(prev => ({
      ...prev,
      [pokemonId]: {
        rotateX: 0,
        rotateY: 0,
        glareX: 50,
        glareY: 50
      }
    }));
  };

  return (
    <div className="App">
      <div className="header-container">
        <h1 className="main-title">
          <span className="title-poke">Poké</span>
          <span className="title-dex">dex</span>
        </h1>
        <p className="subtitle">Gotta catch 'em all!</p>
      </div>

      <div className="type-selector-container">
        <label htmlFor="type-select" className="type-label">
          <span className="label-icon">🎮</span> Filter by Type
        </label>
        <select
          id="type-select"
          className="type-select"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option value="">All Types</option>
          <option value="fire">🔥 Fire</option>
          <option value="water">💧 Water</option>
          <option value="grass">🌿 Grass</option>
          <option value="electric">⚡ Electric</option>
          <option value="psychic">🔮 Psychic</option>
          <option value="ice">❄️ Ice</option>
          <option value="dragon">🐉 Dragon</option>
          <option value="dark">🌙 Dark</option>
          <option value="fairy">✨ Fairy</option>
          <option value="normal">⭐ Normal</option>
        </select>
      </div>

      <div className="carousel-container">
        <Slider {...sliderSettings}>
          {filteredPokemonData.map((pokemon) => {
            const transform = cardTransforms[pokemon.id] || { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };
            return (
              <div key={pokemon.id} className="slide-wrapper">
                <div
                  className="pokemon-card"
                  onClick={() => openPokemonPage(pokemon.name)}
                  onMouseMove={(e) => handleMouseMove(e, pokemon.id)}
                  onMouseLeave={() => handleMouseLeave(pokemon.id)}
                  style={{
                    transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(1, 1, 1)`,
                  }}
                >
                  <div className="card-inner">
                    <div
                      className="holographic-foil"
                      style={{
                        background: `
                          radial-gradient(
                            circle at ${transform.glareX}% ${transform.glareY}%,
                            rgba(255, 255, 255, 0.8) 0%,
                            rgba(255, 200, 255, 0.4) 20%,
                            rgba(200, 255, 255, 0.4) 40%,
                            rgba(255, 255, 200, 0.4) 60%,
                            rgba(255, 200, 200, 0.4) 80%,
                            transparent 100%
                          )
                        `
                      }}
                    ></div>
                    <div className="card-sparkles">
                      <div className="sparkle sparkle-1"></div>
                      <div className="sparkle sparkle-2"></div>
                      <div className="sparkle sparkle-3"></div>
                      <div className="sparkle sparkle-4"></div>
                      <div className="sparkle sparkle-5"></div>
                    </div>
                    <div
                      className="type-aura"
                      style={{
                        boxShadow: `0 0 40px ${getTypeColor(pokemon.types[0].type.name)}80, inset 0 0 20px ${getTypeColor(pokemon.types[0].type.name)}40`
                      }}
                    ></div>
                    <div className="card-shine"></div>
                    <div className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</div>
                    <div className="pokemon-image-container">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                        alt={pokemon.name}
                        className="pokemon-image"
                      />
                    </div>
                    <div className="pokemon-header">
                      <h3 className="pokemon-name">{pokemon.name}</h3>
                      <div className="pokemon-badges">
                        <span className="gen-badge">Gen {getGeneration(pokemon.id)}</span>
                        {isLegendary(pokemon) && <span className="legendary-badge">⭐ Legendary</span>}
                      </div>
                    </div>

                    <div className="pokemon-types">
                      {pokemon.types.map((type, index) => (
                        <span
                          key={index}
                          className="type-badge"
                          style={{ backgroundColor: getTypeColor(type.type.name) }}
                        >
                          {type.type.name}
                        </span>
                      ))}
                    </div>

                    <div className="pokemon-info">
                      <div className="info-row">
                        <span className="info-label">Height:</span>
                        <span className="info-value">{(pokemon.height / 10).toFixed(1)}m</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Weight:</span>
                        <span className="info-value">{(pokemon.weight / 10).toFixed(1)}kg</span>
                      </div>
                    </div>

                    <div className="pokemon-abilities">
                      <div className="abilities-label">Abilities:</div>
                      <div className="abilities-list">
                        {pokemon.abilities.slice(0, 2).map((ability, index) => (
                          <span key={index} className="ability-badge">
                            {ability.ability.name.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pokemon-stats-detailed">
                      {pokemon.stats.map((stat, index) => (
                        <div key={index} className="stat-bar-container">
                          <div className="stat-bar-header">
                            <span className="stat-bar-label">{stat.stat.name.toUpperCase()}</span>
                            <span className="stat-bar-value">{stat.base_stat}</span>
                          </div>
                          <div className="stat-bar-bg">
                            <div
                              className="stat-bar-fill"
                              style={{
                                width: `${(stat.base_stat / 255) * 100}%`,
                                backgroundColor: stat.base_stat > 100 ? '#4CAF50' : stat.base_stat > 60 ? '#FFC107' : '#FF5722'
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>

      <div className="footer">
        <p>Click any Pokémon card to learn more!</p>
      </div>
    </div>
  );
}

export default App;
