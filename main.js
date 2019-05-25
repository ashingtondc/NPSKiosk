let NPSDesigs = [];
let currentPage = 0;
let requestURL = "https://developer.nps.gov/api/v1/parks?";
let apiKey = "api_key=wkSxIB6zEvqQeML5MiJwyulZzR0gegiZKOcmwxNc";
let limit = 50;
let data;
let totalPages = 1;

document.getElementById("back").style.display = "none"; //Hides previous button
document.getElementById("forward").style.display = "none"; //Hides mext button


function getData()
{
    document.getElementById("back").style.display = "none"; //Hides previous button
    document.getElementById("forward").style.display = "none"; //Hides mext button

    requestURL = "https://developer.nps.gov/api/v1/parks?"; //reset base URL for each new call
    let state = document.getElementById("state").value;
    if (state != "") //Filters by state if a state filter is selected
    {
        requestURL += "stateCode=" + state + "&";
    }
    let desig = document.getElementById("desig").value;
    if (desig != "" && desig != "other")
    {
        requestURL += "q=" + desig + "&";
    }
    //requestURL += apiKey;

    let request = new XMLHttpRequest();
    console.log("got URL");
    console.log(requestURL + apiKey);
    request.open('GET', requestURL + apiKey);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        console.log("Loaded");
        data = request.response;
        totalPages = Math.ceil(request.response['total']/limit); // numLoops is set to the number of requests needed to get all the data
        console.log(totalPages);
        if (totalPages == 1)
        {
            document.getElementById("forward").style.display = "none";
        }else{
            document.getElementById("forward").style.display = "block";
        }

        populateData()
    }
    
}

function nextPage()
{
    currentPage++
    document.getElementById("back").style.display = "block";
    if(currentPage == totalPages - 1)
    {
        document.getElementById("forward").style.display = "none";
    }else{
        document.getElementById("forward").style.display = "block";
    }
    changePage();
}

function previousPage()
{
    currentPage--;
    document.getElementById("forward").style.display = "block";
    if(currentPage == 0)
    {
        document.getElementById("back").style.display = "none";
    }else{
        document.getElementById("back").style.display = "block";
    }
    changePage();
}

function changePage()
{
    let start = currentPage*limit;
    let URLDataBegin = "start=" + start + "&"

    let request = new XMLHttpRequest();
    request.open('GET', requestURL + URLDataBegin + apiKey);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        data = request.response;
        populateData()
    }
}

function populateData()
{
    let section = document.getElementById("info");
    let paraData = document.createElement("p");
    let desig = document.getElementById("desig").value;

    for (let i = 0; i < data['data'].length; i++)
    {
        let entry = data['data'][i];
        paraData.appendChild(document.createTextNode(entry['fullName']));
        paraData.appendChild(document.createElement("br"));
        
    }
    section.replaceChild(paraData, section.children[0]);
}
