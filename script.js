const API_KEY1 = config.API_KEY;

var map = L.map("map", {
    center: [28.7041, 77.1025], // Delhi, India
    zoom: 7,
    preferCanvas: true,
    zoomSnap: 0.5,
    fadeAnimation: false,  // Disable fade to speed up tile loading
    markerZoomAnimation: false, // Prevent unnecessary zoom animations
    zoomAnimationThreshold: 10, // Prevents animation lag on fast zooms
    zoomControl: false,
});

// Base Map Layer
var main_layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
    minZoom: 2,
    detectRetina: true,
    buffer:100000000000000,
    keepBuffer: 1000000, // Preload extra tiles beyond screen
    updateWhenZooming: false, // Prevents reloading during zoom
    reuseTiles: true
}).addTo(map);

var bounds = [[-90,-Infinity],[90,Infinity]];

map.setMaxBounds(bounds);

var weatherLayer; // Store the current weather layer

function updateWeatherLayer(url) {
    if (weatherLayer) {
        map.removeLayer(weatherLayer); // Remove the previous weather layer
    }
    weatherLayer = L.tileLayer(url, {
        opacity: 0.9,
        maxZoom: 19,
        minZoom: 2,
        crossOriogin : true,
        detectRetina: true,
        keepbuffer : 10000000,
        buffer:10000000000,
        maxNativeZoom: 19,
        updateWhenZooming: false,
        tileUnload:false,
        reuseTiles: true
    }).addTo(map);

    layerGroup([main_layer,weatherLayer]).addTo(map);
}

window.addEventListener("resize", function () {
    map.invalidateSize();
});

//no layer
document.querySelector('.Normal').addEventListener("click",function(){
    if (weatherLayer) {
        map.removeLayer(weatherLayer); // Remove the previous weather layer
    }
});
// 🌥️ Cloud Layer
document.querySelector(".cloud").addEventListener("click", function () {
    updateWeatherLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY1}`);
});

// 🌧️ Precipitation Layer
document.querySelector(".precip").addEventListener("click", function () {
    updateWeatherLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY1}`);
});

// 🌡️ Temperature Layer
document.querySelector(".temperature").addEventListener("click", function () {
    updateWeatherLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY1}`);
});

// 🌀 Wind Layer
document.querySelector(".wind").addEventListener("click", function () {
    updateWeatherLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY1}`);
});

// 🔵 Pressure Layer
document.querySelector(".pressure").addEventListener("click", function () {
    updateWeatherLayer(`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY1}`);
});



document.querySelector("#search-btn").addEventListener('click', function(event){
    event.preventDefault();  // Prevent form submission & page refresh
    
    let city_name = document.querySelector("#locationc").value.trim();  // Get input value

    if (city_name === "") {
        alert("Please enter a city name");
        return;
    }

    getcity(city_name);
});

