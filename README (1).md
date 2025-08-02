# 🌤️ WeatherWise - Interactive Weather Dashboard

A modern, responsive weather dashboard that provides real-time weather information, interactive maps, and detailed forecasts. Built with vanilla JavaScript and integrated with OpenWeatherMap API for accurate weather data.

## 🚀 Features

- **Interactive Weather Map** - Explore weather conditions with multiple layer options
- **Real-time Weather Data** - Current conditions, temperature, humidity, and more
- **5-Day Forecast** - Detailed weather predictions with hourly breakdowns
- **Multiple Weather Layers** - Temperature, precipitation, clouds, pressure, and wind overlays
- **Location Search** - Find weather information for any city worldwide
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Beautiful UI** - Clean, modern interface with smooth animations

## 📸 Screenshots

### Main Dashboard
![Main Dashboard](assets/Screenshot%202025-08-02%20100709.png)

### Weather Map with Layers
![Weather Map](assets/Screenshot%202025-08-02%20100752.png)

### Detailed Weather Analytics
![Weather Analytics](assets/Screenshot%202025-08-02%20100809.png)

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js for interactive maps
- **UI Framework**: Bootstrap 5.3.3 for responsive design
- **Icons**: Bootstrap Icons & Boxicons
- **Slider**: Swiper.js for smooth carousels
- **API**: OpenWeatherMap API for weather data

## 🏁 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- OpenWeatherMap API key (free registration at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Configure API Key**
   - Open `config.js`
   - Replace the API key with your own OpenWeatherMap API key:
   ```javascript
   const config = {
       API_KEY: `your_api_key_here`
   };
   ```

3. **Launch the Application**
   - Open `index.html` in your web browser
   - Or serve it using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Access the Dashboard**
   - Open your browser and navigate to `http://localhost:8000`

## 🎯 Usage

### Navigation
- **Home**: Main dashboard with current weather
- **Forecast**: 5-day weather forecast with detailed hourly data
- **Analytics**: Advanced weather metrics and historical data
- **About**: Information about the application

### Map Layers
- **Normal**: Standard map view
- **Temperature**: Temperature overlay
- **Precipitation**: Rainfall and snow data
- **Clouds**: Cloud coverage
- **Pressure**: Atmospheric pressure
- **Wind**: Wind speed and direction

### Search Functionality
- Use the search bar to find weather data for any city
- Supports international locations
- Auto-suggests popular cities

## 📁 Project Structure

```
weather-dashboard/
├── index.html              # Main HTML file
├── script.js               # Core JavaScript functionality
├── style.css               # Custom CSS styles
├── config.js               # API configuration
├── assets/                 # Images and icons
│   ├── screenshots/        # Application screenshots
│   └── icons/              # Weather condition icons
└── README.md               # Project documentation
```

## 🔧 Configuration

### API Settings
The application uses OpenWeatherMap API. You can customize the following in `config.js`:

```javascript
const config = {
    API_KEY: 'your_api_key_here',
    // Add more configuration options as needed
};
```

### Map Settings
Default map center and zoom can be modified in `script.js`:

```javascript
var map = L.map("map", {
    center: [28.7041, 77.1025], // Delhi, India coordinates
    zoom: 7,
    // Other map options...
});
```

## 🌐 API Integration

This project integrates with several OpenWeatherMap API endpoints:

- **Current Weather API**: Real-time weather data
- **5-Day Forecast API**: Extended weather predictions
- **Weather Maps API**: Weather layer overlays
- **Geocoding API**: Location search and coordinates

## 📱 Responsive Design

The dashboard is fully responsive and provides optimal viewing experience across:

- **Desktop**: Full-featured interface with all panels visible
- **Tablet**: Adaptive layout with collapsible navigation
- **Mobile**: Touch-optimized interface with streamlined navigation

## 🎨 Customization

### Themes
The application supports easy theming through CSS custom properties:

```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    --background-color: #ecf0f1;
    /* Modify these values to change the theme */
}
```

### Adding New Weather Layers
To add new weather layers, modify the layer buttons in `index.html` and add corresponding handlers in `script.js`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Leaflet](https://leafletjs.com/) for the interactive mapping library
- [Bootstrap](https://getbootstrap.com/) for the responsive framework
- [Bootstrap Icons](https://icons.getbootstrap.com/) and [Boxicons](https://boxicons.com/) for the beautiful icons

## 📞 Contact

If you have any questions, feel free to reach out:

- GitHub: [@PrashantKumarD](https://github.com/PrashantKumarD)
- Email: kumarprashant6080@gmail.com

## 🔮 Future Enhancements

- [ ] Weather alerts and notifications
- [ ] Historical weather data charts
- [ ] Weather comparison between multiple cities
- [ ] Dark mode toggle
- [ ] Offline functionality with service workers
- [ ] Weather data export functionality
- [ ] Integration with more weather APIs
- [ ] Advanced analytics and trends

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ by Prashant