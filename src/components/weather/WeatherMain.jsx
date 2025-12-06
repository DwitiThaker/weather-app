import React, { useState } from "react";

export const MainWindow = ({ setHourData, setWeekData, setHasSearched }) => {
  const [text, setText] = useState("");
  const [localWeatherData, setLocalWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const vcIcons = {
    clear: "/animated/day.svg",
    sunny: "/animated/day.svg",
    "partially cloudy": "/animated/cloudy.svg",
    "partly cloudy": "/animated/cloudy.svg",
    cloudy: "/animated/cloudy.svg",
    overcast: "/animated/cloudy.svg",
    rain: "/animated/rainy-7.svg",
    showers: "/animated/rainy-7.svg",
    snow: "/animated/snowy-6.svg",
    thunderstorm: "/animated/rainy-7.svg",
    fog: "/animated/cloudy.svg",
    mist: "/animated/cloudy.svg",
  };

  const findIcon = (desc = "") => {
    const key = (desc || "").toLowerCase();
    if (vcIcons[key]) return vcIcons[key];
    // try substring matching
    for (const k of Object.keys(vcIcons)) {
      if (key.includes(k)) return vcIcons[k];
    }
    // fallback
    return "/animated/day.svg";
  };

  const search = async () => {
    setError(null);

    const location = (text || "").trim();
    if (!location) {
      setError("Please enter a location.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/.netlify/functions/weather?location=${encodeURIComponent(location)}`);
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Server error: ${response.status} ${txt}`);
      }
      const data = await response.json();
      console.log("Visual Crossing data:", data);

      const today = data.days?.[0] || {};
      const desc = today.conditions || "";
      const icon = findIcon(desc);

      const weatherInfo = {
        city: data.resolvedAddress || location,
        temperature: Math.round(today.temp ?? 0),
        feelslike: Math.round(today.feelslike ?? 0),
        description: desc,
        icon,
        uvindex: today.uvindex ?? "",
        humidity: today.humidity ?? "",
        // NOTE: VisualCrossing with unitGroup=metric returns visibility in km and wind in km/h
        visibility: today.visibility ?? "",
        wind: today.windspeed ?? "",
      };

      setLocalWeatherData(weatherInfo);

      const todayHours = Array.isArray(data.days?.[0]?.hours) ? data.days[0].hours : [];
      const weekDays = Array.isArray(data.days) ? data.days : [];

      setHourData(todayHours);
      setWeekData(weekDays);

      // optional: notify parent that a search happened
      if (typeof setHasSearched === "function") setHasSearched(true);
    } catch (err) {
      console.error("An error occurred:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search location..."
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") search(); }}
          aria-label="Search location"
        />
        <button
          className="fa fa-search"
          type="button"
          onClick={search}
          disabled={loading}
          aria-label="Search"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {localWeatherData && (
        <div className="mainDiv">
          <div className="card1">
            <p className="date">Today</p>
            <h1 className="city">{localWeatherData.city}</h1>
            <img src={localWeatherData.icon} alt={localWeatherData.description || "weather icon"} className="weatherIcon" />
            <h1 className="temp">{localWeatherData.temperature}°C</h1>
            <p className="description">{localWeatherData.description}</p>
          </div>

          <div className="card2">
            <p className="description">UV index: {localWeatherData.uvindex}</p>
            <p className="description">Humidity: {localWeatherData.humidity} %</p>
            <p className="description">Visibility: {localWeatherData.visibility} km</p>
            <p className="description">Feels like: {localWeatherData.feelslike}°C</p>
            <p className="description">Wind: {localWeatherData.wind} km/h</p>
          </div>
        </div>
      )}
    </div>
  );
};
