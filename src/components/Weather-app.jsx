import { useEffect, useState, useRef } from "react";
import axios from "axios";
import sunbg from "../assets/images/sunbg.jpg";
import rainbg from "../assets/images/rainbg.jpg";
import snowbg from "../assets/images/snowbg.jpg";
import cloudbg from "../assets/images/cloudbg.jpg";
import fogbg from "../assets/images/fogbg.jpg";
import hazebg from "../assets/images/hazebg.jpg";
import rain from "../assets/images/rain.svg";
import snow from "../assets/images/snow.svg";
import sun from "../assets/images/sun.svg";
import fog from "../assets/images/fog.svg";
import cloud from "../assets/images/cloud.svg";
import smcloud from "../assets/images/smcloud.svg";
import smsun from "../assets/images/smsun.svg";
import smsnow from "../assets/images/smsnow.svg";
import smrain from "../assets/images/smrain.svg";
import smfog from "../assets/images/smfog.svg";
import smthunder from "../assets/images/smthunder.svg";
import thunderstorm from "../assets/images/thunder.svg";
import haze from "../assets/images/haze.svg";
import { MoonLoader } from "react-spinners";
import dayjs from "dayjs";
import {
  RiContrastDropLine,
  RiSearch2Line,
  RiWindyLine,
} from "@remixicon/react";
import "./style.css";
import Noresult from "./Noresult.jsx";

const WeatherIcons = {
  Clear: sun,
  Rain: rain,
  Clouds: cloud,
  Fog: fog,
  Thunderstorm: thunderstorm,
  Haze: haze,
  Snow: snow,
};

const bgImages = {
  Clouds: cloudbg,
  Fog: fogbg,
  Rain: rainbg,
  Snow: snowbg,
  Clear: sunbg,
  Haze: hazebg,
};

const ForecastIcons = {
  Clouds: smcloud,
  Clear: smsun,
  Rain: smrain,
  Snow: smsnow,
  Fog: smfog,
  Haze: smfog,
  Thunderstorm: smthunder,
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
    climateName: data?.weather[0]?.main,
    locationName: data?.name,
    humidityPercent: data?.main?.humidity,
    windSpeed: data?.wind?.speed,
    temperature: Math.floor(data?.main?.temp),
    feels_like: Math.floor(data?.main?.feels_like),
  };

  const imgKey = weatherNames.climateName || "sunny";
  const date = dayjs().format("DD/M/YYYY");
  const dayName = dayjs().format("dddd");
  const backgroundImage = weatherNames.climateName
    ? bgImages[weatherNames.climateName]
    : bgImages["Clouds"];

  return (
    // main container
    <div
      className="main-container relative w-[93vw] max-w-[400px] m-auto h-[85vh] max-h-screen overflow-y-auto mt-10 rounded-[25px]"
      ref={mainRef}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* search bar */}
      <div className="w-full relative p-5 sm:p-7 flex items-center flex-col gap-3 z-10">
        <input
          className="w-full relative text-[14px] outline-none px-7 py-4 font-bold rounded-[15px] bg-[#ffffff4f] placeholder:text-[#333]"
          type="text"
          ref={inputRef}
          placeholder="Enter city name"
        />

        <button
          onClick={() => {
            setCity(inputRef.current.value.trim());
            inputRef.current.value = "";
          }}
          className="btn absolute right-8 top-1/2 -translate-y-1/2 p-3 z-10 cursor-pointer"
        >
          <RiSearch2Line />
        </button>
      </div>
      {loading ? (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20">
          <MoonLoader />
        </span>
      ) : hasnoresults ? (
        <Noresult />
      ) : (
        <>
          {/* {weather card} */}
          <div className="w-[90%] max-w-[200px] mx-7 flex flex-col items-center justify-center rounded-xl text-[#333] bg-[#ffffff4f] mb-6 pb-3 text-center">
            <img
              className="w-full h-25 object-contain"
              src={WeatherIcons[imgKey]}
              alt="weather-icon"
            />
            <div className="font-semibold flex flex-col items-center justify-center leading-none">
              <h2 className="text-lg">{weatherNames.locationName}</h2>
              <p className="text-3xl font-bold">{weatherNames.temperature}°C</p>
              <div className="mt-2 mb-1 flex gap-5 items-center">
                <p className="text-sm font-bold flex items-center gap-1">
                  <RiContrastDropLine /> {weatherNames.humidityPercent}%{" "}
                </p>
                <p className="text-sm font-bold flex items-center gap-1">
                  <RiWindyLine /> {weatherNames.windSpeed}{" "}
                </p>
              </div>
              <p className="text-sm font-bold">
                {dayName} <br /> {date}
              </p>
            </div>
          </div>
          {/* forecast container */}
          <div
            className="w-full px-5 sm:px-7 absolute bottom-8 flex gap-4 items-center text-center overflow-x-auto"
            ref={forecastRef}
          >
            {forecast.map((item, index) => {
              return (
                <div
                  key={index}
                  className="card relative rounded-lg px-5 mb-4 bg-[#ffffff94] flex-none"
                >
                  <h1 className="font-bold text-[13px] pt-3">{item.dayName}</h1>
                  {item?.weather[0]?.main && (
                    <img
                      className="h-15 w-full object-contain"
                      src={ForecastIcons[item.weather[0].main]}
                    />
                  )}
                  <p className="font-semibold mb-2 text-sm">
                    {item.weather[0].main}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Weatherapp;
