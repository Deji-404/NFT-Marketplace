const express = require('express');
const app = express();
const axios = require("axios");
const { data } = require('autoprefixer');

app.get('/', (req, res) => {
    res.send('Welcome to CORS server 😁')
})
app.get('/cors/:tokenUri', async (req, res) => {
    const { tokenUri } = req.params;
    res.set('Access-Control-Allow-Origin', '*');
    url = `https://ipfs.io/ipfs/${tokenUri}`;
    let data1 = await axios.get(url)
    data1 = data1.data
    console.log(data1)
    res.send({ "msg": "This has CORS enabled 🎈", "data": data1})

})
app.listen(8080, () => {
    console.log('listening on port 8080')
})