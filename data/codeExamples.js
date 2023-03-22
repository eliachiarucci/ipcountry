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

export { codeGet, codePost };