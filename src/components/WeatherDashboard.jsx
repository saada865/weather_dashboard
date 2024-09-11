// Imports
import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherCard from "./WeatherCard";

const WeatherDashboard = () => {
  // List of cities
  const [cities, setCities] = useState([]);
  // Input field
  const [cityInput, setCityInput] = useState("");
  // Suggestions
  const [suggestions, setSuggestions] = useState([]);

  // API Keys from .env
  const weatherApiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const geoDbApiKey = process.env.REACT_APP_GEODB_API_KEY;

  // Default cities
  const defaultCities = ["New York", "London", "Lahore"];

  // Loading the default citiess
  useEffect(() => {
    fetchDefaultCities();
  }, []);

  const fetchDefaultCities = async () => {
    const defaultCityData = await Promise.all(
      defaultCities.map(async (city) => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
          );
          return response.data;
        } catch (err) {
          console.error(`Error while fetching default city data: `, err);
          return null;
        }
      })
    );
    setCities(defaultCityData);
  };

  // Loads a new city
  const addCity = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
      );
      setCities([...cities, response.data]);
    } catch (err) {
      console.error("Error while fetching weather data:", err);
    }
  };

  // Removes City from list by checking if the index matches the index of the city to be removed
  const removeCity = (index) => {
    const updatedCities = cities.filter((_, i) => i !== index);
    setCities(updatedCities);
  };

  // Handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityInput) {
      addCity(cityInput);
      setCityInput("");
      setSuggestions([]);
    }
  };

  // Hanelds a change in the input fields and loads suggestions
  const handleInputChange = async (e) => {
    setCityInput(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await axios.get(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${e.target.value}`,
          {
            headers: {
              "X-RapidAPI-Key": geoDbApiKey,
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );
        setSuggestions(response.data.data);
      } catch (err) {
        console.error("Error fetching city suggestions:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-blue-50 rounded-lg shadom-md">
      <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center border-b-2 border-blue-200 pb-2">
        Weather Dashboard
      </h1>
      <form
        onSubmit={handleSubmit}
        className="mb-6 flex justify-center items-center bg-white shadow-lg rounded-lg p-4 border border-gray-300"
      >
        <input
          type="text"
          value={cityInput}
          onChange={handleInputChange}
          placeholder="Enter City Name"
          list="city-suggestions"
          className="border border-gray-300 p-3 rounded-lg shadow-md mr-2 "
        />
        <datalist id="city-suggestions">
          {suggestions.map((suggestion) => (
            <option key={suggestion.id} value={suggestion.name} />
          ))}
        </datalist>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          {" "}
          Add City{" "}
        </button>
      </form>
      <div className="flex flex-wrap justify-center gap-4">
        {cities.map((city, index) => (
          <WeatherCard
            key={index}
            city={city}
            onRemove={() => removeCity(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherDashboard;
