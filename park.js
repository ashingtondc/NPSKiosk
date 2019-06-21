parkCode = sessionStorage["parkCode"];
console.log(parkCode);
let apiKey = "api_key=wkSxIB6zEvqQeML5MiJwyulZzR0gegiZKOcmwxNc";
getParkData();
let slideIndex = 1;
showSlides(slideIndex);

function getParkData()
{
    let baseURL = "https://developer.nps.gov/api/v1/parks?";
    baseURL += "parkCode=" + parkCode + "&";
    baseURL += "fields=addresses,contacts,entranceFees,entrancePasses,images,latLong,operatingHours&";
    baseURL += apiKey;
    console.log(baseURL);
    let request = new XMLHttpRequest();
    request.open('GET', baseURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        console.log("Loaded");
        let parkData = request.response.data[0];
        displayParkData(parkData);
    }
}

function displayParkData(parkData)
{
    let title = document.getElementById("title");
    let intro = document.getElementById("parkIntro");

    let name = document.createElement("h2");
    name.appendChild(document.createTextNode(parkData.fullName));

    let desc = document.createElement("p");
    desc.appendChild(document.createTextNode(parkData.description));

    let weatherTitle = document.createElement("h6");
    weatherTitle.appendChild(document.createTextNode("Weather"));

    let weather = document.createElement("p");
    weather.appendChild(document.createTextNode(parkData.weatherInfo));

    title.appendChild(name);
    intro.appendChild(desc);
    intro.appendChild(weatherTitle);
    intro.appendChild(weather);

    let images_container = document.getElementById("parkImages");
    let img_url = parkData.images[0].url;

    let img = document.createElement("img");
    img.setAttribute("src", img_url);
    images_container.appendChild(img);
    
}