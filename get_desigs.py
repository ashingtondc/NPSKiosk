import json
import requests
import math

base_url = "https://developer.nps.gov/api/v1/parks?"
api_key = "api_key=wkSxIB6zEvqQeML5MiJwyulZzR0gegiZKOcmwxNc"
current_page = 0
limit = 50
totalPages = 1

def main():
    designations = {}
    api_call(designations)
    keys = designations.keys()
    print(len(keys))
    #for key in keys:
     #   print(key)

    json_format = json.dumps(designations, indent=4, sort_keys=True)
    print(json_format)
    with open('designations.json', 'w') as json_file:
        json.dump(designations, json_file, indent=4, sort_keys=True)

def api_call(designations):
    global current_page
    global totalPages

    while(current_page < totalPages):
        page_url = "start=" + str(current_page*limit) + "&"
        resp = requests.get(base_url + page_url + api_key)
        if resp.status_code != 200:
            raise Exception('GET /parks/ {}'.format(resp.status_code))
        totalPages = math.ceil(int(resp.json()['total'])/limit)
        print("Loaded request.")
        for item in resp.json()['data']:
            desig = item['designation']
            if (desig not in designations):
                designations[desig] = 1
            else:
                designations[desig] += 1
        current_page += 1

if __name__ == "__main__":
    main()