function getcity(cityname) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=4&appid=${API_KEY1}`)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            let city = data[0];  // Get first matching city
            let cityname = city.name;
            let country = city.country;
            let state = city.state || "N/A"; // Some cities may not have a state
            let lat = city.lat;
            let lon = city.lon;  // Fix: 'lon' instead of 'long'

            console.log(`City: ${cityname}, Country: ${country}, State: ${state}, Lat: ${lat}, Lon: ${lon}`);
            getweather(lat, lon , cityname , state , country);
        } else {
            alert("Invalid input: City Not Found");
        }
    })
    .catch(error => console.error("Error fetching city:", error));
}


function getweather(latitude, longitude ,cityname ,state,country) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY1}&units=metric`)
    .then(response => response.json())
    .then(data => {
        let weatherType = data.weather[0].main; 
        let weather_icon = data.weather[0].icon; // Fix: Access first weather object
        let temperature_t = data.main.temp;
        let pressure_t = data.main.pressure;
        let humidity = data.main.humidity;
        let min_temp = data.main.temp_min;
        let max_temp = data.main.temp_max;
        let visibility = data.visibility;
        let wind_speed = data.wind.speed;
        let cloudiness = data.clouds.all;
        let snow = data.snow?.["1h"] || "0"; // Fix: Handle undefined snow
        let wind_d = data.wind.deg;
        let sunrise = data.sys.sunrise; // Convert to readable format
        let sunset = data.sys.sunset;

        // Updating UI inside .then()
        var h2 = document.querySelectorAll('.search-box h2');
        h2[0].textContent = cityname +" , " + state;
        h2[1].textContent = country;
        h2[2].textContent = weatherType;
        
        let img1 = document.querySelector('.cur-img'); 
        let iconCode = weather_icon.trim(); 
        img1.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; 
        var headings = document.querySelectorAll('.row h3');
        headings[0].textContent = "Temp (°C): " + temperature_t;
        headings[1].textContent = "Pressure (hPa): " + pressure_t;
        headings[2].textContent = "Humidity (%): " + humidity;
        headings[3].textContent = "Min Temp (°C): " + min_temp;
        headings[4].textContent = "Max Temp (°C): " + max_temp; // Fix: Corrected variable name
        headings[5].textContent = "Visibility (m): " + visibility;
        headings[6].textContent = "Wind Speed (m/s): " + wind_speed;
        headings[7].textContent = "Cloudiness (%): " + cloudiness;
        headings[8].textContent = "Snow (mm): " + snow;
        headings[9].textContent = "Wind-Direction: " + getWindDirection(wind_d);
        headings[10].textContent = "Sunrise (IST): " + convertUnixToTime(sunrise,19800);
        headings[11].textContent = "Sunset (IST): " + convertUnixToTime(sunset, 19800);

        updatemarker([latitude,longitude],cityname,country);
        forecasting(latitude,longitude);
        
    })
    .catch(error => console.error("Error fetching weather data:", error));
}

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        (position) => {

            reversegeocoding(position.coords.latitude,position.coords.longitude);
        },
        (error) => {
            reversegeocoding(28.7041,77.1025);
        }   

    )
}

else {
    reversegeocoding(28.7041,77.1025);
    }

function convertUnixToTime(unixTimestamp, timezoneOffset) {
    let date = new Date((unixTimestamp + timezoneOffset) * 1000); // Convert to milliseconds
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour
    minutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero
    return `${hours}:${minutes} ${ampm}`;
}

function reversegeocoding(latitude,longitude){
    fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY1}`).then(response => response.json())
    .then(data => {
        let loc_name = data[0].name;
        let state_n = data[0].state;
        let country_n = data[0].country;
        getweather(latitude,longitude,loc_name,state_n,country_n);

    });
}
function getWindDirection(deg) {
    if (deg >= 337.5 || deg < 22.5) return "North (N)";
    if (deg >= 22.5 && deg < 67.5) return "Northeast(NW) ";
    if (deg >= 67.5 && deg < 112.5) return "East (E)";
    if (deg >= 112.5 && deg < 157.5) return "Southeast(SE) ";
    if (deg >= 157.5 && deg < 202.5) return "South (S)";
    if (deg >= 202.5 && deg < 247.5) return "Southwest(SW) ";
    if (deg >= 247.5 && deg < 292.5) return "West (W)";
    if (deg >= 292.5 && deg < 337.5) return "Northwest(NW) ";
}

let marker = L.marker([28.7041, 77.1025]).addTo(map)
.bindPopup(" 📍 Delhi , IN ").openPopup();

function updatemarker([lat,lon],location,country){
    marker.setLatLng([lat,lon]).setPopupContent(`📍  ${location} , ${country} `).openPopup();
    map.setView([lat,lon],13);
}

function forecasting(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY1}&units=metric`)
    .then(response => response.json())
    .then(data => {
        let windspeedchart = []
        let forecast = data.list;
        let dates = [];
        let temps = [];
        let times = [];
        let mininum_temp =[];
        let maximum_temp =[];
        let pressure_arr = [];
        let humid_arr = [];
        let cloud_arr = [];
        let rainchart = [];
        let weather_ifor = [];
        let weather_ty  = [];

        forecast.forEach((entry) => {
            let datetime = entry.dt_txt;
            let [date, time] = datetime.split(" "); // Correct split
            dates.push(date); // Store date
            times.push(time);
            temps.push(entry.main.temp); // Store temp
            mininum_temp.push(entry.main.temp_min);
            maximum_temp.push(entry.main.temp_max);
            pressure_arr.push (entry.main.pressure);
            humid_arr.push(entry.main.humidity);
            cloud_arr.push(entry.clouds.all);
            windspeedchart.push(entry.wind.speed);
            rainchart.push(entry.rain?.["3h"] || 0);
            weather_ifor.push(entry.weather[0].icon);
            weather_ty.push(entry.weather[0].main );

            console.log(weather_ifor);

        });

        plottemp(dates,times, temps); // Send arrays to chart
        plotpressure(dates , pressure_arr);
        plothumidity(dates , humid_arr);
        plotcloud (dates , cloud_arr);
        plotradar(dates , cloud_arr,temps,humid_arr,rainchart,pressure_arr,windspeedchart);
        swiperswipping(dates , times , temps , pressure_arr , humid_arr , windspeedchart , cloud_arr , rainchart,weather_ifor,weather_ty);
        plotwinds(dates,windspeedchart);
        avgtemp(temps);
        avgpressure(pressure_arr);
        avghumid(humid_arr);
        avgcloud(cloud_arr);
        avgrain(rainchart);
        avgwind(windspeedchart);
        plotrains(dates,rainchart);

        
    })
    .catch(error => console.error("Error fetching forecast:", error));
}


