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
api_key = os.getenv("OPENSTATES_API_KEY")
app.secret_key = os.urandom(64)

  
def get_json():
   return {
    "results": 
    [ 
      {"id": "ocd-person/adb58f21-f2fd-4830-85b6-f490b0867d14",
      "name": "Angela Augusta",
      "party": "Democratic",
      "current_role": {
        "title": "Senator",
        "org_classification": "upper",
        "district": 3,
        "division_id": "ocd-division/country:us/state:nc/sldu:3"
      }
    }]
  }

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
