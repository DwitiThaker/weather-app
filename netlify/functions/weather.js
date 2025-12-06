export async function handler(event) {
  const { location } = event.queryStringParameters;
  const API_KEY = process.env.VISUALCROSSING_KEY;

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
    location
  )}?unitGroup=metric&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
