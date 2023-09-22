import { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
import { AuthContext } from '../auth';
import MUIErrorMessage from './MUIErrorMessage.js'

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
      }, []); 

    function handleKeyDown(event)
    {
        //console.log( event.keyCode ) 
        //ctrl = ctrlKey, z = 90, x = 89
        if (event.keyCode === 90 && event.ctrlKey)
        {
            let canUndo = store.canUndo();
            let undoButton = document.getElementById("undo-button")
            if (canUndo && (undoButton.disabled === false))
            {
                store.undo();
            }
        }
        else if (event.keyCode === 89 && event.ctrlKey)
        {
            let canRedo = store.canRedo();
            let redoButton = document.getElementById("redo-button")
            if (canRedo && (redoButton.disabled === false))
            {
                store.redo();
            }
        }
    }
    let modalJSX = "";
    let list = "";
    if(!store.currentList)
    {
        history.push("/")
    }
    
    if(store.currentList)
    {
        list =
        <List 
            id="playlist-cards" 
            sx={{ width: '100%'}}
        >
            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                )) 
            }
         </List>   
    }
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    else {
        modalJSX = <MUIErrorMessage />;
    }
    return (
        <Box>
         { list }          
         { modalJSX }
         </Box>
    )
}

export default WorkspaceScreen;