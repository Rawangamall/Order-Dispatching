const https = require('https');

const options = {
  hostname: 'jimmy.nader-mo.tech',
  path: '/orders/recieve',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const data = {
    "_id": "60c530490b7f4d00124f0d01",
    "CustomerID": "60c1a236a2e8e75f5cfc47fb",
    "CustomerName": "amiraa",
    "CustomerEmail": "amira1500@example.com",
    "Address": {
      "Governate": "Gharbia",
      "City": "Zifta",
      "Area": "Test1"
    },
    "Product": [
      {
        "ItemCode": 4,
        "ItemName": "Product 1",
        "Price": 10,
        "Quantity": 2
      },
      {
        "ItemCode": 11,
        "ItemName":" Product 2",
        "Price": 20,
        "Quantity": 1
      }
    ],
    "PaymentMethod": "cash",
      "TotalPrice": 40 
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

});

req.on('error', (error) => {
  console.error(error);
});

req.write(JSON.stringify(data));
req.end();
