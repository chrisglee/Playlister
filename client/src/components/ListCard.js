import { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
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
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected, expanded } = props;
    const guestUserName = "LvpDwRfQSyohcKXDY2KXnb3PSu4DcXrExni4wcycFqS1cCWcyRO60Qa9edp13W4"


    useEffect(() => {
		if (store.currentEditString === null)
        {
            setEditActive(false)
            store.loadIdNamePairs();
        }
	}, [store.currentEditString]);

    function handleLoadList(event, id) {
        // event.stopPropagation();
        // console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            // console.log("load " + event.target.id);

            // LOAD THE CURRENT LIST
            if (!selected)
            {
                store.updateAttributePlaylist(id, null, "LISTENS"); //This works
                // store.setCurrentList(id);
                store.clearAllTransactions();
            }
        }
    }

    function handleExpandList(event, id) {
        event.stopPropagation();
        // console.log("handleExpandListfor " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            // console.log("expand " + event.target.id);

            // EXPAND AND LOAD THE CURREENT LIST
            if (store.currentList)
            {
                if (store.currentList._id !== id)
                {
                    store.clearAllTransactions();
                }
            }
            store.expandList(id);
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

    function handleClick(event) {
        // DOUBLE CLICK IS FOR PLAYLIST EDIT NAME
            if (event.detail === 2 && auth.user.userName === store.currentList.ownerUserName && !store.currentList.published) {
                handleToggleEdit(event)
            }
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            if (text === "" || idNamePair.name === text)
            {
                setEditActive(false)
            }
            else
            {
                store.changeListName(id, text);
            }
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }
    function handleCloseExpandList(event, id) {
        event.stopPropagation();
        store.closeExpandList(id);
    }

    function handleLike(event, id)
    {
        event.stopPropagation();
        if (auth)
        {
            store.updateAttributePlaylist(id, auth.user.userName, "LIKES");
        }
    }

    function handleDislike(event, id)
    {
        event.stopPropagation();
        if (auth)
        {
            store.updateAttributePlaylist(id, auth.user.userName, "DISLIKES");
        }
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
    if (!expanded)
    {
        iconToggle = 
        <IconButton onClick={(event) => {handleExpandList(event, idNamePair._id)}} aria-label='open'>
                <KeyboardDoubleArrowDownIcon />
        </IconButton>
    }
    else
    {
        if (selected)
        {
            iconToggle = 
            <Box>
                <IconButton onClick={(event) => {handleCloseExpandList(event, idNamePair._id)}} aria-label='close'>
                    <KeyboardDoubleArrowUpIcon />
                </IconButton>
            </Box>
            if (expanded)
            workspaceToggle =
            <Box>
                <WorkspaceScreen />
                <EditToolbar />
            </Box>
            
        }
        else
        {
            iconToggle = 
            <IconButton onClick={(event) => {handleExpandList(event, idNamePair._id)}} aria-label='open'>
                <KeyboardDoubleArrowDownIcon />
            </IconButton>
        }
    }

    let thumbUp =
    <IconButton onClick={(event) => {handleLike(event, idNamePair._id)}}>
        <ThumbUpIcon style={{fontSize:'24pt', color: idNamePair.userLikes.includes(auth.user.userName) ? '#10a64a' : 'black'}}></ThumbUpIcon>
    </IconButton>

    if (auth.user.userName === guestUserName)
    {
        thumbUp=
        <IconButton disabled={true}>
            <ThumbUpIcon style={{fontSize:'24pt', color: 'gray'}}></ThumbUpIcon>
        </IconButton>
    }

    let thumbDown = 
    <IconButton onClick={(event) => {handleDislike(event, idNamePair._id)}}>
        <ThumbDownIcon style={{fontSize:'24pt', color: idNamePair.userDislikes.includes(auth.user.userName) ? '#f44336' : 'black'}}></ThumbDownIcon>
    </IconButton>

    
    if (auth.user.userName === guestUserName)
    {   
        thumbDown=
        <IconButton disabled={true}>
            <ThumbDownIcon style={{fontSize:'24pt', color: 'gray'}}></ThumbDownIcon>
        </IconButton>
    }



    
    let cardElement =
        <ListItem
            onClick={(event) => {handleLoadList(event, idNamePair._id)}}
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1, borderRadius: '16px', bgcolor: selected ? '#ffb703' : '#98c1d9' }}
            style={{ width: '100%', fontSize: '48pt' }}
        >
            <Grid container>
                <Grid item xs={8}>
                <Typography style={{fontSize:'24pt'}} onClick={handleClick}> {idNamePair.name} </Typography>
                </Grid>
                <Grid item xs={1}>
                <Typography>
                    {thumbUp}
                </Typography>
                </Grid>
                <Grid item xs={1}>
                <Typography style={{fontSize:'24pt' }}> {idNamePair.numLikes} </Typography>
                </Grid>
                <Grid item xs={1}>
                <Typography>
                    {thumbDown}
                </Typography>
                </Grid>
                <Grid item xs={1}>
                <Typography style={{fontSize:'24pt' }}> {idNamePair.numDislikes} </Typography>
                </Grid>
                <Grid item xs={12}>
                <Typography style={{fontSize:'12pt'}}> By: {idNamePair.ownerUserName} </Typography>
                </Grid>
                <Grid item xs={12}>
                {workspaceToggle}
                </Grid>
                <Grid item xs={6}>
                <Typography style={{fontSize:'8pt', marginTop: '40px'}}> Published: {new Date(idNamePair.publishDate).toLocaleDateString()} </Typography>
                </Grid>
                <Grid item xs={5}>
                <Typography style={{fontSize:'8pt', marginTop: '40px'}}> Listens: {idNamePair.listens} </Typography>
                </Grid>
                <Grid item xs={1}>
                {iconToggle}
                </Grid>
            </Grid>
        </ListItem>
    if (!idNamePair.published)
    {
        cardElement =
        <ListItem
            onClick={(event) => {handleLoadList(event, idNamePair._id)}}
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1, borderRadius: '16px', bgcolor: selected ? '#ffb703' : '#fb8500' }}
            style={{ width: '100%', fontSize: '48pt' }}
        >
            <Grid container>
                <Grid item xs={8}>
                <Typography style={{fontSize:'24pt'}} onClick={handleClick}> {idNamePair.name} </Typography>
                </Grid>
                <Grid item xs={4}>

                </Grid>
                <Grid item xs={12}>
                <Typography style={{fontSize:'12pt'}}> By: {idNamePair.ownerUserName} </Typography>
                </Grid>
                <Grid item xs={12}>
                {workspaceToggle}
                </Grid>
                <Grid item xs={11}>

                </Grid>
                <Grid item xs={1}>
                {iconToggle}
                </Grid>
            </Grid>
        </ListItem>
    }
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