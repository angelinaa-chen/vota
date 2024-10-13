from flask import Flask, jsonify, session, request,  render_template
import json
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

load_dotenv()
api_key = os.getenv("CONGRESS_API_KEY")
app.secret_key = os.urandom(64)

# @app.route('/get_member/<state>', methods = ['GET'])
# def get_member(state):
#   url = "https://api.congress.gov/v3/member"
    
#     # Construct the URL with the state code and API key
#   response = requests.get(f"{url}?stateCode={state}&api_key={api_key}")

#   #response = requests.get(url)
#   #response = requests.get(f"{url}&stateCode={state}&api_key={api_key}")
    
#   # Check if the request was successful
#   if response.status_code == 200:
#       # Parse and return the JSON response
#       data = response.json()  # Assuming the API returns a JSON response
#       return jsonify(data)
#   else:
#       # Return an error message if the request failed
#       return jsonify({"error": "Failed to fetch data", "status": response.status_code}), response.status_code

@app.route('/get_member/<state>', methods=['GET'])
def get_member(state):
    url = "https://api.congress.gov/v3/member/"
    
    # Construct the URL with the state code and API key
    response = requests.get(f"{url}{state}?api_key={api_key}")
    
  # Check if the request was successful
    if response.status_code == 200:
        # Parse and return the JSON response
        data = response.json()  # Assuming the API returns a JSON response
        return jsonify(data)
    else:
        # Return an error message if the request failed
        return jsonify({"error": "Failed to fetch data", "status": response.status_code}), response.status_code

#returns state abbreviation given a state name
def get_state_abbreviation(state_name):
  state_abbreviations = {
      "Alabama": "AL",
      "Alaska": "AK",
      "Arizona": "AZ",
      "Arkansas": "AR",
      "California": "CA",
      "Colorado": "CO",
      "Connecticut": "CT",
      "Delaware": "DE",
      "Florida": "FL",
      "Georgia": "GA",
      "Hawaii": "HI",
      "Idaho": "ID",
      "Illinois": "IL",
      "Indiana": "IN",
      "Iowa": "IA",
      "Kansas": "KS",
      "Kentucky": "KY",
      "Louisiana": "LA",
      "Maine": "ME",
      "Maryland": "MD",
      "Massachusetts": "MA",
      "Michigan": "MI",
      "Minnesota": "MN",
      "Mississippi": "MS",
      "Missouri": "MO",
      "Montana": "MT",
      "Nebraska": "NE",
      "Nevada": "NV",
      "New Hampshire": "NH",
      "New Jersey": "NJ",
      "New Mexico": "NM",
      "New York": "NY",
      "North Carolina": "NC",
      "North Dakota": "ND",
      "Ohio": "OH",
      "Oklahoma": "OK",
      "Oregon": "OR",
      "Pennsylvania": "PA",
      "Rhode Island": "RI",
      "South Carolina": "SC",
      "South Dakota": "SD",
      "Tennessee": "TN",
      "Texas": "TX",
      "Utah": "UT",
      "Vermont": "VT",
      "Virginia": "VA",
      "Washington": "WA",
      "West Virginia": "WV",
      "Wisconsin": "WI",
      "Wyoming": "WY"
  }
  state_name = state_name.strip().title()
  return state_abbreviations.get(state_name, "Unknown State")
    



#helper function for get_jurisdictions
def get_jurisdiction(response):
  if response.status_code == 200:
        data = response.json()
        # Return names of jurisdictions that have classification = "state"
        return [result['name'] for result in data['results']]
  else:
      print(f"Error: {response.status_code} - {response.text}")
      return []  # Return an empty list if there's an error
  
#returns list of all states - will convert so that it returns a jurisdiction id that can then be used to search the API for other information
@app.route("/jurisdictions")
def get_jurisdictions():
  url="https://v3.openstates.org/jurisdictions?apikey=apikey"
  jurisdictions = []
  headers = {
    "X-API-KEY": api_key  # Authentication
  }

  classification = request.args.get('classification', 'state')  # Default to 'state'
  # page = request.args.get('page', 1)  # Default to page 1

  for page in range(1,35):  
    response = requests.get(f"{url}&page={page}&classification={classification}", headers=headers)
    result = get_jurisdiction(response)  # Get jurisdiction names

    if result != []:  # Only extend if result is not empty
        jurisdictions.extend(result)  # Aggregate results

  return jsonify(jurisdictions)
  
#returns list of candidates for a given state 
  #call jurisdictions, iterate through its json of states, match to get the id
@app.route("/candidates/<state>", methods=['GET'] )
def get_candidates(state):
  url="https://v3.openstates.org/people?apikey=apikey"
  headers = {
    "X-API-KEY": api_key  # Authentication
  }

  # Call the jurisdictions API to get the state data
  state_jurisdictions = get_jurisdictions()   # This assumes you have a function to get jurisdictions

  if state_jurisdictions.status_code != 200:
    return jsonify({"error": "Failed to fetch jurisdictions", "status": state_jurisdictions.status_code}), state_jurisdictions.status_code
 
  jurisdictions_data = state_jurisdictions.get_json()

  for jurisdiction in jurisdictions_data:
        # Check if the jurisdiction name matches the state (case insensitive)
        if jurisdiction['name'].lower() == state.lower():
            jurisdiction_id = jurisdiction['id']  # Get the jurisdiction ID

            # Request candidates for the matched jurisdiction
            response = requests.get(f"{url}&jurisdiction={jurisdiction_id}", headers=headers)

            # Check if the response was successful
            if response.status_code == 200:
                candidates_data = response.json()  # Extract JSON from the response
                return jsonify(candidates_data['results'])  # Return the list of candidates

            # Handle errors if the API call fails
            return jsonify({"error": "Failed to fetch candidates", "status": response.status_code}), response.status_code

    # Return an error if the state is not found
  return jsonify({"error": "State not found"}), 404

# Define a route
@app.route('/')
def home():
    return render_template('App.js')

#testing input output - GET works!
@app.route('/welcome/<location>', methods=['GET']) #eventually change input method to one of those start typing then select one of the options
def welcome(name):
    return jsonify(message=f"Location: {name}!")

@app.route('/submit', methods=['POST'])
def submit():
   data = request.get_json()
   name = data.get('location')
   return name

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
