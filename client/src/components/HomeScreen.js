import React, { useContext, useEffect, useState } from 'react'
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
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
/*
	This React component lists all the top5 lists in the UI.
	
	@author McKilla Gorilla
*/
const HomeScreen = () => {
	const { store } = useContext(GlobalStoreContext);
	const [tabIndex, setTabIndex] = useState(0);
	const handleTabChange = (event, newTabIndex) => {
		setTabIndex(newTabIndex);
	  };

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
    				<Toolbar sx={{bgcolor: '#3d5a80'}} variant="dense">
						<HomeIcon style={{ marginRight: '2%' }}></HomeIcon>
						<GroupsIcon style={{ marginRight: '2%' }} ></GroupsIcon>
						<PersonIcon style={{ marginRight: '33%' }}></PersonIcon>
						<TextField 
							label="Search" 
							variant="filled"
							style={{ marginRight: '40%' }}>
						</TextField>
						<Typography>SORT BY</Typography>
						<SortIcon style={{ marginLeft: "auto" }}> </SortIcon>
    				</Toolbar>
				</Grid>
			<Grid item xs={12} sm={6}>
				<List disablePadding sx={{ width: '100%', height: '68.5vh', overflow: "hidden", overflowY: "scroll", }}>
				{
					store.idNamePairs.map((pair) => (
						<ListCard
							key={pair._id}
							idNamePair={pair}
							selected={(store.currentList !== null) && (store.currentList._id === pair._id)}
							expanded={(store.currentExpandedList !== null) && (store.currentExpandedList === pair._id)}
						/>
					))
				}
				</List>
			</Grid>
			<Grid item xs={12} sm={6}>
				<Box sx={{ width: '100%', height: '80%'}}>
					<Tabs value={tabIndex} onChange={handleTabChange}>
        				<Tab label="Player" />
        				<Tab label="Comments" />
      				</Tabs>
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