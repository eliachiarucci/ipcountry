const codeGet = () => `
const request = await fetch('https://api.ipcountry.dev/getCountryCode');
const response = await request.json();
`;
const codePost = (ip) => `
const request = await fetch('https://api.ipcountry.dev/getCountryCode', {
method: 'POST',
headers: {
  'Content-Type': 'application/json',
},
body: JSON.stringify({ ip: "${ip ? ip : "164.92.201.249"}" }),
});
const response = await request.json();
`;
const getResponse404 = `
{
  "error": "Could not get the country code."
}
`;
const getResponse429 = `
{
  "error": "Rate limit exceeded."
}
`;

const postResponse400 = `
{
  "error": "The provided IP address is not valid."
}
`;
const postResponse404 = `
{
  "error": "Could not get the country code for the IP provided."
}
`;
const postResponse429 = `
{
  "error": "Rate limit exceeded. please read the 'RateLimit-Limit' header to know when you can retry (in seconds)."
}
`;

const getHeaders = `
RateLimit-Limit: 10 // Number of requests allowed per window (5 seconds)
RateLimit-Remaining: 9 // Number of requests remaining
RateLimit-Reset: 1 // Number of seconds until the rate limit resets
`

const postHeaders = `
RateLimit-Limit: 50 // Number of requests allowed per window (5 seconds)
RateLimit-Remaining: 49 // Number of requests remaining
RateLimit-Reset: 5 // Number of seconds until the rate limit resets
`
export { getHeaders, postHeaders, codeGet, codePost, getResponse404, getResponse429, postResponse400, postResponse404, postResponse429 };
