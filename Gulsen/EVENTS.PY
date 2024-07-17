import requests
import json
import pandas as pd
from config import API_KEY

params = {
    'term': 'tourist attractions',
    'location': 'Honolulu, HI',
    'limit': 50,
    'radius': 8000  # in meters
}
headers = {
    'Authorization': f'Bearer {API_KEY}'
}

base_url = "https://api.yelp.com/v3/businesses/search"

response = requests.get(base_url, headers=headers, params=params)
data = response.json()

names = []
types = []
addresses = []
distances = []
lats = []
longs = []
ratings = []
prices = []

for business in data.get('businesses', []):
    try:
        name = business["name"]
        type = business['categories'][0]['title'] if business['categories'] else "N/A"
        address = business["location"]["address1"]
        distance = business.get("distance", "N/A")
        lat = business["coordinates"]["latitude"]
        long = business["coordinates"]["longitude"]
        rating = business.get("rating", "N/A")
        price = business.get("price", "N/A")
    except (KeyError, IndexError):
        type = "N/A"
        
    names.append(name)
    types.append(type)
    addresses.append(address)
    distances.append(distance)
    lats.append(lat)
    longs.append(long)
    ratings.append(rating)
    prices.append(price)



