import React, { useState } from "react";

export const MainWindow = ({ setHourData , setWeekData , setHasSearched}) => {
  const [text, setText] = useState();
  const [localWeatherData, setLocalWeatherData] = useState(false);

  const vcIcons = {
    Clear: "/animated/day.svg",
    Sunny: "/animated/day.svg",
    "Partially cloudy": "/animated/cloudy.svg",
    "Partly cloudy": "/animated/cloudy.svg",
    Cloudy: "/animated/cloudy.svg",
    Overcast: "/animated/cloudy.svg",

    Rain: "/animated/rainy-7.svg",
    Showers: "/animated/rainy-7.svg",
    "Rain, Overcast": "/animated/rainy-7.svg",

    Snow: "/animated/snowy-6.svg",
    "Snow, Overcast": "/animated/snowy-6.svg",

    Thunderstorm: "/animated/rainy-7.svg",
    Fog: "/animated/cloudy.svg",
    Mist: "/animated/cloudy.svg",
  };

  const search = async (e) => {
    try {
      const KEY = import.meta.env.VITE_VISUALCROSSING_KEY;

      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
        text
      )}?unitGroup=metric&key=${KEY}`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      const today = data.days?.[0] || {};

      const desc = today.conditions || "";
      const icon = vcIcons[desc] || "/animated/day.svg";

      const weatherInfo = {
        city: data.resolvedAddress || text,
        temperature: Math.round(today.temp ?? 0),
        feelslike: Math.round(today.feelslike ?? 0),
        description: desc,
        icon,
        uvindex: today.uvindex ?? "",
        humidity: today.humidity ?? "",
        visibility: today.visibility ?? "",
        wind: today.windspeed ?? "",
      };

      setLocalWeatherData(weatherInfo);

      const todayHours = Array.isArray(data.days?.[0]?.hours)? data.days[0].hours : [];
      const weekDays = data.days
      console.log("Weekdays: ", weekDays);

      setHourData(todayHours);
      setWeekData(weekDays);

    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  return (
    <>
      <div className="container">
        <div className="searchBar">
          <input
            type="string"
            placeholder="search.."
            onChange={(event) => setText(event.target.value)}
          />
          <button className="fa fa-search" type="search" onClick={search}>
            search
          </button>
        </div>
        {localWeatherData && (
        <div className="mainDiv">
          <div className="card1">
            <p className="date">Today</p>
            <h1 className="city">{localWeatherData.city}</h1>
            <img
              src={localWeatherData.icon}
              alt="icon"
              className="weatherIcon"
            />
            <h1 className="temp">{localWeatherData.temperature}°C</h1>
            <p className="description">{localWeatherData.description}</p>
          </div>
          <div className="card2">
            <p className="description">uv index: {localWeatherData.uvindex}</p>
            <p className="description">
              humidity: {localWeatherData.humidity} %
            </p>
            <p className="description">
              visiblility: {localWeatherData.visibility} mi
            </p>
            <p className="description">
              feelslike: {localWeatherData.feelslike}°C
            </p>
            <p className="description">wind: {localWeatherData.wind} mph</p>
          </div>
        </div>
)}
      </div>
    </>
  );
};