function plottemp(dates,times, temps) {
    var canvas_e = document.querySelector(".linechart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(canvas_e, {
        type: "line",
        data: {
            labels: dates, // Use date array
            datasets: [{
                label: "Temperature (°C)",
                data: temps, // Use temperature array
                borderColor: "orange",
                borderWidth: 2,
                backgroundColor : "orange",
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true, title: { display: true, text: "Date" } },
                y: { display: true, title: { display: true, text: "Temperature (°C)" } }
            }
        }
    });
}

var plot_chart;
function plotpressure(date , pressure_arr){
    var canva = document.querySelector('.linechart-1').getContext('2d');

    if(plot_chart){
        plot_chart.destroy();
    }

    plot_chart = new Chart(canva , {
        type:'line',
        data : {
            labels: date ,
            datasets: [{
                label : "Ground Pressure" ,
                data : pressure_arr ,
                borderColor : "green" , 
                backgroundColor : "green",
                borderWidth: 2,
                fill : false
            } ] 
        },
        options : {
            responsive : true ,
            scales :{
                x : { display : true , title : { display : true , text : "Dates"} } ,
                y : { display : true , title : { display : true , text : " Ground Pressure(hPa)"}} 
            }
        }

    });
}

var plot_chart1;
function plothumidity(date , humid_arr){
    var canva = document.querySelector('.linechart-2').getContext('2d');

    if(plot_chart1){
        plot_chart1.destroy();
    }

    plot_chart1 = new Chart(canva , {
        type:'line',
        data : {
            labels: date ,
            datasets: [{
                label : "Humidity" ,
                data : humid_arr ,
                borderColor : "violet" , 
                backgroundColor : "violet",
                borderWidth: 2,
                fill : false
            } ] 
        },
        options : {
            responsive : true ,
            scales :{
                x : { display : true , title : { display : true , text : "Dates"} } ,
                y : { display : true , title : { display : true , text : " Humidity(%)"}} 
            }
        }

    });
}

var barchart ;

function plotcloud(date , cloud_arr){
    var canva = document.querySelector('.linechart-3').getContext('2d');

    if(barchart){
        barchart.destroy();
    }

    barchart = new Chart(canva , {
        type:'bar',
        data : {
            labels: date ,
            datasets: [{
                label : "Cloudiness (%)" ,
                data : cloud_arr ,
                borderColor : "purple" , 
                backgroundColor : "purple",
                borderWidth: 2,
                fill : false
            } ] 
        },
        options : {
            responsive : true ,
            scales :{
                x : { display : true , title : { display : true , text : "Dates"} } ,
                y : { display : true , title : { display : true , text : " Humidity(%)"}} 
            }
        }

    });
}


