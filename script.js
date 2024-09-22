window.addEventListener("DOMContentLoaded", () => startWeatherApp());

const startWeatherApp = () => {
  const selectCapitalsElement = document.querySelector("#header__select");

  /**
   * Vedi sotto funzione capitals
   */
  capitals(selectCapitalsElement).then((isError) => {
    if (!isError) {
      const formCapital = document.querySelector("#header__form");
      formCapital.addEventListener("submit", (e) => {
        e.preventDefault();
        submitFormCapital(selectCapitalsElement);
      });
    }
  });
};

/**
 * capitals - Uso questa funzione per ottenere la lista delle capitali e
 * popolare la select. Ritorno lo stato di errore così che, se per caso qualcosa va male,
 * tutta la logica sopra dello then di capitals()  non viene esguita.
 */
const capitals = (selectCapitalsElement) => {
  return fetch("https://countriesnow.space/api/v0.1/countries/capital")
    .then((response) => response.json())
    .then((capitals) => {
      /**
       * Se non ci sonoo errori, capitals.error = false,
       * allora crea la lista di options
       */
      if (!capitals.error) {
        capitals.data.forEach((capital) => {
          // Creo l'elemento <option>
          const optionElement = document.createElement("option");

          /**
           * Imposto il valore e il testo.
           * Visto che ci sono Paesi che non hanno la capitale, in quei casi
           * usiamo il nome del paese stesso
           */
          optionElement.value = encodeURIComponent(
            capital.capital || capital.name
          );
          optionElement.textContent = capital.capital || capital.name;

          // Appendiamo l'elemento <option> al <select>
          selectCapitalsElement.appendChild(optionElement);
        });
      }

      return capitals.error;
    });
};

const submitFormCapital = (selectCapitalsElement) => {
  const capital = selectCapitalsElement.value;
  const SHIFT_TWO_HOURS = 60 * 60 * 2;

  if (capital !== "*") {
    return fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${selectCapitalsElement.value}&units=metric&APPID=2c9dbe42190005bd4e907cba63cb5588`
    )
      .then((response) => response.json())
      .then((weather) => {
        if (weather.cod === 200) {
          const weatherEl = document.querySelector("#weather");
          const city = document.querySelector("#weather__city");
          const date = document.querySelector("#weather__date");
          const temperature = document.querySelector("#weather__temperature");
          const descriptionEl = document.querySelector("#weather__description");
          const emptystateEL = document.querySelector("#weather__emptystate");
          const dataEL = document.querySelector("#weather__data");
          const statusEl = document.querySelector("#weather__status");
          const temperatureMinEl = document.querySelector("#weather__temp_min");
          const temperatureMaxEl = document.querySelector("#weather__temp_max");
          const humidityEl = document.querySelector("#weather__humidity");
          const pressureEl = document.querySelector("#weather__pressure");
          const windEl = document.querySelector("#weather__wind");
          const visibilityEl = document.querySelector("#weather__visibility");
          const sunriseEl = document.querySelector("#weather__sunrise");
          const sunsetEl = document.querySelector("#weather__sunset");

          emptystateEL.classList.add("weather__emptystate--hidden");
          dataEL.classList.remove("weather__data--hidden");

          city.textContent = `${decodeURIComponent(capital)}, ${
            weather.sys.country
          }`;
          date.textContent = new Intl.DateTimeFormat("it-IT", {
            day: "2-digit",
            weekday: "long",
            month: "long",
          }).format(
            new Date(
              parseInt(
                new Date().getTime() +
                  (weather.timezone - SHIFT_TWO_HOURS) * 1_000
              )
            )
          );

          sunriseEl.textContent = new Intl.DateTimeFormat("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(
            new Date(
              parseInt(
                (weather.sys.sunrise + weather.timezone - SHIFT_TWO_HOURS) *
                  1_000
              )
            )
          );

          sunsetEl.textContent = new Intl.DateTimeFormat("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(
            new Date(
              parseInt(
                (weather.sys.sunset + (weather.timezone - SHIFT_TWO_HOURS)) *
                  1_000
              )
            )
          );
          temperature.textContent = `${parseInt(weather.main.temp)}°`;
          descriptionEl.textContent = weather.weather[0].description;
          temperatureMinEl.textContent = `${parseInt(weather.main.temp_min)}°`;
          temperatureMaxEl.textContent = `${parseInt(weather.main.temp_max)}°`;
          humidityEl.textContent = `${parseInt(weather.main.humidity)}%`;
          pressureEl.textContent = `${parseInt(weather.main.pressure)}hPa`;
          windEl.textContent = `${parseInt(weather.wind.speed)}m/s`;
          visibilityEl.textContent = `${parseInt(weather.visibility / 1000)}km`;
          statusEl.setAttribute(
            "src",
            `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
          );
        }
      });
  }
};
