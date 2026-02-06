import { useEffect, useState, useRef } from "react";
async function dataFetching(inputData: string) {
      const KEY = "51bfc3486f914f95b87112734260102";
      const loader = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${inputData}&days=3`);
      const dataJSON = await loader.json();
      return dataJSON;
}
export default function App() {
  const switchRef = useRef<HTMLInputElement>(null);
  const [inputData, setInputData] = useState<string>("");
  const [data, setData] = useState<string | null>(null);
  function handleSpanClick() {
    if (switchRef.current?.checked) {
      switchRef.current?.click();
    } else {
      switchRef.current?.click();
    }
  }
  return (
    <main>
      <div className="flex flex-col h-screen px-4 py-6">
        <p className="text-white top-0 text-center">Boudi For Weather</p>
        <p className="text-white text-center text-xl font-medium text-shadow-lg mt-4">Hello, Enter the name of your country or city to Start</p>
        <div className="p-4 flex flex-col justify-center min-h-135 items-center bg-surface rounded-2xl shadow-card backdrop-blur-xl mt-6">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <p className="text-white font-semibold">Forecast For 3 Days</p>
            <div className="relative w-12 h-6.5">
              <input ref={switchRef} type="checkbox" id="unitToggle" className="hidden z-9 peer checked:bg-green-500"/>
              <span className="slider peer-checked:bg-green-500 peer-checked:before:translate-x-5" onClick={handleSpanClick}></span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2.5 mb-6">
              <input type="text" value={inputData} onChange={(e) => setInputData(e.currentTarget.value)} placeholder="Enter city name"
                className="bg-white/25 rounded-[14px] pl-3 pr-4 py-3 shadow-inner text-medium w-62.5 h-12.5 placeholder:text-white/75 transition-shadow outline-none text-white focus:shadow-inner-focus"
              />
              <button className="cursor-pointer flex items-center justify-center text-sm font-bold px-5 py-3 rounded-[14px] bg-linear-135 from-white to-50% to-[#EDEDED] shadow-sm transition-all hover:shadow-focus hover:scale-105 active:scale-95">
                Search
              </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <p className="text-2xl font-semibold text-center text-white">London, UK</p>
            <div className="w-25 h-25 bg-white/15 backdrop-blur-lg rounded-full flex items-center mb-4 justify-center border border-white/40 shadow-bubble">
              <img src="./src/assets/Coming Soon.png" alt="Weather Icon" className="w-16 h-16" />
            </div>
            <p className="text-3xl text-center font-medium text-white">20°C</p>
            <p className="text-center text-white/70">Partly Cloudy</p>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 w-full bg-white/20 backdrop-blur-[25px] text-white/80 font-semibold rounded-2xl shadow-inner-white">
            <p>Example: 55%</p>
            <p>Example: 55%</p>
            <p>Example: 55%</p>
            <p>Example: 55%</p>
          </div>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <footer className="text-white/60 text-center font-medium text-sm py-3">© 2026 Boudi For Weather</footer>
    </main>
  )
}