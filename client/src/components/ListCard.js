import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditToolbar from './EditToolbar'
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Typography from '@mui/material/Typography'
import WorkspaceScreen from './WorkspaceScreen';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    console.log(idNamePair)

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
            store.clearAllTransactions();
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }
    function handleClose() {
        store.closeCurrentList();
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let iconToggle = "";
    let workspaceToggle = ""
    if (!store.currentList)
    {
        iconToggle = 
        <IconButton onClick={(event) => {handleLoadList(event, idNamePair._id)}} aria-label='open'>
                <KeyboardDoubleArrowDownIcon />
        </IconButton>
    }
    else
    {
        if (store.currentList._id === idNamePair._id)
        {
            iconToggle = 
            <Box>
                <IconButton onClick={(event) => {handleClose()}} aria-label='close'>
                    <KeyboardDoubleArrowUpIcon />
                </IconButton>
            </Box>
            workspaceToggle = 
            <Box>
                <WorkspaceScreen />
                <EditToolbar />
            </Box>
            
        }
        else
        {
            iconToggle = 
            <IconButton onClick={(event) => {handleLoadList(event, idNamePair._id)}} aria-label='open'>
                <KeyboardDoubleArrowDownIcon />
            </IconButton>
        }
    }
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1, bgcolor: '#98c1d9', borderRadius: '16px' }}
            style={{ width: '100%', fontSize: '48pt' }}
        >
            <Grid container>
                <Grid item xs={8}>
                <Typography style={{fontSize:'24pt'}}> {idNamePair.name} </Typography>
                </Grid>
                <Grid item xs={1}>
                <ThumbUpIcon  style={{fontSize:'24pt', marginBottom: '16px'}}></ThumbUpIcon>
                </Grid>
                <Grid item xs={1}>
                <Typography style={{fontSize:'24pt'}}> {idNamePair.numLikes} </Typography>
                </Grid>
                <Grid item xs={1}>
                <ThumbDownIcon style={{fontSize:'24pt', marginBottom: '16px'}}></ThumbDownIcon>
                </Grid>
                <Grid item xs={1}>
                <Typography style={{fontSize:'24pt'}}> {idNamePair.numDislikes} </Typography>
                </Grid>
                <Grid item xs={12}>
                <Typography style={{fontSize:'12pt'}}> By: {idNamePair.ownerUser} </Typography>
                </Grid>
                <Grid item xs={12}>
                {workspaceToggle}
                </Grid>
                <Grid item xs={6}>
                <Typography style={{fontSize:'8pt', marginTop: '40px'}}> Published: {idNamePair.publishDate} </Typography>
                </Grid>
                <Grid item xs={5}>
                <Typography style={{fontSize:'8pt', marginTop: '40px'}}> Listens: {idNamePair.listens} </Typography>
                </Grid>
                <Grid item xs={1}>
                {iconToggle}
                </Grid>
            </Grid>
        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;