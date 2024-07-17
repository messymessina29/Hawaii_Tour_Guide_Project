import requests
import json
from config import API_KEY

HEADERS = {'Authorization': f'Bearer {API_KEY}'}
SEARCH_URL = 'https://api.yelp.com/v3/businesses/search'

params = {
    'term': 'tourist attractions',
    'location': 'Waikiki, Honolulu, HI',
    'categories': 'active,arts',
    'limit': 50
}

response = requests.get(SEARCH_URL, headers=HEADERS, params=params)
data = response.json()

touristic_activities = []
for business in data['businesses']:
    activity = {
        'Name': business['name'],
        'Type': business['categories'][0]['title'] if business['categories'] else 'N/A',
        'Address': ', '.join(business['location']['display_address']),
        'Latitude': business['coordinates']['latitude'],
        'Longitude': business['coordinates']['longitude'],
        'Rating': business.get('rating', 'N/A'),
        'Review_Count': business.get('review_count', 'N/A'),
        'Price': business.get('price', 'N/A')
    }
    touristic_activities.append(activity)

with open('touristic_activities.json', 'w') as f:
    json.dump(touristic_activities, f, indent=4)

print("Touristic activities data saved to 'touristic_activities.json'")
