import React, { useState } from "react";
import './components/css/WeatherMain.css'
import { MainWindow } from './components/weather/WeatherMain'
import { PredictionCards} from "./components/weather/PredictionCards";
import { WeekPrediction } from "./components/weather/WeekPediction";

const App = () => {
  
  const [hourData, setHourData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  
  return (
    <>
      <MainWindow setHourData={setHourData} setWeekData={setWeekData} setHasSearched={setHasSearched} hasSearched={hasSearched}/>
      {hourData && hourData.length > 0 && (
        <PredictionCards hourData={hourData} />
      )}

      {/* Show week prediction only after weekData has items */}
      {weekData && weekData.length > 0 && (
        <WeekPrediction weekData={weekData} />
      )}
    </>
  );
};

export default App;