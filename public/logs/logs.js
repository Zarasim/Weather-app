getData();
async function getData() {
  // I can use the api route
  const response = await fetch("/api");
  const data = await response.json();

  // create dom elements in javscript
  for (item of data) {
    const root = document.createElement("div");
    const weather = document.createElement("div");
    const date = document.createElement("div");
    // template literals with grave accent
    root.textContent = `latitude: ${item.weather.lat}°, longitude: ${item.weather.lon}°`;
    weather.textContent = `weather: ${item.weather.description}`;
    date.textContent = new Date(item.timestamp).toLocaleString();

    document.body.append(root);
    document.body.append(weather);
    document.body.append(date);

    const break_ = document.createElement("br");
    document.body.append(break_);
  }
  console.log(data);
}
