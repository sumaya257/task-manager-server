	const express = require('express');
	const cors = require('cors');
	const jwt = require('jsonwebtoken');
	const cookieParser = require('cookie-parser');
	require('dotenv').config();
    const { MongoClient, ServerApiVersion } = require('mongodb');

	const app = express();
	
	const port = process.env.PORT || 5000;
	
	//middleware
    // cookie parser middleware
	app.use(cookieParser());
	app.use(express.json());
	app.use(cors());

    
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ju1bs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Access the collections
    const userCollection = client.db('TaskManager').collection('users');
    const taskCollection = client.db('TaskManager').collection('tasks');

    // Add a new task
    app.post("/added-task", async (req, res) => {
    const task = req.body;
    try {
        const result = await taskCollection.insertOne(task);
        res.status(201).send(result);
      } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).send({ error: 'An error occurred while adding the task.' });
      }
    });

    // Get All Tasks API
    app.get("/added-task", async (req, res) => {
    const tasks = await taskCollection.find().toArray();
    res.send(tasks);
  });
  

    
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

	
	app.get('/', (req, res) => {
	res.send('Hello from my server')
	})
	
	app.listen(port, () => {
	    console.log('My simple server is running at', port);
	})
	
