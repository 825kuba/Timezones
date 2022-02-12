const axios = require('axios');

const handler = async event => {
  // GET API KEY FROM .ENV
  const API_KEY = process.env.API_KEY;
  // CREATE URL VARIABLE
  let url;

  // CASE 1 - GOEPOSITION CALL
  // IF LAT OR LNG ARE PASSED, SET URL TO GEOPOSITION CALL
  if (event.queryStringParameters.lat || event.queryStringParameters.lng) {
    const { lat, lng } = event.queryStringParameters;
    url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`;
  }

  //CASE 2 - SEARCH BY NAME CALL
  //IF TIMEZONE NAME IS PASSED, SET URL TO SEARCH CALL
  else if (event.queryStringParameters.timezone) {
    const { timezone } = event.queryStringParameters;
    url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=zone&zone=${timezone}`;
  }

  //CASE 3 -GET LIST OF TIMEZONES
  //IF NOTHING IS PASSED, SET URL TO GET LIST OF ALL TIMEZONES CALL
  else
    url = `http://api.timezonedb.com/v2.1/list-time-zone?key=${API_KEY}&format=json`;

  //TRY MAKING CALL WITH AXIOS
  try {
    const { data } = await axios.get(url);

    // RETURN OBJECT
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

    // CATCH ERROR AND RETURN OBJECT
  } catch (error) {
    const { status, statusText, headers, data } = error.response;

    return {
      statusCode: status,
      body: JSON.stringify({ status, statusText, headers, data }),
    };
  }
};

module.exports = { handler };
