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
  RiWindyFill,
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
      className="main-container relative w-[93vw] m-auto h-[83vh] mt-10 rounded-[25px]"
      ref={mainRef}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
        <div className="w-full p-7 flex items-center flex-col gap-2.5 z-10">
          <input
            className="w-full relative text-[14px] outline-none px-7 py-4 font-bold capitalize rounded-[15px] bg-[#ffffff4f] placeholder:text-[#333]"
            type="text"
            ref={inputRef}
            placeholder="Enter city name"
          />

          <button
            onClick={() => {
              setCity(inputRef.current.value.trim());
              inputRef.current.value = "";
            }}
            className="btn absolute right-9 p-3 z-10 cursor-pointer"
          >
            <RiSearch2Line />
          </button>
        </div>
        {loading ? (
          <span className="absolute left-37 top-55 h-20">
            <MoonLoader />
          </span>
        ) : hasnoresults ? (
          <Noresult />
        ) : (
          <>
            <div className="w-fit flex flex-col rounded-xl text-[#333] bg-[#ffffff4f] text-center px-5 ml-7">
              <div className="w-30 h-30 m-auto">
                <img
                  className="object-cover"
                  src={WeatherIcons[imgKey]}
                  alt="weather-icon"
                />
              </div>
              <span className="font-semibold -mt-2">
                <h1 className="text-[18px]">{weatherNames.locationName}</h1>
                <h1 className="text-4xl">{weatherNames.temperature}°C</h1>
              </span>
              <span className="font-semibold mt-1 text-[16px]">
                {dayName} <br /> {date}
              </span>
            </div>
            {/* <div className="ml-7 mt-7 w-fit grid grid-cols-2 gap-3 font-medium">
              <div className="flex flex-col items-center gap-1.5 px-4 text-center bg-[#ffffff4f] p-3 rounded-lg">
                <RiContrastDropLine className="mb-1" />
                <p className="font-semibold">{weatherNames.humidityPercent}%</p>
                <h1 className="text-[13px] font-bold">Humidity</h1>
              </div>

              <div className="flex flex-col items-center gap-1.5 text-center bg-[#ffffff4f] p-3 rounded-lg">
                <RiWindyFill className="mb-1" />
                <p className="font-semibold">{weatherNames.windSpeed}</p>
                <h1 className="text-[13px] font-bold">Wind</h1>
              </div>
            </div> */}
            <div
              className="w-full px-7 absolute bottom-5 flex items-center text-center overflow-x-auto no-scrollbar"
              ref={forecastRef}
            >
              {forecast.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative w-20 h-30 rounded-lg not-last:mr-4 bg-[#ffffff94] flex-none py-2"
                  >
                    <h1 className="font-bold">{item.dayName}</h1>
                    {item?.weather[0]?.main && (
                      <img
                        className="h-auto w-15 m-auto"
                        src={ForecastIcons[item.weather[0].main]}
                      />
                    )}
                    <span className="font-semibold">
                      {item.weather[0].main}
                    </span>
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
