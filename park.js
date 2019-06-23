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
        getEventsData();
        getNewsData();
        getPeopleData();
        getPlacesData();
        getLessonData();
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
    title.appendChild(name);
    intro.appendChild(desc);
    if (parkData.weatherInfo != "")
    {
        let weatherTitle = document.createElement("h6");
        weatherTitle.appendChild(document.createTextNode("Weather"));
    
        let weather = document.createElement("p");
        weather.appendChild(document.createTextNode(parkData.weatherInfo));

        intro.appendChild(weatherTitle);
        intro.appendChild(weather);
    }
    

    
    
    if (parkData.images.length != 0)
    {
        let images_container = document.getElementById("parkImages");
        let img_url = parkData.images[0].url;
    
        let img = document.createElement("img");
        img.setAttribute("src", img_url);
        images_container.appendChild(img);
    }
    
    
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
        if (request.response.total == 0)
        {
            document.getElementById("visitorCenters").innerText = "No content available.";
        }else{
            displayVisitorCenterData(visitorData);
        }
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
        if (request.response.total == 0)
        {
            document.getElementById("campgrounds").innerText = "No content available.";
        }else{
            displayCampgroundData(campData);
        }
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
        if (request.response.total == 0)
        {
            document.getElementById("alerts").innerText = "No content available.";
        }else{
            displayAlertsData(alertsData);
        }
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
        console.log("Loaded Articles, Start " + articlesStart);
        articlesHolder.removeChild(spinner);
        let articlesData = request.response.data;
        articlesTotal = request.response.total;
        displayArticlesData(articlesData);
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

function getEventsData()
{
    loading = true;
    let spinner = document.createElement("div");
    spinner.setAttribute("class", "lds-dual-ring");
    let eventsHolder = document.getElementById("events");
    eventsHolder.appendChild(spinner);
    let baseURL = "https://developer.nps.gov/api/v1/events?";
    baseURL += "parkCode=" + parkCode + "&";
    baseURL += apiKey;
    let request = new XMLHttpRequest();
    request.open('GET', baseURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        console.log("Loaded Events");
        eventsHolder.removeChild(spinner);
        let eventsData = request.response.data;
        if (request.response.total == 0)
        {
            eventsHolder.innerText = "No content available.";
        }else{
            displayEventsData(eventsData);
        }
    }
}

function displayEventsData(eventsData)
{
    let eventsHolder = document.getElementById("events");
    for (let i = 0; i < eventsData.length; i++)
    {
        let obj = eventsData[i];

        let event = document.createElement("div");
        event.setAttribute("class", "event-row");
        let eventInfo = document.createElement("div");
        eventInfo.setAttribute("class", "event-info");
        let eventImage = document.createElement("div");
        eventImage.setAttribute("class", "event-image");

        let title = document.createElement("h6");
        title.appendChild(document.createTextNode(obj.title));

        let desc = document.createElement("p");
        desc.innerHTML = obj.description;

        let date = document.createElement("p");
        date.innerText = "Date(s): " + obj.date;
        date.style.fontWeight = "bold";

        let times = document.createElement("p");
        times.style.fontWeight = "bold";
        times.innerText = "Time(s): ";
        for (let j = 0; j < obj.times.length; j++)
        {
            let time = obj.times[0];
            times.innerText += time.timestart;
        }
        
        
        for (let j = 0; j < obj.images.length; j++)
        {
            let image = document.createElement("img");
            image.src = "https://www.nps.gov/" + obj.images[j].url;       
            eventImage.appendChild(image);
        }

        eventInfo.appendChild(title);
        eventInfo.appendChild(desc);
        eventInfo.appendChild(date);
        eventInfo.appendChild(times);
        event.appendChild(eventInfo);
        event.appendChild(eventImage);
        eventsHolder.appendChild(event);
    }
}

function getNewsData()
{
    let spinner = document.createElement("div");
    spinner.setAttribute("class", "lds-dual-ring");
    let newsHolder = document.getElementById("news");
    newsHolder.appendChild(spinner);
    let baseURL = "https://developer.nps.gov/api/v1/newsreleases?";
    baseURL += "parkCode=" + parkCode + "&";
    baseURL += apiKey;
    let request = new XMLHttpRequest();
    request.open('GET', baseURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        console.log("Loaded News");
        newsHolder.removeChild(spinner);
        let newsData = request.response.data;
        if (request.response.total == 0)
        {
            newsHolder.innerText = "No content available.";
        }else{
            displayNewsData(newsData);
        }
    }
}