var radarchart ;

function plotradar(dates , cloud_arr,temps,humid_arr,rainchart,pressure_arr,windspeedchart){
    var canva = document.querySelector('.linechart-4').getContext('2d');

    if(radarchart){
        radarchart.destroy();
    }

    radarchart = new Chart(canva , {
        type:'radar',
        data : {
            labels:dates,
            datasets: [{
                label : "Temperature" ,
                data : temps ,
                borderColor : "purple" , 
                backgroundColor : "purple",
                borderWidth: 2,
                fill : false
            } ,
            {
                label : "Humidity" ,
                data : humid_arr ,
                borderColor : "green" , 
                backgroundColor : "green",
                borderWidth: 2,
                fill : false

            },
            {
                label : "Wind Speed" ,
                data : windspeedchart ,
                borderColor : "red" , 
                backgroundColor : "red",
                borderWidth: 2,
                fill : false

            },
            {
                label : "Rainfall" ,
                data : radarchart ,
                borderColor : "blue" , 
                backgroundColor : "blue",
                borderWidth: 2,
                fill : false

            },
            
            {
                label : "Cloudiness" ,
                data : cloud_arr ,
                borderColor : "yellow" , 
                backgroundColor : "yellow",
                borderWidth: 2,
                fill : false

            }
        ] 
        },
        options : {
            responsive : true ,
            scales :{
                r: {
                    beginAtZero : true,
                    suggestedeMax: 100
                } 
            }
        }

    });
}
var normchart ;
function plotwinds(dates,windspeedchart){
    var element_wind = document.querySelector(".linechart-5").getContext('2d'); 
    if(normchart){
        normchart.destroy();
    }
    normchart = new Chart(element_wind ,{
        type :'line',
        data : {
            labels : dates ,
            
            datasets : [{
                label : "WindSpeed (m/s)" ,
                data : windspeedchart ,
                borderColor : "darkpink" ,
                backgroundColor : "darkpink",
                borderWidth: 2,
                fill : false


            }]
        },
        options : {
            responsive : true ,
            scales : {
                x : { display : true , title : { display : true , text : "Dates"} } ,
                y : { display : true , title : { display : true , text : " WindSpeed (m/s) "}}  
            }
        }
    });
}

var rain_c_chart ;
function plotrains(dates,rainchart){
    var element_rain = document.querySelector(".linechart-6").getContext('2d'); 
    if(rain_c_chart){
        rain_c_chart.destroy();
    }
    rain_c_chart = new Chart(element_rain ,{
        type :'line',
        data : {
            labels : dates ,
            
            datasets : [{
                label : "Rain (mm)" ,
                data : rainchart ,
                borderColor : "blue" ,
                backgroundColor : "blue",
                borderWidth: 2,
                fill : false


            }]
        },
        options : {
            responsive : true ,
            scales : {
                x : { display : true , title : { display : true , text : "Dates"} } ,
                y : { display : true , title : { display : true , text : " Rain (mm) "}}  
            }
        }
    });

}

var swiper = new Swiper('.swiper', {
    effect: "cards",
    grabCursor: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    scrollbars : {
        el : ".swiper-scrollbar",
        hide: false },
});

