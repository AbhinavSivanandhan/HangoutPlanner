const axios = require('axios');

const searchLocationOptions = {
  method: 'GET',
  url: 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchLocation',
  params: { query: 'vellore' },
  headers: {
    'X-RapidAPI-Key': 'efd4f1c4aemsh05f87c1476124a9p14f0d6jsnda12da7e49d5',
    'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
  }
};

axios.request(searchLocationOptions)
  .then(response => {
    // Check if the 'data' array is empty
    if (response.data.data.length === 0) {
      console.log("The 'data' array is empty.");
    } else {
      const locationId = response.data.data[0].locationId;
      const searchRestaurantOptions = {
        method: 'GET',
        url: 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants',
        params: { locationId: locationId },
        headers: {
          'X-RapidAPI-Key': 'efd4f1c4aemsh05f87c1476124a9p14f0d6jsnda12da7e49d5',
          'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
        }
      };

      return axios.request(searchRestaurantOptions);
    }
  })
  .then(response => {
    // Check if the 'data' array is empty
    if (response.data.data.data.length === 0) {
      console.log("The 'data' array is empty.");
    } else {
      console.log(response.data);
      // Print the values of the first three objects
      const firstThreeObjects = response.data.data.data.slice(0, 3);
      firstThreeObjects.forEach(object => {
        console.log(object);
      });
    }
  })
  .catch(error => {
    console.error(error);
  });
