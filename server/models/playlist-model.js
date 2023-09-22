const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        ownerFirstName: { type: String, required: true },
        ownerLastName: { type: String, required: true },
        numLikes: { type: Number, required: true },
        userLikes: { type: [String], required: true },
        numDislikes: { type: Number, required: true },
        userDislikes: { type: [String], required: true },
        listens: { type: Number, required: true },
        published: { type: Boolean, required: true },
        publishDate: { type: Number, required: true },
        comments: { type: [{
            username: String,
            content: String,
        }], required: true },
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true },
        creationDate: { type: Number, required: true },
        lastEditDate: { type: Number, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
