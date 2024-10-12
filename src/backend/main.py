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
url="https://v3.openstates.org/jurisdictions?apikey=apikey"

def get_jurisdiction(response):
  if response.status_code == 200:
        data = response.json()
        # Return names of jurisdictions that have classification = "municipality"
        return [result['name'] for result in data['results'] if result.get('classification') == "state"]
  else:
      print(f"Error: {response.status_code} - {response.text}")
      return []  # Return an empty list if there's an error


#returns list of all states - will convert so that it returns a jurisdiction id that can then be used to search the API for other information
@app.route("/jurisdictions")
def get_jurisdictions():
  jurisdictions = []
  url="https://v3.openstates.org/jurisdictions?apikey=apikey"
  headers = {
    "X-API-KEY": api_key  # Authentication
  }

  classification = request.args.get('classification', 'state')  # Default to 'state'
  page = request.args.get('page', 1)  # Default to page 1

  for page in range(1,35):  
    response = requests.get(f"{url}&page={page}&classification={classification}", headers=headers)
    result = get_jurisdiction(response)  # Get jurisdiction names

    if result != []:  # Only extend if result is not empty
        jurisdictions.extend(result)  # Aggregate results

  return jsonify(jurisdictions)


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