function displayNewsData(newsData)
{
    let newsHolder = document.getElementById("news");
    for (let i = 0; i < newsData.length; i++)
    {
        let obj = newsData[i];

        let news = document.createElement("div");
        news.setAttribute("class", "news-row");
        let newsInfo = document.createElement("div");
        newsInfo.setAttribute("class", "news-info");
        let newsImage = document.createElement("div");
        newsImage.setAttribute("class", "news-image");

        let date = document.createElement("p");
        date.style.fontStyle = "italic";
        date.innerText = obj.releasedate;

        let title = document.createElement("h6");
        title.appendChild(document.createTextNode(obj.title));

        let desc = document.createElement("p");
        desc.appendChild(document.createTextNode(obj.abstract));

        let url = document.createElement("button");
        url.setAttribute("onclick", "location.href='" + obj.url + "'");
        url.appendChild(document.createTextNode("Read"));
        
        newsInfo.appendChild(date);
        newsInfo.appendChild(title);
        newsInfo.appendChild(desc);
        newsInfo.appendChild(url);
        if (obj.hasOwnProperty('image'))
        {
            let image = document.createElement("img");
            image.src = obj.image.url;
            newsImage.appendChild(image);
        }
        
        news.appendChild(newsInfo);
        news.appendChild(newsImage);
        newsHolder.appendChild(news);
    }
}

function getPeopleData()
{
    let spinner = document.createElement("div");
    spinner.setAttribute("class", "lds-dual-ring");
    let peopleHolder = document.getElementById("people");
    peopleHolder.appendChild(spinner);
    let baseURL = "https://developer.nps.gov/api/v1/people?";
    baseURL += "parkCode=" + parkCode + "&";
    baseURL += apiKey;
    let request = new XMLHttpRequest();
    request.open('GET', baseURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        console.log("Loaded people");
        peopleHolder.removeChild(spinner);
        let peopleData = request.response.data;
        if (request.response.total == 0)
        {
            peopleHolder.innerText = "No content available.";
        }else{
            displayPeopleData(peopleData);
        }
    }
}

function displayPeopleData(peopleData)
{
    let peopleHolder = document.getElementById("people");
    for (let i = 0; i < peopleData.length; i++)
    {
        let obj = peopleData[i];

        let people = document.createElement("div");
        people.setAttribute("class", "people-row");
        let peopleInfo = document.createElement("div");
        peopleInfo.setAttribute("class", "people-info");
        let peopleImage = document.createElement("div");
        peopleImage.setAttribute("class", "people-image");

        let title = document.createElement("h6");
        title.appendChild(document.createTextNode(obj.title));

        let desc = document.createElement("p");
        desc.appendChild(document.createTextNode(obj.listingdescription));

        let url = document.createElement("button");
        url.setAttribute("onclick", "location.href='" + obj.url + "'");
        url.appendChild(document.createTextNode("Read"));
        
        peopleInfo.appendChild(title);
        peopleInfo.appendChild(desc);
        peopleInfo.appendChild(url);
        if (obj.hasOwnProperty('listingimage'))
        {
            let image = document.createElement("img");
            image.src = obj.listingimage.url;
            peopleImage.appendChild(image);
        }
        
        people.appendChild(peopleInfo);
        people.appendChild(peopleImage);
        peopleHolder.appendChild(people);
    }
}

function getPlacesData()
{
    let spinner = document.createElement("div");
    spinner.setAttribute("class", "lds-dual-ring");
    let placesHolder = document.getElementById("places");
    placesHolder.appendChild(spinner);
    let baseURL = "https://developer.nps.gov/api/v1/places?";
    baseURL += "parkCode=" + parkCode + "&";
    baseURL += apiKey;
    let request = new XMLHttpRequest();
    request.open('GET', baseURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        console.log("Loaded places");
        placesHolder.removeChild(spinner);
        let placesData = request.response.data;
        if (request.response.total == 0)
        {
            placesHolder.innerText = "No content available.";
        }else{
            displayPlacesData(placesData);
        }
    }
}

