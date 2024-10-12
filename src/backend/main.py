from flask import Flask, jsonify, session, request
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
@app.route("/candidates/<state>")
def get_candidates(state):
  candidates = []
  url="https://v3.openstates.org/people?apikey=apikey"
  headers = {
    "X-API-KEY": api_key  # Authentication
  }
  state_json = get_jurisdictions().get_json()

  for jurisdiction in state_json:
        if jurisdiction.lower() == state.lower():
            # Do something here, for example, add the state to the candidates list
            return candidates.append(jurisdiction)

  if candidates:
      return jsonify(candidates)  # Return a JSON response
  else:
      return jsonify({"error": "State not found"}), 404

  
  
  id = ""
  state_json = get_jurisdictions()
  return print(state_json)
  for result in state_json:
    if (result['name'] == state):
      id = result['id']
  #id = get_id(juris_id)  # Get id of the jurisdiction

  if id != "":  # Only extend if result is not empty
    response = requests.get(f"{url}&jurisdiction={id}", headers=headers)
    candidates.extend(response)  # Aggregate results

  return jsonify(candidates)

# Define a route
@app.route('/')
def home():
    return "Hello, Flask!"

#testing input output - GET works!
@app.route('/welcome/<location>', methods=['GET']) #eventually change input method to one of those start typing then select one of the options
def welcome(name):
    return jsonify(message=f"Location: {name}!")

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
