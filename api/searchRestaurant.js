const axios = require('axios');

async function searchRestaurantsByLocation(query) {
  try {
    const searchLocationOptions = {
      method: 'GET',
      url: 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchLocation',
      params: { query: query },
      headers: {
        'X-RapidAPI-Key': 'efd4f1c4aemsh05f87c1476124a9p14f0d6jsnda12da7e49d5',
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    };

    const locationResponse = await axios.request(searchLocationOptions);

    // Check if the 'data' array is empty
    if (locationResponse.data.data.length === 0) {
      console.log("The 'data' array is empty.");
      return;
    }

    const locationId = locationResponse.data.data[0].locationId;

    const searchRestaurantOptions = {
      method: 'GET',
      url: 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants',
      params: { locationId: locationId },
      headers: {
        'X-RapidAPI-Key': 'efd4f1c4aemsh05f87c1476124a9p14f0d6jsnda12da7e49d5',
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    };

    const restaurantResponse = await axios.request(searchRestaurantOptions);

    // Check if the 'data' array is empty
    if (restaurantResponse.data.data.data.length === 0) {
      console.log("The 'data' array is empty.");
      return;
    }

    console.log(restaurantResponse.data);

    // Print the values of the first three objects
    const firstThreeObjects = restaurantResponse.data.data.data.slice(0, 3);
    firstThreeObjects.forEach(object => {
      console.log(object);
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = searchRestaurantsByLocation;
