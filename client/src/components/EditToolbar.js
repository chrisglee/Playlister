import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { useHistory } from 'react-router-dom'


/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const guestUserName = "LvpDwRfQSyohcKXDY2KXnb3PSu4DcXrExni4wcycFqS1cCWcyRO60Qa9edp13W4"

    function handleAddNewSong(event) {
        event.stopPropagation();
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    async function handlePublishList() 
    {
        let date = Date.now();
        store.publishList(store.currentList._id, date);
    }
    async function handleDeleteList() 
    {
        store.markListForDeletion(store.currentList._id);
    }
    async function handleDuplicateList() 
    {
        store.duplicateList(store.currentList._id)
    }
    let toolbar = ""
    if (store && auth.user.userName !== guestUserName)
    {
        if (store.currentList)
        {
            if(store.currentList.ownerUserName === auth.user.userName)
            {
                toolbar = 
                <div id="edit-toolbar">
                <div id = "playlist-toolbar">
                <Button
                    disabled={!store.canAddNewSong() || store.currentModal !== "NONE" || store.currentList.published}
                    id='add-song-button'
                    onClick={handleAddNewSong}
                    variant="contained">
                    <AddIcon />
                </Button>
                <Button 
                    disabled={!store.canUndo() || store.currentModal !== "NONE" || store.currentList.published}
                    id='undo-button'
                    onClick={handleUndo}
                    variant="contained">
                        <UndoIcon />
                </Button>
                <Button 
                    disabled={!store.canRedo() || store.currentModal !== "NONE" || store.currentList.published}
                    id='redo-button'
                    onClick={handleRedo}
                    variant="contained">
                        <RedoIcon />
                </Button>
                </div>
                <div id = "playlist-actions">
                <Button
                    disabled={store.currentModal !== "NONE" || store.currentList.published}
                    id='publish-playlist-button'
                    onClick={handlePublishList}
                    variant="contained">
                    Publish
                </Button>
                <Button
                    disabled={store.currentModal !== "NONE"}
                    id='delete-playlist-button'
                    onClick={handleDeleteList}
                    variant="contained">
                    Delete
                </Button>
                <Button
                    disabled={store.currentModal !== "NONE"}
                    id='duplicate-playlist-button'
                    onClick={handleDuplicateList}
                    variant="contained">
                    Duplicate
                </Button>
                </div>
            </div>
            }
            else
            {
                toolbar =
                <div id="edit-toolbar">
                <div id = "playlist-actions">
                <Button
                    disabled={store.currentModal !== "NONE"}
                    id='duplicate-playlist-button'
                    onClick={handleDuplicateList}
                    variant="contained">
                    Duplicate
                </Button>
                </div>
            </div>
            }
        }
    }
    return (
        toolbar
    )
}

export default EditToolbar;