import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
async function fetchWeather(inputData: string) {
      const KEY = "51bfc3486f914f95b87112734260102";
      const loader = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${inputData}&aqi=yes&days=4`);
      const dataJSON = await loader.json();
      return dataJSON;
}
function getDayName(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function updateBackground(code: number, isDay: number) {
    const root = document.documentElement;

    let colors = {
        c1: "#764ba2", c2: "#667eea", c3: "#311b92", c4: "#4facfe" // Default
    };

    if (isDay === 0) {
        colors = { c1: "#0f0c29", c2: "#302b63", c3: "#24243e", c4: "#000000" }; // Night
    } else if (code === 1000) {
        colors = { c1: "#f7b733", c2: "#fc4a1a", c3: "#f6d365", c4: "#fda085" }; // Sunny
    } else if (code <= 1030) {
        colors = { c1: "#bdc3c7", c2: "#2c3e50", c3: "#757f9a", c4: "#d7dde8" }; // Cloudy
    } else {
        colors = { c1: "#4b6cb7", c2: "#182848", c3: "#3a1c71", c4: "#d76d77" }; // Rainy
    }

    // Apply the colors to the CSS variables
    root.style.setProperty('--bg-c1', colors.c1);
    root.style.setProperty('--bg-c2', colors.c2);
    root.style.setProperty('--bg-c3', colors.c3);
    root.style.setProperty('--bg-c4', colors.c4);
}

type airQualityType = {
  label: string;
}
type Status = "idle" | "loading" | "success" | "error";
const EPA_LEVELS = {
  1: { label: "Good" },
  2: { label: "Moderate" },
  3: { label: "Unhealthy for Sensitive Groups"},
  4: { label: "Unhealthy" },
  5: { label: "Very Unhealthy" },
  6: { label: "Hazardous" }
} as const;
const AIR_ADVICE = {
  1: "Perfect for outdoor activities",
  2: "Sensitive people should be cautious",
  3: "Limit long outdoor exposure",
  4: "Avoid outdoor activities",
  5: "Health warnings for everyone",
  6: "Stay indoors if possible"
};
type forecastData = Awaited<ReturnType<typeof fetchWeather>>;
export default function App() {
  const switchRef = useRef<HTMLInputElement>(null);
  const [inputData, setInputData] = useState<string>("");
  const [data, setData] = useState<forecastData | null>(null);
  const [airQuality, setAirQuality] = useState<airQualityType | null>(null);
  const [airAdvice, setAirAdvice] = useState<string | null>(null);
  const [forecast, setForecast] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  function handleSwitchClick() {
    if (switchRef.current?.checked) {
      switchRef.current?.click();
      setForecast(false)
    } else {
      switchRef.current?.click();
      setForecast(true);
    }
  }
  async function searchData() {
    setStatus("loading");
    const newData = await fetchWeather(inputData);
    setData(newData);
    updateBackground(newData?.current?.condition?.code, newData?.current?.is_day);
    console.log(data);
    const epaIndex = newData?.current?.air_quality["us-epa-index"] as 1 | 2 | 3 | 4 | 5 | 6;
    setAirQuality(EPA_LEVELS[epaIndex]);
    setAirAdvice(AIR_ADVICE[epaIndex]);
    if ("error" in newData) {
      console.log("Not Found");
      setStatus("error");
      setError("Location not found");
      switchRef.current?.focus();
    } else {
      setStatus("success");
      setError(null);
    }
  }
  if (status === "loading") {
    return (
      <main>
        <div className="flex flex-col h-screen px-4 py-6 transition-all">
          <p className="text-white top-0 text-center">Boudi For Weather</p>
          <p className="text-white text-center text-xl font-medium text-shadow-lg mt-4">Hello, Enter the name of your country or city to Start</p>
          <div className="p-4 flex justify-center gap-4 min-h-135 items-center bg-surface rounded-2xl shadow-card backdrop-blur-xl mt-6 transition-all">
            <div className="w-8 h-8 rounded-full border-4 animate-spin border-surface border-t-white" />
            <p className="text-white font-semibold">Searching country...</p>
          </div>
        </div>
      </main>
    )
  }
  return (
      <main>
        <div className="flex flex-col h-screen px-4 py-6 transition-all">
          <p className="text-white top-0 text-center">Boudi For Weather</p>
          <p className="text-white text-center text-xl font-medium text-shadow-lg mt-4">Hello, Enter the name of your country or city to Start</p>
          <div className="p-4 flex flex-col justify-center min-h-135 items-center bg-surface rounded-2xl shadow-card backdrop-blur-xl mt-6 transition-all">
            <div className="flex items-center justify-center gap-2.5 mb-5">
              <p className="text-white font-semibold">Forecast For 3 Days</p>
              <div className="relative w-12 h-6.5">
                <input ref={switchRef} type="checkbox" id="unitToggle" className="hidden z-9 peer checked:bg-green-500"/>
                <span className="slider peer-checked:bg-green-500 peer-checked:before:translate-x-5" onClick={handleSwitchClick}></span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 mb-6">
                <input type="text" value={inputData} onChange={(e) => setInputData(e.currentTarget.value)} placeholder="Enter city name"
                  className="bg-white/25 rounded-semiCard pl-3 pr-4 py-3 shadow-inner text-medium max-w-62.5 w-full h-12.5 placeholder:text-white/75 transition-shadow outline-none text-white focus:shadow-inner-focus"
                />
                <button onClick={searchData} className="cursor-pointer flex items-center justify-center text-sm font-bold px-5 py-3 rounded-semiCard bg-linear-135 from-white to-50% to-[#EDEDED] shadow-sm transition-all hover:shadow-focus hover:scale-105 active:scale-95">
                  Search
                </button>
            </div>
            <div className={`text-red-500 text-sm font-semibold flex flex-col items-center justify-center ${error ? "block" : "hidden"}`}>
                <p>🤔 Hmm… that place doesn’t seem to exist...</p>
                <p>Try searching for a city instead, or add the country code</p>
                <p>(for example: Paris, FR)</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 mb-6">
              <p className="text-2xl font-semibold text-center text-white">{data?.location?.name}, {data?.location?.country}</p>
              <div className="w-25 h-25 bg-white/15 backdrop-blur-lg rounded-full flex items-center mb-4 justify-center border border-white/40 shadow-bubble">
                <img src={`https://${data?.current?.condition?.icon}`} alt="Weather Icon" className="w-16 h-16" />
              </div>
              <p className="text-3xl text-center font-medium text-white">{Math.floor(data?.current?.temp_c)}°C</p>
              <p className="text-center text-white/70">Feels like: {Math.floor(data?.current?.feelslike_c)}°C</p>
              <p className="text-center text-white/70">{data?.current?.condition?.text} - {airAdvice}</p>
            </div>
            <AnimatePresence mode="wait">
              {!forecast ? 
                (
                  <motion.div
                  key="state-a"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="grid grid-cols-2 gap-4 p-4 w-full bg-white/20 backdrop-blur-[25px] text-white/80 font-semibold rounded-2xl shadow-inner-white">
                    <p>Humidity: {data?.current?.humidity}%</p>
                    <p>Cloud Rate: {data?.current?.cloud}%</p>
                    <p>Air Quality: {airQuality?.label}</p>
                    <p>Wind: {data?.current?.wind_kph}km/h {data?.current?.wind_dir}</p>
                  </motion.div>
                )
                :
                (
                  <motion.div 
                  key="state-b"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-center justify-center flex-col gap-4 mt-4 w-full">
                    {data?.forecast?.forecastday?.slice(1).map(day => (
                      <div className="px-4 py-3 flex items-center justify-between w-full bg-white/5 text-white font-semibold rounded-semiCard shadow-inner-white-2">
                        <p>{getDayName(day?.date)}</p>
                        <img src={`https://${day?.day?.condition?.icon}`} alt="Weather Icon" className="w-8 h-8" />
                        <p>{Math.floor(day?.day?.maxtemp_c)}°C / {Math.floor(day?.day?.mintemp_c)}°C</p>
                      </div>  
                    ))}
                  </motion.div>
                )
              }
            </AnimatePresence>
          </div>
        </div>
        <footer className="text-white/60 text-center font-medium text-sm py-3">© 2026 Boudi For Weather</footer>
      </main>
    )
}