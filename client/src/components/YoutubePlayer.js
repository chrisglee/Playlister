import YouTube from 'react-youtube';
import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { Typography } from '@mui/material';

export default function YouTubePlayer(props) {

    const { store } = useContext(GlobalStoreContext);
    const {playlist, list} = props;
    let [currentSong, setCurrentSong] = useState(0);

    useEffect(() => {
        setCurrentSong(0)
	}, [store.currentList]);

    const playerOptions = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length;
        setCurrentSong(currentSong)
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    let playerComponent = ""
    if (store.currentList)
    {
        
    
    if (store.currentList.songs.length > 0 && store.currentList.songs[currentSong])
    {
        playerComponent = 
        <Box>
            <Grid container columns={13} sx={{bgcolor: "#fffff1", borderRadius: '16px'}}>
                <Grid item xs={13}>
                    <Typography sx={{textAlign:"center", fontWeight: 'bold', fontSize: '24pt'}}> Now Playing </Typography>
                </Grid>
                <Grid item xs={13}>
                    <Typography sx={{textAlign:"left", fontWeight: 'bold'}}> Playlist: {store.currentList.name} </Typography>
                </Grid>
                <Grid item xs={13}>
                    <Typography sx={{textAlign:"left", fontWeight: 'bold'}}> Song #: {currentSong + 1} </Typography>
                </Grid>
                <Grid item xs={13}>
                    <Typography sx={{textAlign:"left", fontWeight: 'bold'}}> Title: {store.currentList.songs[currentSong].title} </Typography>
                </Grid>
                <Grid item xs={13}>
                    <Typography sx={{textAlign:"left", fontWeight: 'bold'}}> Artist: {store.currentList.songs[currentSong].artist}</Typography>
                </Grid>
                <Grid item xs={13}>
                <YouTube
                    videoId={playlist[currentSong]}
                    opts={playerOptions}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange} />
                </Grid>
                <Grid item xs={4}>

                </Grid>
                <Grid item xs={5}> 
                <Box sx={{bgcolor: "#fffff1", borderRadius: '16px', alignItems: "center", justifyContent: "center"}}>
                    <IconButton>
                        <SkipPreviousIcon style={{fontSize: '30pt', color: 'black'}}></SkipPreviousIcon>
                    </IconButton>
                    <IconButton>
                        <PlayArrowIcon style={{fontSize: '30pt', color: 'black'}}></PlayArrowIcon>
                    </IconButton>
                    <IconButton>
                        <PauseIcon style={{fontSize: '30pt', color: 'black'}}></PauseIcon>
                    </IconButton>
                    <IconButton>
                        <SkipNextIcon style={{fontSize: '30pt', color: 'black'}}></SkipNextIcon>
                    </IconButton>
                </Box>
                <Grid item xs={4}>
                </Grid>
                </Grid>
            </Grid>
        </Box>
    }
    else
    {
        playerComponent = 
        <Box>
            <Grid container columns={13} sx={{bgcolor: "#fffff1", borderRadius: '16px'}}>
                <Grid item xs={13}>
                    <Typography sx={{textAlign:"center", fontWeight: 'bold', fontSize: '24pt'}}> Currently Not Playing </Typography>
                </Grid>
                <Grid item xs={13}>
                    <Typography sx={{textAlign:"left", fontWeight: 'bold'}}> </Typography>
                </Grid>
                <Grid item xs={13}>
                    <Typography sx={{textAlign:"left", fontWeight: 'bold'}}> </Typography>
                </Grid>
                <Grid item xs={13}>
                    <Typography sx={{textAlign:"left", fontWeight: 'bold'}}> </Typography>
                </Grid>
                <Grid item xs={13}>
                    <Typography sx={{textAlign:"left", fontWeight: 'bold'}}> </Typography>
                </Grid>
                <Grid item xs={13}>
                <Box sx={{bgcolor: "black", height: '390px', width: '640px'}}>
                </Box>
                </Grid>
                <Grid item xs={4}>

                </Grid>
                <Grid item xs={5}> 
                <Box sx={{bgcolor: "#fffff1", borderRadius: '16px', alignItems: "center", justifyContent: "center"}}>
                    <IconButton>
                        <SkipPreviousIcon style={{fontSize: '30pt', color: 'black'}}></SkipPreviousIcon>
                    </IconButton>
                    <IconButton>
                        <PlayArrowIcon style={{fontSize: '30pt', color: 'black'}}></PlayArrowIcon>
                    </IconButton>
                    <IconButton>
                        <PauseIcon style={{fontSize: '30pt', color: 'black'}}></PauseIcon>
                    </IconButton>
                    <IconButton>
                        <SkipNextIcon style={{fontSize: '30pt', color: 'black'}}></SkipNextIcon>
                    </IconButton>
                </Box>
                <Grid item xs={4}>
                </Grid>
                </Grid>
            </Grid>
        </Box>
    }
    }
    return (
        playerComponent
    )
}