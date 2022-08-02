//Importing express module or package
const express = require('express');

//Importing  mongoose and dotenv
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Importing model module
const devCredits = require('./model/model.js');
//Importing cors
const cors = require('cors');
//Importing rate limiter
const rateLimiter = require('./middleware/rateLimiter.js');
//Configuring dotenv
dotenv.config();

const database = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(rateLimiter);

//Connecting this express application to MongoDB
mongoose
    .connect(database.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
});

//Sending a response
app.get('/', (req, res) => {
    res.send('Hello World!');
    //"Hello word" is now visible to / route
});

app.use(router);

// Assigning port number 3000 or any available one with process.env.PORT
const port = process.env.PORT || 3000;

//Listening for the port
app.listen(port, async () => {
    console.log(`Server is running at port ${port}`);
});


//Creating POST request for /post route
app.post('/post', (req,res) => {
    const credit = new devCredits({
        id: req.body.id,
        credits: req.body.credits
    }); 
    
    devCredits.countDocuments({ id: req.body.id}, (err,count) =>{
        if (count > 0) {
            devCredits.findOneAndUpdate(
                {id: req.body.id},
                {
                    $inc: {
                        credits: req.body.credits,
                    },
                },
                {new: true},
                (err, devCredit) => {
                    if (err) {
                        res.send(err);
                    } else res.json(devCredit);
                }
            );
        } else {
            credit.save((err, credits) => {
                if (err) {
                    res.send(err);
                }
                res.json(credits);
            });
        }
    });
});

app.get('/get/:id', (req,res) => {
    // devCredits.findById(req.params.id)
    // .then(data=> {
    //     return res.send(data);
    // })
    // .catch(err=>{
    //     return res.status(500).send({message: err});
    // });
    devCredits.find({ id: req.params.id }, { _id: 0, __v: 0 }, (err, data) => {
        if (err) {
          res.json(err);
        }
        res.json(data);
    });
    
});






// Handler for 404 - Resource Not Found
app.use((req, res, next) => {
    res.status(404).send({ message: 'We think you are lost!' });
});

// Handler for Error 500
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({ message: 'Internal Server error!' });
    // res.sendFile(path.join(__dirname, '../public/500.html'))
});