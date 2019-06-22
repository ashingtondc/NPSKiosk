parkCode = sessionStorage["parkCode"];
console.log(parkCode);
let apiKey = "api_key=wkSxIB6zEvqQeML5MiJwyulZzR0gegiZKOcmwxNc";
getParkData();

// Page variables
let articlesStart = 1;
let articlesTotal;
let currentView;
let loading = false;

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
        let spinner = document.getElementById("parkspinner");
        document.body.removeChild(spinner);
        console.log("Loaded Park Data");
        let parkData = request.response.data[0];
        displayParkData(parkData);
        getVisitorCenterData();
        getCampgroundData();
        getAlertsData();
        getArticlesData();
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

function getVisitorCenterData()
{
    let baseURL = "https://developer.nps.gov/api/v1/visitorcenters?";
    baseURL += "parkCode=" + parkCode + "&";
    baseURL += "fields=addresses,operatingHours&";
    baseURL += apiKey;
    let request = new XMLHttpRequest();
    request.open('GET', baseURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        console.log("Loaded Visitor Centers");
        let visitorData = request.response.data;
        displayVisitorCenterData(visitorData);
    }
}

function displayVisitorCenterData(visitorData)
{
    let centerHolder = document.getElementById("visitorCenters");
    for (let i = 0; i < visitorData.length; i++)
    {
        let center = visitorData[i];
        let centerDiv = document.createElement("div");
        centerDiv.setAttribute("class", "visitorCenter");

        let name = document.createElement("h6");
        name.appendChild(document.createTextNode(center.name));

        let desc = document.createElement("p");
        desc.appendChild(document.createTextNode(center.description));

        let address = document.createElement("P");
        if (center.hasOwnProperty('addresses'))
        {
            let num;
            if (center.addresses[0].type == "Physical")
            {
                num = 0
            }else{
                num = 1;
            }
    
            let formattedAddress = center.addresses[num];
            if (formattedAddress.line1 != "")
            {
                address.appendChild(document.createTextNode(formattedAddress.line1));
                address.appendChild(document.createElement("br"));
            }
            address.appendChild(document.createTextNode(formattedAddress.city + ", " + formattedAddress.stateCode + " " + formattedAddress.postalCode));
    
        }
        
        let hours = document.createElement("P");
        if (center.hasOwnProperty('operatingHours'))
        {
            hours.appendChild(document.createTextNode(center.operatingHours[0].description));
            let hoursRef = center.operatingHours[0].standardHours;
            hours.appendChild(document.createElement("br"));
            hours.appendChild(document.createElement("br"));
            hours.appendChild(document.createTextNode("Sunday: " + hoursRef.sunday));
            hours.appendChild(document.createElement("br"));
            hours.appendChild(document.createTextNode("Monday: " + hoursRef.monday));
            hours.appendChild(document.createElement("br"));
            hours.appendChild(document.createTextNode("Tuesday: " + hoursRef.tuesday));
            hours.appendChild(document.createElement("br"));
            hours.appendChild(document.createTextNode("Wednesday: " + hoursRef.wednesday));
            hours.appendChild(document.createElement("br"));
            hours.appendChild(document.createTextNode("Thursday: " + hoursRef.thursday));
            hours.appendChild(document.createElement("br"));
            hours.appendChild(document.createTextNode("Friday: " + hoursRef.friday));
            hours.appendChild(document.createElement("br"));
            hours.appendChild(document.createTextNode("Saturday: " + hoursRef.saturday));
        }

        centerDiv.appendChild(name);
        centerDiv.appendChild(desc);
        centerDiv.appendChild(address);
        centerDiv.appendChild(hours);
        centerHolder.appendChild(centerDiv);
    }
}

function getCampgroundData()
{
    let baseURL = "https://developer.nps.gov/api/v1/campgrounds?";
    baseURL += "parkCode=" + parkCode + "&";
    baseURL += "fields=addresses,operatingHours&";
    baseURL += apiKey;
    let request = new XMLHttpRequest();
    request.open('GET', baseURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        console.log("Loaded Campgrounds");
        let campData = request.response.data;
        displayCampgroundData(campData);
    }
}

