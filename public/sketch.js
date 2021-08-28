// do not add any button
// send the request to the server and then display
// the information of weather and air quality from 2 different APIs

if ("geolocation" in navigator) {
  console.log("geolocation available");
  navigator.geolocation.getCurrentPosition(async (position) => {
    let lan, lon, weather, aq;
    try {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      //console.log(lat, lon);
      document.getElementById("latitude").textContent = lat.toFixed(2);
      document.getElementById("longitude").textContent = lon.toFixed(2);
      // send lat, lon to the server and wait for the response
      const api_url = `weather/${lat},${lon}`;
      const response = await fetch(api_url);
      const json = await response.json();
      weather = json.weather
      aq = json.air_quality.results[0].measurements[0]

      console.log(json);

      document.getElementById("summary").textContent = weather.description;
      document.getElementById("temperature").textContent = weather.temp;

      document.getElementById("value").textContent = aq.value;
      document.getElementById("unit").textContent = aq.unit;
      document.getElementById("lastUpdated").textContent = aq.lastUpdated;

    } catch (error) {
      console.error(error)
      aq.value = -1
      document.getElementById("value").textContent = 'NO READING';
    }

    const data = { weather, aq };

    console.log(data)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const db_response = await fetch("/api", options);
    const db_json = await db_response.json();
    //console.log(db_json);
  });
} else {
  console.log("geolocation not available");
}