function swiperswipping(date , time , temperature , pressure , humidity , wind , cloud , rain,icon_wr,weather_name){
    const swipeval = document.querySelector(".swiper-wrapper");
    const n = 40;
    swipeval.innerHTML ="";
    for(var i=0;i<40;i++){
        var d = date[i];
        var t = time[i];
        var temp = temperature[i];
        var press = pressure[i];
        var humid = humidity[i];
        var windspeed = wind[i];
        var cloudiness = cloud[i];
        var r = rain[i];
        var icon_w=icon_wr[i];
        var m =weather_name[i];
        let s = `
            <div class="swiper-slide">
                    <img  class="img-pro" src="https://openweathermap.org/img/wn/${icon_w}@2x.png">
                    <h1> ${m} </h1>  
                    <h2> Date : ${d} </h2>
                    <h2> Time : ${t} </h2>
                    <h3> Temperature (c) : ${temp} </h3>
                    <h3> Pressure (hPa) : ${press} </h3>
                    <h3> Humidity  : ${humid} </h3>
                    <h3> WindSpeed : ${windspeed} </h3>
                    <h3> Cloudiness (%) : ${cloudiness} </h3>
                    <h3> Rain (mm) : ${r} </h3>
            </div>        
        `;


        swipeval.innerHTML += s;
        
    }
    setTimeout(() => {
    swiper.update();
}, 500);
    
}
function avgtemp(temps){
var avgtemp1=0;
var minitemp=Infinity;
var maxitemp=-Infinity;
for(var i=0;i<40;i++){
    avgtemp1+=temps[i];
    minitemp = Math.min(minitemp,temps[i]);
    maxitemp = Math.max(maxitemp,temps[i]);
}
avgtemp1 = avgtemp1/40;

document.querySelector(".avgtemp").textContent = `Average Temperature (C): ${avgtemp1.toFixed(2)}`;
document.querySelector(".minitemp").textContent = `Minimum Temperature (C): ${minitemp.toFixed(2)}`;
document.querySelector(".maxtemp").textContent = `Maximum Temperature (C): ${maxitemp.toFixed(2)}`;
}

var minipress=Infinity;
var maxipress=-Infinity;
function avgpressure(pressure_arr){
    var avgpressure1=0;
    for(var i=0;i<40;i++){
        avgpressure1+=pressure_arr[i];
        minipress = Math.min(minipress,pressure_arr[i]);
        maxipress = Math.max(maxipress,pressure_arr[i]);
    }
    avgpressure1 = avgpressure1/40;
    
    document.querySelector(".avgpress").textContent = `Average Pressure (hPa): ${avgpressure1.toFixed(2)}`;
    document.querySelector(".minipress").textContent = `Minimum Pressure (hPa): ${minipress.toFixed(2)}`;
    document.querySelector(".maxpress").textContent = `Maximum Pressure (hPa): ${maxipress.toFixed(2)}`;
}
var minihumid=Infinity;
var maxihumid=-Infinity;
function avghumid(humid_arr){
    var avghumid1=0;
    for(var i=0;i<40;i++){
        avghumid1+=humid_arr[i];
        minihumid = Math.min(minihumid,humid_arr[i]);
        maxihumid = Math.max(maxihumid,humid_arr[i]);
    }
    avghumid1 = avghumid1/40;
    
    document.querySelector(".avghumid").textContent = `Average Humidity (%): ${avghumid1.toFixed(2)}`;
    document.querySelector(".minihumid").textContent = `Minimum Humidity (%): ${minihumid.toFixed(2)}`;
    document.querySelector(".maxhumid").textContent = `Maximum Humidity (%): ${maxihumid.toFixed(2)}`;
}
function avgcloud(cloud_arr){
    var avgcloud1=0;
    for(var i=0;i<40;i++){
        avgcloud1+=cloud_arr[i];
    }
    avgcloud1 = avgcloud1/40;
    
    document.querySelector(".avgcloud").textContent = `Average Cloudiness (%): ${avgcloud1.toFixed(2)}`;
}
function avgwind(windspeedchart){
    var avgwind1=0;
    for(var i=0;i<40;i++){
        avgwind1+=windspeedchart[i];
    }
    avgwind1 = avgwind1/40;
    
    document.querySelector(".avgwind").textContent = `Average WindSpeed (m/s): ${avgwind1.toFixed(2)}`;
}
function avgrain(rainchart){
    var avgrain1=0;
    for(var i=0;i<40;i++){
        avgrain1+=rainchart[i];
    }
    avgrain1 = avgrain1/40;
    
    document.querySelector(".avgrain").textContent = `Average Rainfall (mm): ${avgrain1.toFixed(2)}`;
}

