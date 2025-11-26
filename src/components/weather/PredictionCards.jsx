import React from "react";

const formatTime = (hour) => {
  if (!hour.datetime) return "N/A";

  const timeStr = hour.datetime.slice(0, 5);
  return timeStr;
};

export const PredictionCards = ({ hourData }) => {


  if (!Array.isArray(hourData) || hourData.length === 0) {
    return <div className="predictCard">No hourly data available.</div>;
  }

  const toShow = hourData;
    

  return (
    <div className="predictCard">
      <div className="hourlyRow" >
        {toShow.map((hour, idx) => {
          const timeString = formatTime(hour);
          const temp = Math.round(hour.temp ?? 0);
          const wind = Math.round(hour.windspeed ?? hour.wind ?? 0);
          const key = hour.datetimeEpoch ?? hour.datetime ?? idx;

          return (
            <div className="hourCards" key={key} >
              <p className="time">{timeString}</p>
              <p className="tempHour">{temp}°C</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PredictionCards;
