let NPSDesigs = [];
let filteredData = [];
let currentPage = 0;
let requestURL = "https://developer.nps.gov/api/v1/parks?";
let apiKey = "api_key=wkSxIB6zEvqQeML5MiJwyulZzR0gegiZKOcmwxNc";
let limit = 50;
let totalPages = 1;

function processFields()
{
    let state = document.getElementById("state").value;
    let desig = document.getElementById("desig").value;
    if (state == "" && desig == "")
    {
        window.alert("Please enter at least one search criteria.")
    }else{
        getData();
    }
}

function getData() // Initial API Request
{
    currentPage = 0; //Reset page numbers
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
        let data = request.response;
        totalPages = Math.ceil(request.response['total']/limit); // totalPages is set to the number of requests needed to get all the data
        console.log(totalPages);
        if (desig != "")
        {
            designationFilter(desig, data.data);
        }else{
            if (totalPages == 1)
            {
                document.getElementById("forward").style.display = "none";
            }else{
                document.getElementById("forward").style.display = "inline";
            }
            populateData(data.data)
        }
    }
    
}

function designationFilter(desig, data)
{
    console.log("Called designationFilter()");
    if (desig == "other")
    {
        designationFilterOther(data);
    }else{
        for (let entry of data)
        {
            if (entry.designation.includes(desig))
            {
                filteredData.push(entry);
            }
        }
        currentPage++;
        if (currentPage < totalPages){
            console.log("Making another API call.");
            desigRequest(desig);
        }else{
            currentPage = 0;
            totalPages = 1;
            populateData(filteredData);
        }
    }
}

function designationFilterOther(data)
{

}

function desigRequest(desig) //Requests more results for designation filter
{
    let start = currentPage*limit;
    let URLDataBegin = "start=" + start + "&"

    let request = new XMLHttpRequest();
    request.open('GET', requestURL + URLDataBegin + apiKey);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        let data = request.response;
        console.log("desigRequest(): Total Items: " + data.total);
        designationFilter(desig, data.data);
    }
}

function nextPage() //Handles going to the next page of data
{
    currentPage++
    document.getElementById("back").style.display = "inline";
    if(currentPage == totalPages - 1)
    {
        document.getElementById("forward").style.display = "none";
    }else{
        document.getElementById("forward").style.display = "inline";
    }
    changePage();
}

function previousPage() //Handles going to the previous page of data
{
    currentPage--;
    document.getElementById("forward").style.display = "inline";
    if(currentPage == 0)
    {
        document.getElementById("back").style.display = "none";
    }else{
        document.getElementById("back").style.display = "inline";
    }
    changePage();
}

function changePage() //Gets an iteration of the current API request based on the current page number
{
    let start = currentPage*limit;
    let URLDataBegin = "start=" + start + "&"

    let request = new XMLHttpRequest();
    request.open('GET', requestURL + URLDataBegin + apiKey);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        let data = request.response;
        populateData(data.data)
    }
}

function populateData(data) // Displays data from the current API Request
{
    let section = document.getElementById("info");
    let paraData = document.createElement("p");
    let pageNumDiv = document.getElementById("pgCounter");
    let pageNum = document.createElement("p");
    let desig = document.getElementById("desig").value;

    for (let i = 0; i < data.length; i++)
    {
        let entry = data[i];
        paraData.appendChild(document.createTextNode(entry['fullName']));
        paraData.appendChild(document.createElement("br"));
        
    }
    pageNum.appendChild(document.createTextNode("Page " + (currentPage + 1) + " of " + totalPages));
    pageNumDiv.replaceChild(pageNum, pageNumDiv.children[0]);
    section.replaceChild(paraData, section.children[0]);
    filteredData = [];
}