function displayCampgroundData(campData)
{
    let campHolder = document.getElementById("campgrounds");
    for (let i = 0; i < campData.length; i++)
    {
        let camp = campData[i];
        let campDiv = document.createElement("div");
        campDiv.setAttribute("class", "campground");

        let name = document.createElement("h6");
        name.appendChild(document.createTextNode(camp.name));

        let desc = document.createElement("p");
        desc.appendChild(document.createTextNode(camp.description));

        let address = document.createElement("P");
        if (camp.hasOwnProperty('addresses'))
        {
            let hasPhysicalAddress = false;

            let num;
            for (let i = 0; i < camp.addresses.length; i++)
            {
                if (camp.addresses[i].type == "Physical")
                {
                    hasPhysicalAddress = true;
                    num = i;
                }
            }
            if (hasPhysicalAddress)
            {
                let formattedAddress = camp.addresses[num];
                if (formattedAddress.line1 != "")
                {
                    address.appendChild(document.createTextNode(formattedAddress.line1));
                    address.appendChild(document.createElement("br"));
                }
                address.appendChild(document.createTextNode(formattedAddress.city + ", " + formattedAddress.stateCode + " " + formattedAddress.postalCode));
            }
        }
        
        let hours = document.createElement("P");
        if (camp.hasOwnProperty('operatingHours'))
        {
            hours.appendChild(document.createTextNode(camp.operatingHours[0].description));

            let hoursRef = camp.operatingHours[0].exceptions;
            if (hoursRef.length != 0)
            {
                hoursRef = hoursRef[0];
                hours.appendChild(document.createElement("br"));
                hours.appendChild(document.createElement("br"));

                let exception = hoursRef.name + ": " + hoursRef.startDate + " to " + hoursRef.endDate;
                hours.appendChild(document.createTextNode(exception));
            }
        }
        

        campDiv.appendChild(name);
        campDiv.appendChild(desc);
        campDiv.appendChild(address);
        campDiv.appendChild(hours);
        campHolder.appendChild(campDiv);
    }
}

function getAlertsData()
{
    let baseURL = "https://developer.nps.gov/api/v1/alerts?";
    baseURL += "parkCode=" + parkCode + "&";
    baseURL += apiKey;
    let request = new XMLHttpRequest();
    request.open('GET', baseURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        console.log("Loaded Alerts");
        let alertsData = request.response.data;
        displayAlertsData(alertsData);
    }
}
function displayAlertsData(alerts)
{
    let alertsHolder = document.getElementById("alerts");
    for (let i = 0; i < alerts.length; i++)
    {
        let alert = alerts[i];
        let alertDiv = document.createElement("div");
        alertDiv.setAttribute("class", "alert");

        let title = document.createElement("h6");
        title.appendChild(document.createTextNode(alert.category + " - " + alert.title));

        let desc = document.createElement("p");
        desc.appendChild(document.createTextNode(alert.description));

        alertDiv.appendChild(title);
        alertDiv.appendChild(desc);
        alertsHolder.appendChild(alertDiv);
    }
}

function getArticlesData()
{
    loading = true;
    let spinner = document.createElement("div");
    spinner.setAttribute("class", "lds-dual-ring");
    let articlesHolder = document.getElementById("articles");
    articlesHolder.appendChild(spinner);
    let baseURL = "https://developer.nps.gov/api/v1/articles?";
    baseURL += "parkCode=" + parkCode + "&";
    baseURL += "limit=10&" + "start=" + articlesStart + "&";
    baseURL += apiKey;
    let request = new XMLHttpRequest();
    request.open('GET', baseURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        console.log("Loaded Articles, Start") + articlesStart;
        articlesHolder.removeChild(spinner);
        let articlesData = request.response.data;
        displayArticlesData(articlesData);
        articlesTotal = request.response.total;
    }
}

function displayArticlesData(articlesData)
{
    let articlesHolder = document.getElementById("articles");
    for (let i = 0; i < articlesData.length; i++)
    {
        let obj = articlesData[i];

        let article = document.createElement("div");
        article.setAttribute("class", "article-row");
        let articleInfo = document.createElement("div");
        articleInfo.setAttribute("class", "article-info");
        let articleImage = document.createElement("div");
        articleImage.setAttribute("class", "article-image");

        let title = document.createElement("h6");
        title.appendChild(document.createTextNode(obj.title));

        let desc = document.createElement("p");
        desc.appendChild(document.createTextNode(obj.listingdescription));

        let url = document.createElement("button");
        url.setAttribute("onclick", "location.href='" + obj.url + "'");
        url.appendChild(document.createTextNode("Read"));
        
        articleInfo.appendChild(title);
        articleInfo.appendChild(desc);
        articleInfo.appendChild(url);

        let image = document.createElement("img");
        image.src = obj.listingimage.url;

        articleImage.appendChild(image);

        article.appendChild(articleInfo);
        article.appendChild(articleImage);
        articlesHolder.appendChild(article);
    }
    loading = false;
}

function openTab(evt, tabName) {
    // Declare all variables
    let i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    currentView = tabName;
}

window.onscroll = function(ev) {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        if (currentView == "articles" && articlesStart < articlesTotal && !loading)
        {
            articlesStart += 10;
            getArticlesData();
        }
    }
};