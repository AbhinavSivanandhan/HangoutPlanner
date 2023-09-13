const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchLocation',
  params: { query: 'vellore' },
  headers: {
    'X-RapidAPI-Key': 'efd4f1c4aemsh05f87c1476124a9p14f0d6jsnda12da7e49d5',
    'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
  }
};

module.exports.searchRestaurantLocation = axios.request(options)
  .then(response => {
    // Check if the 'data' array is empty
    if (response.data.data.length === 0) {
      console.log("The 'data' array is empty.");
    }
    else{
      console.log(response.data);
      const locationId = response.data.data[0].locationId;
      console.log("Location ID:", locationId);
    }
  })
  .catch(error => {
    console.error(error);
  });
