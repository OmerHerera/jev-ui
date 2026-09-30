import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Globe2 } from "lucide-react";

const cities = [
  {
    name: "New York",
    country: "UNITED STATES",
    zone: "America/New_York",
    short: "NYC",
    color: "coral",
  },
  {
    name: "London",
    country: "UNITED KINGDOM",
    zone: "Europe/London",
    short: "LON",
    color: "blue",
  },
  {
    name: "Tokyo",
    country: "JAPAN",
    zone: "Asia/Tokyo",
    short: "TYO",
    color: "moss",
  },
  {
    name: "Sydney",
    country: "AUSTRALIA",
    zone: "Australia/Sydney",
    short: "SYD",
    color: "sun",
  },
];

function useCurrentTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return now;
}

function formatTime(date: Date, timeZone: string, hour12 = true) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12,
  }).format(date);
}

function formatDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    timeZoneName: "short",
  }).formatToParts(date);
  return (
    parts.find((part) => part.type === "timeZoneName")?.value ?? "LOCAL TIME"
  );
}

export function WorldClockWidget() {
  const now = useCurrentTime();
  const [hour12, setHour12] = useState(true);
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <section className="clock-widget" aria-label="World clock">
      <div className="clock-topline">
        <span className="clock-label">
          <Globe2 size={15} /> WORLD CLOCK
        </span>
        <div className="format-toggle" role="group" aria-label="Time format">
          <button
            className={hour12 ? "selected" : ""}
            onClick={() => setHour12(true)}
            aria-pressed={hour12}
          >
            12H
          </button>
          <button
            className={!hour12 ? "selected" : ""}
            onClick={() => setHour12(false)}
            aria-pressed={!hour12}
          >
            24H
          </button>
        </div>
      </div>

      <div className="clock-main">
        <div className="local-summary">
          <span className="surface-eyebrow">YOUR LOCAL TIME</span>
          <time className="local-time" dateTime={now.toISOString()}>
            {formatTime(now, localZone, hour12)}
          </time>
          <span className="local-date">{formatDate(now, localZone)}</span>
          <span className="timezone-label">
            {localZone.replaceAll("_", " ")}
          </span>
        </div>
        <div className="clock-orbit" aria-hidden="true">
          <span className="orbit-ring orbit-ring-outer" />
          <span className="orbit-ring orbit-ring-inner" />
          <span className="orbit-center">
            <Globe2 size={24} strokeWidth={1.5} />
          </span>
          <span className="orbit-point" />
          <span className="orbit-tick orbit-tick-one" />
          <span className="orbit-tick orbit-tick-two" />
        </div>
      </div>

      <div className="sync-note">
        <span className="signal-dot" /> SYNCING WITH ATOMIC CLOCK STANDARDS VIA
        SYSTEM TIME
      </div>
    </section>
  );
}

export function RestWorldClockWidget() {
  const now = useCurrentTime();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hour12, setHour12] = useState(true);
  const activeCity = cities[activeIndex];

  function moveCity(amount: number) {
    setActiveIndex(
      (current) => (current + amount + cities.length) % cities.length,
    );
  }
  return (
    <>
      <div className="city-carousel">
        <div className="carousel-heading">
          <div>
            <span className="surface-eyebrow">GLOBAL CONNECTIONS</span>
            <span className="carousel-location">
              {activeCity.name} <span>/ {activeCity.country}</span>
            </span>
          </div>
          <div className="city-tools">
            <div className="format-toggle" role="group" aria-label="Time format">
              <button
                className={hour12 ? "selected" : ""}
                onClick={() => setHour12(true)}
                aria-pressed={hour12}
              >
                12H
              </button>
              <button
                className={!hour12 ? "selected" : ""}
                onClick={() => setHour12(false)}
                aria-pressed={!hour12}
              >
                24H
              </button>
            </div>
            <div className="carousel-controls">
              <button
                onClick={() => moveCity(-1)}
                aria-label="Previous city"
                title="Previous city"
              >
                <ChevronLeft size={17} />
              </button>
              <span>
                {String(activeIndex + 1).padStart(2, "0")} <i>/</i> 04
              </span>
              <button
                onClick={() => moveCity(1)}
                aria-label="Next city"
                title="Next city"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
        <div className="city-track">
          {cities.map((city, index) => (
            <button
              className={`city-card ${city.color} ${index === activeIndex ? "active" : ""}`}
              key={city.zone}
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === activeIndex}
            >
              <span className="city-card-top">
                <span>{city.short}</span>
                <span>{getOffset(now, city.zone)}</span>
              </span>
              <time dateTime={now.toISOString()}>
                {formatTime(now, city.zone, hour12)}
              </time>
              <span className="city-card-bottom">
                <span>{city.name}</span>
                <span>
                  {formatDate(now, city.zone).split(",")[0].toUpperCase()}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
