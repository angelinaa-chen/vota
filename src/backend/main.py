from flask import Flask, jsonify, session, request,  render_template
import json
import requests
import os
from dotenv import load_dotenv

# Initialize the Flask app
app = Flask(__name__)

load_dotenv()
api_key = os.getenv("OPENSTATES_API_KEY")
app.secret_key = os.urandom(64)

def get_jurisdiction(response):
  if response.status_code == 200:
        data = response.json()
        # Return names of jurisdictions that have classification = "state"
        return [result['name'] for result in data['results']]
  else:
      print(f"Error: {response.status_code} - {response.text}")
      return []  # Return an empty list if there's an error
  
#returns response
def get_id(response):
  if response.status_code == 200:
      data = response.json()
      return [result['id'] for result in data['results']]
  else:
    print(f"Error: {response.status_code} - {response.text}")
    return []  # Return an empty list if there's an error
  
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
  
  
  #return requests.get(f"{url}&jurisdiction={state}", headers=headers)
  # for x in range(len(state_json)) :
  #    jurisdiction = state_json[x]
  #    if jurisdiction == state:
  #       return requests.get(f"{url}&jurisdiction={jurisdiction}", headers=headers)
  #    else:
  #       return jsonify({"error1": "State not found"}), 404  # Return a 404 error if the state is not found
  # return jsonify({"error2": "State not found"}), 404  # Return a 404 error if the state is not found
  # return jsonify(state)

#if the current string is the equivalent to the inputed state, call the api to return the candidates
  # for jurisdiction in state_json:
  #   # Ensure to access the correct field to compare with the state
  #   if jurisdiction['name'].lower() == state.lower():
  #       # Use the jurisdiction id for the candidates request
  #       jurisdiction_id = jurisdiction['id']  
  #       response = requests.get(f"{url}&jurisdiction={jurisdiction_id}", headers=headers)

  #       # Check the response status
  #       if response.status_code == 200:
  #           candidates_data = response.json()  # Extract the JSON from the response
  #           return jsonify(candidates_data['results'])  # Assuming candidates are in 'results' key
  #       else:
  #           return jsonify({"error": "Failed to fetch candidates", "status": response.status_code}), response.status_code

  #   return jsonify({"error": "State not found"}), 404  # Return a 404 error if the state is not found


  # for jurisdiction in state_json:
  #   if jurisdiction.lower() == state.lower():
  #       #return candidates.append(jurisdiction)
  #       response = requests.get(f"{url}&jurisdiction={jurisdiction}")
  #       # candidates.extend(response)
  #       if response.status_code == 200:
  #         return jsonify(response)  # Extract the JSON from the response
  #         # candidates.extend(candidates_data['results'])  # Assuming candidates are in 'results' key
  #       else:
  #         return jsonify({"error": "Failed to fetch candidates1", "status": response.status_code}), response.status_code
  # return jsonify({"error": "Failed to fetch candidates2", "status": response.status_code}), response.status_code

  # if candidates:
  #     return jsonify(candidates)  # Return a JSON response
  # else:
  #     return jsonify({"error": "State not found"}), 404

  # id = ""
  # state_json = get_jurisdictions()
  # return print(state_json)
  # for result in state_json:
  #   if (result['name'] == state):
  #     id = result['id']
  # #id = get_id(juris_id)  # Get id of the jurisdiction

  # if id != "":  # Only extend if result is not empty
  #   response = requests.get(f"{url}&jurisdiction={id}", headers=headers)
  #   candidates.extend(response)  # Aggregate results

  # return jsonify(candidates)

# Define a route
@app.route('/')
def home():
    return render_template('App.js')

#testing input output - GET works!
@app.route('/welcome/<location>', methods=['GET']) #eventually change input method to one of those start typing then select one of the options
def welcome(name):
    return jsonify(message=f"Location: {name}!")

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