function displayPlacesData(placesData)
{
    let placesHolder = document.getElementById("places");
    for (let i = 0; i < placesData.length; i++)
    {
        let obj = placesData[i];

        let places = document.createElement("div");
        places.setAttribute("class", "places-row");
        let placesInfo = document.createElement("div");
        placesInfo.setAttribute("class", "places-info");
        let placesImage = document.createElement("div");
        placesImage.setAttribute("class", "places-image");

        let title = document.createElement("h6");
        title.appendChild(document.createTextNode(obj.title));

        let desc = document.createElement("p");
        desc.appendChild(document.createTextNode(obj.listingdescription));

        let url = document.createElement("button");
        url.setAttribute("onclick", "location.href='" + obj.url + "'");
        url.appendChild(document.createTextNode("Read"));
        
        placesInfo.appendChild(title);
        placesInfo.appendChild(desc);
        placesInfo.appendChild(url);
        if (obj.hasOwnProperty('listingimage'))
        {
            let image = document.createElement("img");
            image.src = obj.listingimage.url;
            placesImage.appendChild(image);
        }
        
        places.appendChild(placesInfo);
        places.appendChild(placesImage);
        placesHolder.appendChild(places);
    }
}

function getLessonData()
{
    let spinner = document.createElement("div");
    spinner.setAttribute("class", "lds-dual-ring");
    let lessonHolder = document.getElementById("lessonPlans");
    lessonHolder.appendChild(spinner);
    let baseURL = "https://developer.nps.gov/api/v1/lessonplans?";
    baseURL += "parkCode=" + parkCode + "&";
    baseURL += apiKey;
    let request = new XMLHttpRequest();
    request.open('GET', baseURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        console.log("Loaded Lesson Plans");
        lessonHolder.removeChild(spinner);
        let lessonData = request.response.data;
        if (request.response.total == 0)
        {
            lessonHolder.innerText = "No content available.";
        }else{
            displayLessonData(lessonData);
        }
    }
}

function displayLessonData(lessonData)
{
    let lessonHolder = document.getElementById("lessonPlans");
    for (let i = 0; i < lessonData.length; i++)
    {
        let obj = lessonData[i];

        let lesson = document.createElement("div");
        lesson.setAttribute("class", "lesson-row");
        let lessonInfo = document.createElement("div");
        lessonInfo.setAttribute("class", "lesson-info");
        let lessonStandards = document.createElement("div");
        lessonStandards.setAttribute("class", "lesson-standards");

        let title = document.createElement("h6");
        title.innerText = obj.title;

        let duration = document.createElement("p");
        duration.style.fontStyle = "italic";
        duration.innerText = obj.duration;

        let subject = document.createElement("p");
        subject.innerText = obj.subject;
        subject.style.fontWeight = "bold";

        let grade = document.createElement("p");
        grade.innerText = obj.gradelevel;
        grade.style.fontWeight = "bold";

        
        let desc = document.createElement("p");
        desc.innerText = obj.questionobjective;

        let url = document.createElement("button");
        url.setAttribute("onclick", "location.href='" + obj.url + "'");
        url.appendChild(document.createTextNode("Download"));

        lessonStandards.appendChild(document.createElement("br"));
        let ELA = document.createElement("p");
        ELA.style.fontWeight = "bold";
        ELA.innerText = "Common Core ELA Standards";
        obj = obj.commoncore;
        let ELAstandards = document.createElement("p");
        for (let j = 0; j < obj.elastandards.length; j++)
        {
            ELAstandards.innerText += obj.elastandards[j];
            if (j != obj.elastandards.length - 1)
            {
                ELAstandards.innerText += ", ";
            }
        }

        let math = document.createElement("p");
        math.style.fontWeight = "bold";
        math.innerText = "Common Core Mathematics Standards";

        let mathStandards = document.createElement("p");
        for (let j = 0; j < obj.mathstandards.length; j++)
        {
            mathStandards.innerText += obj.mathstandards[j];
            if (j != obj.mathstandards.length - 1)
            {
                mathStandards.innerText += ", ";
            }
        }

        lessonInfo.appendChild(title);
        lessonInfo.appendChild(duration);
        lessonInfo.appendChild(grade);
        lessonInfo.appendChild(subject);
        lessonInfo.appendChild(desc);
        lessonInfo.appendChild(url);

        lessonStandards.appendChild(ELA);
        lessonStandards.appendChild(ELAstandards);
        lessonStandards.appendChild(math);
        lessonStandards.appendChild(mathStandards);

        lesson.appendChild(lessonInfo);
        lesson.appendChild(lessonStandards);
        lessonHolder.appendChild(lesson);
    }
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