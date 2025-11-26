export const WeekPrediction = ({ weekData }) => {
  if (!Array.isArray(weekData) || weekData.length === 0) {
    return <div className="predictCard">No weekly data available.</div>;
  }

  const sixDays = weekData.slice(0, 6);

  return (
    <div className="weekCard">
        <h3>Weekly Forecast</h3>
      <div className="weeklyRow">
        {sixDays.map((day, idx) => {
          const temp = Math.round(day.temp ?? day.tempmax ?? 0);

          return (
            <div className="weekCards" key={idx}>
              <p className="day">{day.datetime}</p>
              <p className="tempHour">{temp}°C</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekPrediction;
