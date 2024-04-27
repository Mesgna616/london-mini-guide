const express = require("express");
const app = express();
const cors = require("cors");
const redis = require('redis');
const dotenv = require("dotenv");
const path = require("path"); // Don't forget to import path module for resolving the .env file path

dotenv.config({ path: path.resolve(__dirname, ".env") });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a Redis client with specified options
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});


// Handle Redis connection errors
client.on("error", function (err) {
  console.error("Redis error:", err);
});


const harrow = require("./data/Harrow.json");
const heathrow = require("./data/Heathrow.json");
const stratford = require("./data/Stratford.json");

const AllAreas = { harrow, heathrow, stratford };
const AllArea = [harrow, heathrow, stratford];

const areas = ["harrow", "heathrow", "stratford"];

// Route to fetch pharmacies
app.get("/pharmacies", (req, res) => {
  // Check if pharmacies data is cached in Redis
  client.get('pharmacies', (err, cachedData) => {
    if (err) {
      console.error('Redis error:', err);
      // If there's an error with Redis, proceed without caching
      fetchAndSendPharmacies(res);
    } else if (cachedData) {
      // If data is cached, send it as the response
      res.send(JSON.parse(cachedData));
    } else {
      // If data is not cached, fetch it from the database
      fetchAndSendPharmacies(res);
    }
  });
});

// Function to fetch pharmacies from the database and cache the result
function fetchAndSendPharmacies(res) {
  let listOfPharmacies = [];
  AllArea.map((area) => {
    area.pharmacies.map((element) => listOfPharmacies.push(element));
  });

  // Cache the pharmacies data in Redis for future use
  client.setex('pharmacies', 3600, JSON.stringify(listOfPharmacies)); // Cache for 1 hour (3600 seconds)

  // Send the pharmacies data as the response
  res.send(listOfPharmacies);
}

app.get("/colleges", (req, res) => {
  listOfColleges = [];
  AllArea.map((area) => {
    area.colleges.map((element) => listOfColleges.push(element));
  });
  res.send(listOfColleges);
});

app.get("/doctors", (req, res) => {
  res.send(harrow.doctors.concat(heathrow.doctors).concat(stratford.doctors));
});

app.get("/hospitals", (req, res) => {
  res.send(
    harrow.hospitals.concat(heathrow.hospitals).concat(stratford.hospitals)
  );
});

app.get("/areas", (req, res) => {
  res.send(areas);
});
app.get("/areas/:area", (req, res) => {
  const area = req.params.area;
  res.send(AllAreas[area]);
});
app.get("/areas/:area/info", (req, res) => {
  const area = req.params.area;
  res.send(Object.keys(AllAreas[area]));
});

app.get("/areas/:area/pharmacies", (req, res) => {
  const area = req.params.area;
  res.send(AllAreas[area].pharmacies);
});

app.get("/areas/:area/doctors", (req, res) => {
  const area = req.params.area;
  res.send(AllAreas[area].doctors);
});

app.get("/areas/:area/hospitals", (req, res) => {
  const area = req.params.area;
  res.send(AllAreas[area].hospitals);
});

app.get("/areas/:area/colleges", (req, res) => {
  const area = req.params.area;
  res.send(AllAreas[area].colleges);
});

app.get("/", (req, res) => {
  res.send(`<div style="font-size:28px; line-height: 1.6" ; background-color:black><h2>London Mini Guide API!</h2> You can use:
              <ul> 
                <li><strong>/areas/:area</strong> to get all area guide e.g: /area/harrow</li>
                <li><strong>/area/pharmacies</strong> to get pharmacies data of selected area</li>
                <li><strong>/area/colleges</strong> to get colleges data of selected area</li>
                <li><strong>/area/doctors</strong> to get doctors data of selected area</li>
                <li><strong>/area/hospitals</strong> to get hospitals data of selected area</li>
                <li><strong>/pharmacies</strong> to get pharmacies data of London</li>
                <li><strong>/colleges</strong> to get colleges data of London</li>
                <li><strong>/doctors</strong> to get doctors data of London</li>
                <li><strong>/hospitals</strong> to get all hospitals data of London</li>
              </ul>
              <p>mesgna mehari Woldeab</p>
              </div>`) ;
         
});

const port = process.env.PORT|| 5100;
app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
