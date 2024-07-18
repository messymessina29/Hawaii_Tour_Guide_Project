import requests
import json
from config import API_KEY

HEADERS = {'Authorization': f'Bearer {API_KEY}'}
SEARCH_URL = 'https://api.yelp.com/v3/businesses/search'

params = {
    'term': 'hotels',
    'location': 'Waikiki, Honolulu, HI',
    'price': '1,2,3,4',
    'sort_by': 'rating',
    'limit': 50
}

response = requests.get(SEARCH_URL, headers=HEADERS, params=params)
data = response.json()

Hawaii_hotels = []
for hotel in data["businesses"]:
    activity = {
        'Name': hotel['name'],
        'Price': hotel['price'],
        'Address': ', '.join(hotel['location']['display_address']),
        'Latitude': hotel['coordinates']['latitude'],
        'Longitude': hotel['coordinates']['longitude'],
        'Image_url': hotel['image_url'],
        'Rating': hotel.get('rating', 'N/A'),
        'Review_Count': hotel.get('review_count', 'N/A'),
        'Buisness_ID': hotel['id']
    }
    Hawaii_hotels.append(activity)

with open('Hawaii_hotels.json', 'w') as f:
    json.dump(Hawaii_hotels, f, indent=4)

print("Hawaii Hotels data saved to 'Hawaii_hotels.json'")
