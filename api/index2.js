const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants',
  params: {
    locationId: '1152780'
  },
  headers: {
    'X-RapidAPI-Key': 'efd4f1c4aemsh05f87c1476124a9p14f0d6jsnda12da7e49d5',
    'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
  }
};

axios.request(options)
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
