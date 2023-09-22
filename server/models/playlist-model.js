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
        ownerUser: { type: String, required: false },
        likes: { type: Number, required: false },
        userLikes: { type: [String], required: false },
        dislikes: { type: Number, required: false },
        userDislikes: { type: [String], required: false },
        listens: { type: Number, required: false },
        published: { type: Boolean, required: false },
        publishDate: { type: String, required: false },
        comments: { type: [{
            username: String,
            content: String,
        }], required: false },
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
