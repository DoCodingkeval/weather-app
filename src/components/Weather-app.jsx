import { useEffect, useState, useRef, use } from "react";
import axios from "axios";
import snow from "../assets/images/snowy.svg";
import heavysnow from "../assets/images/heavysnow.svg";
import lightsnow from "../assets/images/lightsnow.svg";
import clear from "../assets/images/clear.svg";
import rain from "../assets/images/rainy.svg";
import drizzle from "../assets/images/drizzle.svg";
import cloud from "../assets/images/cloudy-day-3.svg";
import cloudy from "../assets/images/cloudy.svg";
import smoke from "../assets/images/smoke.png";
import haze from "../assets/images/haze.png";
import thunder from "../assets/images/thunder.svg";
import thermometer from "../assets/images/thermometer.png";
import humidity from "../assets/images/humidity.png";
import wind from "../assets/images/wind.png";
import { MoonLoader } from "react-spinners";
import dayjs from "dayjs";
import { RiMapPinLine, RiSearchLine } from "@remixicon/react";
import "./style.css";
import Noresult from "./Noresult.jsx";

const Images = {
  Clear: clear,
  "clear sky": clear,
  Sunny: clear,
  Snow: snow,
  "heavy snow": heavysnow,
  "light snow": lightsnow,
  Rain: rain,
  Thunderstorm: thunder,
  "overcast clouds": cloud,
  "broken clouds": cloudy,
  "scattered clouds": cloudy,
  "few clouds": cloudy,
  Clouds: cloud,
  Drizzle: drizzle,
  Smoke: smoke,
  Haze: haze,
  Mist: haze,
};

const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const APIF_URL = "https://api.openweathermap.org/data/2.5/forecast";

