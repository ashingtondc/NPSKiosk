let data;

function getData()
{
    let requestURL = "https://developer.nps.gov/api/v1/parks?";
    let apiKey = "api_key=wkSxIB6zEvqQeML5MiJwyulZzR0gegiZKOcmwxNc";
    let state = document.getElementById("state").value;
    if (state != "") //Filters by state if a state filter is selected
    {
        requestURL += "stateCode=" + state + "&"
    }
    requestURL += apiKey;
    
    let request = new XMLHttpRequest();
    console.log("got URL");
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        data = request.response;
        populateData();
    }
}

function populateData()
{
    let section = document.getElementById("info");
    let paraData = document.createElement("p");
    //let numResults = Number(data['total']);

    for (let i = 0; i < data['data'].length; i++)
    {
        let entry = data['data'][i];
        if (entry.hasOwnProperty('fullName'))
        {
            paraData.appendChild(document.createTextNode(entry['fullName']));
            paraData.appendChild(document.createElement("br"));
        }
        
    }

    section.replaceChild(paraData, section.children[0]);
}
