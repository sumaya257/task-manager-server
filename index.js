	const express = require('express');
	const cors = require('cors');
	const jwt = require('jsonwebtoken');
	const cookieParser = require('cookie-parser');
	require('dotenv').config();
    const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
    const morgan = require('morgan');

	const app = express();
    app.use(morgan('dev'));
	
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

    // Add a new user
    app.post("/added-user", async (req, res) => {
        const user = req.body;
        try {
            const result = await userCollection.insertOne(user);
            res.status(201).send(result);
          } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).send({ error: 'An error occurred while adding the user.' });
          }
        });

        // DELETE route to remove a user from the database
app.delete("/delete-user", async (req, res) => {
    const { uid } = req.body;  // Get UID from the request body
    try {
        // Delete the user from the collection based on their UID
        const result = await userCollection.deleteMany({ uid: uid });

        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ error: 'An error occurred while deleting the user.' });
    }
});

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

  //update-task

  app.put('/added-task/:id', async (req, res) => {
    const { id } = req.params;
    const updatedTask = req.body;

    // Remove `_id` from the update payload it cant be changed
    delete updatedTask._id;

    try {
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) }, // Filter by ID
        { $set: updatedTask }     // Update fields
      );

      if (result.matchedCount > 0) {
        res.status(200).send({ message: 'Task updated successfully!' });
      } else {
        res.status(404).send({ error: 'Task not found!' });
      }
    } catch (error) {
      console.error('Error updating:', error);
      res.status(500).send({ error: 'An error occurred while updating.' });
    }
  });

  //delete tasks api
    app.delete('/added-task/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
          res.status(200).send({ message: 'Task deleted successfully!' });
        } else {
          res.status(404).send({ error: 'Task not found!' });
        }
      } catch (error) {
        console.error('Error deleting:', error);
        res.status(500).send({ error: 'An error occurred while deleting.' });
      }
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
	
