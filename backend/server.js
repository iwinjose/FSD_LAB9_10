const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongo DB is connected");
    })
    .catch((error) => {
        console.log(error);
    });

const turfSchema = new mongoose.Schema({
    turfName: String,
    location: String,
    sportType: String,
    contact: String
});

const Turf = mongoose.model("Turf", turfSchema);



app.get('/', (req, res) => {
    res.send("Api is running");
});

app.get('/turfs', async (req, res) => {
    const turfs = await Turf.find();
    res.json(turfs);
});

app.post('/turfs', async (req, res) => {
    const turf = await Turf.create(req.body);
    res.json(turf);
});

app.put('/turfs/:id', async (req, res) => {
    const turf = await Turf.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(turf);
});

app.delete('/turfs/:id', async (req, res) => {
    await Turf.findByIdAndDelete(req.params.id);
    res.json({ message: "Turf deleted" })
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is connected on PORT: ${PORT}`);
});