const {MongoClient} = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

/* MongoDB Atlas와 연결하기 */
const client = new MongoClient (
    process.env.ATLAS_URI, // mongoDB Connect 정보
    {
        useUnifiedTopology: true
    }
);

async function dbConnectStart() {
    await client.connect()
    console.log("MongoClient Connected")
}
dbConnectStart()

module.exports = {
    connect: client.connect(),
    //사용하고자 하는 collection접속
    collectionPospot: client.db("sample_data").collection("pospotNear"),
    collectionAriBnb: client.db("sample_airbnb").collection("listingsAndReviews")
}