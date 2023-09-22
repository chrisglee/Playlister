import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
import { AuthContext } from '../auth';
import MUIErrorMessage from './MUIErrorMessage.js'
import { getPlaylistById } from '../store/store-request-api/index.js'

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const history = useHistory();

    let modalJSX = "";
    let list = "";
    // console.log(store)
    // console.log(auth)
    if(!store.currentList)
    {
        history.push("/")
    }
    
    if(store.currentList)
    {
        list =
        <List 
            id="playlist-cards" 
            sx={{ width: '100%', bgcolor: 'background.paper' }}
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