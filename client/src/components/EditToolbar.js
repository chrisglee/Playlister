import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';
import { useHistory } from 'react-router-dom'


/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    async function handleDeleteList() 
    {
        console.log("delete-list-" + store.currentList._id);
        store.markListForDeletion(store.currentList._id);
    }
    return (
        <div id="edit-toolbar">
            <div id = "playlist-toolbar">
            <Button
                disabled={!store.canAddNewSong() || store.currentModal !== "NONE"}
                id='add-song-button'
                onClick={handleAddNewSong}
                variant="contained">
                <AddIcon />
            </Button>
            <Button 
                disabled={!store.canUndo() || store.currentModal !== "NONE"}
                id='undo-button'
                onClick={handleUndo}
                variant="contained">
                    <UndoIcon />
            </Button>
            <Button 
                disabled={!store.canRedo() || store.currentModal !== "NONE"}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                    <RedoIcon />
            </Button>
            </div>
            <div id = "playlist-actions">
            <Button
                id='publish-playlist-button'
                variant="contained">
                Publish
            </Button>
            <Button
                id='delete-playlist-button'
                onClick={handleDeleteList}
                variant="contained">
                Delete
            </Button>
            <Button
                id='duplicate-playlist-button'
                variant="contained">
                Duplicate
            </Button>
            </div>
        </div>
    )
}

export default EditToolbar;