function Weatherapp() {
  const [city, setCity] = useState("paris");
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hasnoresults, setHasNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const mainRef = useRef();
  const forecastRef = useRef();

  useEffect(() => {
    fetchData();
  }, [city]);

  useEffect(() => {
    dailyData();
  }, [city]);

  const dailyData = async () => {
    const dailyResponse = await axios.get(APIF_URL, {
      params: { q: city, appid: import.meta.env.VITE_APP_API },
    });
    console.log(dailyResponse.data);
    const dayForecast = dailyForecast(dailyResponse.data.list);
    setForecast(dayForecast);
  };

  const dailyForecast = (data) => {
    const result = [];
    const map = new Map();
    const today = new Date().toISOString().split("T")[0];

    for (const entry of data) {
      const date = entry.dt_txt.split(" ")[0];
      if (date === today) continue;

      if (!map.has(date) && entry.dt_txt.includes("12:00:00")) {
        const dateObj = new Date(entry.dt_txt);
        const dayName = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
        });
        entry.dayName = dayName;

        map.set(entry, date);
        result.push(entry);
      }
    }
    return result;
  };

  const fetchData = async () => {
    try {
      if (!city || city.trim() === "") return;
      setLoading(true);
      const response = await axios.get(API_URL, {
        params: {
          q: city,
          appid: import.meta.env.VITE_APP_API,
          units: "metric",
        },
      });
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      setData(response.data);
      console.log(response.data);
      setHasNoResults(false);
    } catch (error) {
      setHasNoResults(true);
      setLoading(false);
    }
  };

  const weatherNames = {
    climateName: data?.weather[0]?.description,
    locationName: data?.name,
    humidityPercent: data?.main?.humidity,
    windSpeed: data?.wind?.speed,
    temperature: Math.floor(data?.main?.temp),
  };

  const imgKey = weatherNames.climateName || "sunny";
  const date = dayjs().format("DD.MM.YY");
  const dayName = dayjs().format("dddd");

  return (
    <>
      <div className="container h-screen bg-[#E8E8E8] flex items-center justify-center max-sm:px-5">
        <div
          className="theme absolute xl:right-10 xl:top-5 
        max-sm:top-2 max-sm:right-3
        md:top-[5px] md:right-[5px] text-[12px]"
        >
          <input
            type="checkbox"
            id="check"
            onChange={(e) => {
              if (e.target.checked) {
                mainRef.current.style.background = "#242424";
                mainRef.current.style.color = "#fff";
                mainRef.current.style.boxShadow = "8px 8px 0px #666";
                inputRef.current.style.boxShadow = "3px 3px 0px #666";
                forecastRef.current.style.background = "#323232";
                forecastRef.current.style.color = "#fff";
              } else {
                mainRef.current.style.background = "#d3d3d3";
                mainRef.current.style.color = "#000";
                mainRef.current.style.boxShadow = "8px 8px 0px #323232";
                forecastRef.current.style.background = "#d3d3d3";
                forecastRef.current.style.color = "#000";
              }
            }}
          />

          <label htmlFor="check" className="toggle">
            <span className="sun">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g fill="#ffd43b">
                  <circle r="5" cy="12" cx="12"></circle>
                  <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>
                </g>
              </svg>
            </span>
            <span className="moon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
              </svg>
            </span>
          </label>
        </div>
        <h1
          className="title absolute top-0 capitalize text-nowrap xl:text-8xl
        max-sm:text-5xl max-sm:top-15 max-sm:left-5
        md:text-[48px]"
        >
          weather app
        </h1>
        <div
          className="main relative bg-[#d3d3d3] border-4 border-[#323232] rounded shadow-[8px_8px_0px_black]
          w-140 h-140 max-sm:max-w-[400px] max-sm:h-[500px]
          max-md:max-w-full max-md:h-[510px]
          max-lg:max-w-[560px] max-lg:h-[550px]
          mt-15 flex flex-col items-center justify-center duration-700"
          ref={mainRef}
        >
          <div className="w-full absolute top-2 p-5 flex items-center gap-2.5 z-10">
            <span className="absolute top-7 left-8">
              <RiMapPinLine />
            </span>
            <input
              className="w-full text-[14px] outline-none px-11 py-2 font-bold capitalize border-3 border-[#323232] rounded shadow-[3px_3px_0px_black]"
              type="text"
              ref={inputRef}
              placeholder="Enter city name"
            />

            <button
              onClick={() => {
                setCity(inputRef.current.value.trim());
                inputRef.current.value = "";
              }}
              className="btn absolute right-6 p-3 z-10 cursor-pointer"
            >
              <RiSearchLine />
            </button>
          </div>
          {loading ? (
            <span className="absolute h-20">
              <MoonLoader />
            </span>
          ) : hasnoresults ? (
            <Noresult />
          ) : (
            <>
              <div
                className="wrapper px-7 py-2 w-full h-100
              max-sm:h-85
              flex justify-center"
              >
                <div className="data w-full flex flex-col z-10">
                  <span className="text-5xl font-medium max-sm:text-4xl">
                    {dayName}
                  </span>
                  <span className="text-3xl font-medium capitalize mx-2 max-sm:mx-1">
                    {weatherNames.locationName}
                    <span className="text-[20px] ml-5">{date}</span>
                  </span>
                  <span
                    className="text-9xl py-2 flex 
                  max-sm:text-6xl
                  max-md:text-8xl"
                  >
                    {weatherNames.temperature}
                    <h1 className="text-[4.5rem] align-super max-sm:text-4xl">
                      °C
                    </h1>
                    <img
                      className="h-20 mt-10 -mx-5 max-md:px-0
                      max-sm:-ml-2 max-sm:h-15
                      max-md:mt-5"
                      src={thermometer}
                      alt=""
                    />
                  </span>
                  <img
                    className="weather__image w-75 object-cover absolute -right-5 top-22
                    max-sm:w-50 max-sm:top-30
                    max-md:top-13"
                    src={Images[imgKey]}
                  />
                </div>

                <div
                  className="w-full h-15 absolute bottom-35 flex items-center justify-between p-5 font-semibold
                max-sm:p-2"
                >
                  <div className="flex items-center justify-center gap-3">
                    <img className="h-20" src={humidity} alt="humidity-icon" />
                    <div className="flex flex-col-reverse gap-1 -ml-5">
                      <span>Humidity</span>
                      <span>{weatherNames.humidityPercent}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <img className="h-20 -mx-5" src={wind} alt="wind-icon" />
                    <div className="flex flex-col-reverse gap-1">
                      <span>Wind speed</span>
                      <span>{weatherNames.windSpeed}&nbsp;Km/h</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="w-full absolute bottom-0 flex items-center justify-between text-center transition bg-[#d3d3d3]"
                ref={forecastRef}
              >
                {forecast.map((item, index) => (
                  <div
                    key={index}
                    className="w-full not-last:border-r-2 border-[#323232]"
                  >
                    <div className="border-b-2 border-[#323232] font-semibold">
                      {item.dayName}
                    </div>
                    {item?.weather[0]?.main && (
                      <img
                        className="h-20 mx-auto"
                        src={Images[item.weather[0].main]}
                      />
                    )}
                    <span className="text-sm text-gray-500 font-medium">
                      {item.weather[0].main}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Weatherapp;
