const mymap = L.map('mapid').setView([0, 0], 1);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

  //'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiemFyYXNpbSIsImEiOiJja3N2eXQzbGMwbjB3MnZsZ2h6cGxwdWc3In0.XoDx99gmewvoY7CPuqB30w'
}).addTo(mymap);

getData();
async function getData() {
  // I can use the api route
  const response = await fetch("/api");
  const data = await response.json();

  // create dom elements in javscript
  for (item of data) {
    const marker = L.marker([item.weather.lat, item.weather.lon]).addTo(mymap);
    aq = item.aq

    let txt = `The weather here at ${item.weather.lat}&deg;,
    ${item.weather.lon}&deg; is ${item.weather.description} with
    a temperature of ${item.weather.temp}&deg; C.`;

    if (aq.value < 0) {
      txt += '  No air quality reading.';
    } else {
      txt += `  The concentration of particulate matter 
    (${aq.parameter}) is ${aq.value} 
    ${aq.unit} last read on ${aq.lastUpdated}`;
    }

    marker.bindPopup(txt).openPopup();
  }

  console.log(data);
}
