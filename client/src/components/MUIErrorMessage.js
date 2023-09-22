import { useContext } from 'react'
import GlobalStoreContext from '../store';
import { AuthContext } from '../auth';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIErroeMessage() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let msg = "";
    console.log(auth.errorMessage)
    if (auth.errorMessage !== "") {
        msg = auth.errorMessage;
    }

    function handleCloseModal(event) {
        auth.clearErrorMessage();
    }

    return (
        <Modal
            open={auth.errorMessage !== ""}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                <header className="dialog-header">
                    Error Message
                </header>
                {msg}
                <div id="confirm-cancel-container">
                    <button
                        id="dialog-yes-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                    >Confirm</button>
                </div>
            </div>
            </Box>
        </Modal>
    );
}