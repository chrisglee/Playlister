import { useContext } from 'react'
import GlobalStoreContext from '../store';
import { AuthContext } from '../auth';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    // p: 4,
};

export default function MUIErrorMessage() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let msg = "";
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
                <div className="modal-root">
                <header className="dialog-header">
                    Error Message
                </header>
                <Alert severity="error">{msg}</Alert>
                <div id="confirm-cancel-container">
                    <Button
                        // id="dialog-yes-button"
                        // className="modal-button"
                        onClick={handleCloseModal}
                    >Confirm</Button>
                </div>
            </div>
            </Box>
        </Modal>
    );
}