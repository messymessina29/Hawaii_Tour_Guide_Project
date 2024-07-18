import json
import requests
from config import API_KEY

# Load the JSON file
with open('Resources/Hawaii_hotelsID.json', 'r') as file:
    hotels_data = json.load(file)

# Extract business IDs
business_ids = [hotel['Buisness_ID'] for hotel in hotels_data]
print("Business IDs:", business_ids)

# Function to make API call to get reviews
def get_reviews(business_id):
    url = f'https://api.yelp.com/v3/businesses/{business_id}/reviews'
    headers = {
        'Authorization': f'Bearer {API_KEY}'
    }
    
    params = {
        'business_id': business_ids,
        'limit': 50
    }

    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Make API calls for each business ID
all_reviews = {}
for business_id in business_ids:
    reviews = get_reviews(business_id)
    all_reviews[business_id] = reviews

# Save the reviews to a new JSON file
with open('Resources/Hawaii_hotels_reviews.json', 'w') as file:
    json.dump(all_reviews, file, indent=4)

print("Reviews data saved to 'Hawaii_hotels_reviews.json'")