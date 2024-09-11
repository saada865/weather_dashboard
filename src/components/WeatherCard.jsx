// Import
import React from "react";

const WeatherCard = ({ city, onRemove }) => {
  return (
    <div className="border bg-blue-200 p-4 m-2 rounded shadow-md w-64 text-center hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold text-blue-800">{city.name}</h2>
      <p className="text-gray-700 text-lg mb-2 capitalize">
        {city.weather[0].description}
      </p>
      <p className="text-2xl font-bold text-gray-900 mb-4">
        {city.main.temp} C
      </p>
      <img
        src={`http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
        alt={city.weather[0].description}
        className="mx-auto mb-4 w-16 h-16"
      />
      <button
        onClick={onRemove}
        className="bg-red-500 text0white p-2 mt-4 rounded hover:bg-red-700 transition-colors"
      >
        Remove
      </button>
    </div>
  );
};

export default WeatherCard;
