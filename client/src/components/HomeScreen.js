import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab'
import Grid from '@mui/material/Grid';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/Person';
import SortIcon from "@mui/icons-material/Sort";
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography'
/*
	This React component lists all the top5 lists in the UI.
	
	@author McKilla Gorilla
*/
const HomeScreen = () => {
	const { store } = useContext(GlobalStoreContext);

	useEffect(() => {
		store.loadIdNamePairs();
	}, []);

	function handleCreateNewList() {
		store.createNewList();
	}
	let listCard = "";
	if (store) {
		listCard = 
			<Grid container>
				<Grid item xs={12}>
    				<Toolbar>
						<HomeIcon style={{ marginRight: 20 }}></HomeIcon>
						<GroupsIcon style={{ marginRight: 20 }} ></GroupsIcon>
						<PersonIcon style={{ marginRight: 350 }}></PersonIcon>
						<TextField 
							id="outlined-basic" 
							label="Search" 
							variant="outlined"
							style={{ marginRight: 400 }}>
						</TextField>
						<Typography>SORT BY</Typography>
						<SortIcon style={{ marginLeft: "auto" }}> </SortIcon>
    				</Toolbar>
				</Grid>
			<Grid item xs={12} sm={7}>
				<List disablePadding sx={{ width: '100%', height: '90%', overflow: "hidden", overflowY: "scroll", }}>
				{
					store.idNamePairs.map((pair) => (
						<ListCard
							key={pair._id}
							idNamePair={pair}
							selected={false}
						/>
					))
				}
				</List>
			</Grid>
			<Grid item xs={12} sm={5}>
				<Box sx={{ width: '100%', height: '90%'}}>
					hello
				</Box>
			</Grid>
		</Grid>
	}
	return (
		<div id="playlist-selector">
			<div id="list-selector-heading">
			<Fab 
				color="primary" 
				aria-label="add"
				id="add-list-button"
				onClick={handleCreateNewList}
				disabled={store.currentModal !== "NONE"}
			>
				<AddIcon />
			</Fab>
				<Typography variant="h2">Your Lists</Typography>
			</div>
			<div id="list-selector-list">
				{
					listCard
				}
				<MUIDeleteModal />
			</div>
		</div>)
}

export default HomeScreen;