let data;

function getData()
{
    let requestURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + document.getElementById("state").value + "&api_key=wkSxIB6zEvqQeML5MiJwyulZzR0gegiZKOcmwxNc";
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
    let numResults = Number(data['total']);

    for (let i = 0; i < numResults; i++)
    {
        let entry = data['data'][i];
        paraData.appendChild(document.createTextNode(entry['fullName']));
        paraData.appendChild(document.createElement("br"));
    }

    section.replaceChild(paraData, section.children[0]);
}
