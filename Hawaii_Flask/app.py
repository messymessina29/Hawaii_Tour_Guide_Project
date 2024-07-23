from flask import Flask, render_template, jsonify
import requests
import json
from datetime import datetime, timedelta

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>Home Page would be here</h1>'

@app.route('/live')
def live():
    return render_template('index_flask.html')

@app.route('/restaurant')
def restaurant():
    return render_template('map_test_index.html')

@app.route('/yelp')
def yelp():
    return render_template('miamap_index.html')

@app.route('/hotel')
def hotel():
    return render_template('test2ndpage_index.html')

@app.route('/fetch-events', methods=['GET'])
def fetch_events():
    api_key = 'WckojuMX77PpOVp9exwqrjxtwh6ec1G0'
    state_code = 'HI'
    country_code = 'US'

    today = datetime.utcnow()
    end_date = today + timedelta(days=14)

    start_date_time = today.strftime('%Y-%m-%dT%H:%M:%SZ')
    end_date_time = end_date.strftime('%Y-%m-%dT%H:%M:%SZ')

    url = 'https://app.ticketmaster.com/discovery/v2/events.json'
    params = {
        'apikey': api_key,
        'stateCode': state_code,
        'startDateTime': start_date_time,
        'endDateTime': end_date_time,
        'countryCode': country_code,
        'size': 50
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        events = response.json()
        return jsonify(events)
    else:
        return jsonify({'error': 'Error fetching events'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
