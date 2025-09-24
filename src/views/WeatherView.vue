<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <!-- Weather Card -->
        <div class="card shadow-sm mb-4">
          <div class="card-header d-flex align-items-center">
            <h5 class="mb-0">Weather App</h5>
          </div>

          <div class="card-body">
            <!-- Search -->
            <div class="d-flex gap-2 mb-3 flex-wrap">
              <input
                type="text"
                v-model="city"
                placeholder="Enter city name"
                class="form-control"
              />
              <button @click="searchByCity" class="btn btn-primary">
                Search
              </button>
              <button @click="fetchCurrentLocationWeather" class="btn btn-outline-secondary">
                Use My Location
              </button>
            </div>

            <!-- Error -->
            <div
              v-if="errorMessage"
              class="alert alert-danger d-flex justify-content-between align-items-center"
            >
              <span>{{ errorMessage }}</span>
              <button class="btn btn-sm btn-light" @click="fetchCurrentLocationWeather">
                Retry
              </button>
            </div>

            <!-- Weather Info -->
            <main class="text-center mt-4">
              <div v-if="weatherData">
                <h2 class="fw-bold mb-3">
                  {{ weatherData.name }}, {{ weatherData.sys.country }}
                </h2>
                <img :src="iconUrl" alt="Weather Icon" class="weather-icon mb-2" />
                <h3 class="fw-bold">{{ temperature }} °C</h3>
                <p class="text-muted text-capitalize">
                  {{ weatherData.weather[0].description }}
                </p>
              </div>

              <div v-else-if="!errorMessage" class="text-muted">
                <p>No data yet. Try searching a city or use your location.</p>
              </div>
            </main>
          </div>

          <div class="card-footer text-muted small">
            Data provided by <a href="https://openweathermap.org/" target="_blank">OpenWeatherMap</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const apikey = "d77e2eb7b5c25afd0748a6a06f27a3d1"; 

export default {
  name: "App",
  data() {
    return {
      city: "",
      weatherData: null,
      hourlyForecast: [],
      dailyForecast: [],
      errorMessage: "",
    };
  },
  computed: {
    temperature() {
      return this.weatherData ? Math.round(this.weatherData.main.temp) : null;
    },
    iconUrl() {
      if (!this.weatherData) return null;
      const icon = this.weatherData.weather?.[0]?.icon;
      return icon
        ? `https://openweathermap.org/img/wn/${icon}@2x.png`
        : null;
    },
  },
  mounted() {
    this.fetchCurrentLocationWeather();
  },
  methods: {
    async fetchCurrentLocationWeather() {
      if (!navigator.geolocation) {
        this.errorMessage = "Geolocation is not supported by this browser.";
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          this.errorMessage = ""; 
          const { latitude, longitude } = position.coords;
          const url =`https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;
          await this.fetchWeatherData(url);
        },
        (error) => {
          console.error("Geolocation error:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.errorMessage = "Location access denied by user.";
              break;
            case error.POSITION_UNAVAILABLE:
              this.errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              this.errorMessage = "Location request timed out.";
              break;
            default:
              this.errorMessage =
                "Unable to retrieve location. Please try again.";
          }
        },
        { timeout: 10000 } 
      );
    },

    async searchByCity() {
      const q = this.city?.trim();
      if (!q) return;
      const url =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=${encodeURIComponent(q)}&appid=${apikey}&units=metric`;
      await this.fetchWeatherData(url);
    },

    async fetchWeatherData(url) {
      try {
        const { data } = await axios.get(url);
        this.weatherData = data;
        this.errorMessage = ""; 
      } catch (error) {
        console.error("Error fetching weather data:", error);
        this.weatherData = null;
        this.errorMessage = "Failed to fetch weather data.";
      }
    },
  },
};
</script>

<style scoped>
.weather-icon {
  width: 100px;
  height: 100px;
}
.card {
  border-radius: 12px;
}
.card-header {
  background: #f8f9fa;
}
</style>