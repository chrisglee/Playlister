import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { AuthContext } from '../auth'
import { Typography } from '@mui/material'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext)
    let text = "";
    let statusBarElement = "";
    if (store.currentList)
        text = store.currentList.name;
    if (auth.loggedIn)
    {
        statusBarElement =
        <div id="playlister-statusbar">
            {/* <Typography variant="h4">{text}</Typography> */}
        </div>
    }
    return (
        statusBarElement
    );
}

export default Statusbar;