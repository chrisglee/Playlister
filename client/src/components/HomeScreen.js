import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../auth';
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab'
import Grid from '@mui/material/Grid';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import CommentCard from './CommentCard';
import YouTubePlayer from './YoutubePlayer';
/*
	This React component lists all the top5 lists in the UI.
	
	@author McKilla Gorilla
*/
const HomeScreen = () => {
	const { store } = useContext(GlobalStoreContext);
	const [tabIndex, setCurrentTab] = useState(0);
	const [searchText, setSearchText] = useState("");
	const [commentText, setCommentText] = useState("");
	const { auth } = useContext(AuthContext);
	const [anchorEl, setAnchorEl] = useState(null);
	const isMenuOpen = Boolean(anchorEl);

	useEffect(() => {
		store.loadIdNamePairs();
		if(store.currentSearchCriteria === null)
		{
			setSearchText("");
		}
	}, [store.currentPage, store.currentSearchCriteria, store.currentSortType]);

	function handleCreateNewList() {
		store.createNewList();
	}

	//TAB STUFF
	function handleTabChange(event, newTab) 
	{
		setCurrentTab(newTab);
	}

	//CURRENT PAGE STUFF
	function changeCurrentPage(pageType)
	{
		if (pageType !== store.currentPage)
		{
			store.changeCurrentPage(pageType);
		}
	}

	//SEARCH STUFF
	function handleUpdateSearchText(event) {
        setSearchText(event.target.value);
    }
	function handleSearchKeyPress(event) {
        if (event.code === "Enter") {
			store.changeSearchCriteria(searchText)
			event.target.blur();
        }
    }	

	//MENU STUFF
	const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
	const handleCloseMenu = () => {
        setAnchorEl(null);
    };
	
	//COMMENT STUFF
	function handleUpdateCommentText(event) {
        setCommentText(event.target.value);
    }
	function handleCommentKeyPress(event) {
        if (event.code === "Enter") {
			store.updateAttributePlaylist(store.currentList._id, auth.user.firstName + " " + auth.user.lastName, "COMMENTS", commentText)
			event.target.blur();
			setCommentText("");
        }
    }	


	let listCard = "";
	let newIdNamePairs = [];
	if (store)
	{
		if(store.idNamePairs)
		{
			newIdNamePairs = store.idNamePairs

			newIdNamePairs = newIdNamePairs.filter(function (playlist) {
				return (!(playlist.ownerFirstName !== auth.user.firstName && playlist.ownerLastName !== auth.user.lastName && !playlist.published))
			});
			
			if (store.currentPage === "SEARCH_BY_PLAYLIST" || store.currentPage === "SEARCH_BY_USER")
			{
				newIdNamePairs = newIdNamePairs.filter(function (playlist) {
					return (!(playlist.ownerFirstName === auth.user.firstName && playlist.ownerLastName === auth.user.lastName && !playlist.published))
				});
			}
		}
	}

	let menuList = ""
	if (store)
	{
		if (store.currentPage === "HOME_PAGE")
		{
			menuList = 
			<Box>
				<MenuItem onClick={ () =>{ handleCloseMenu(); store.changeSortType("CREATION_DATE") }}>Creation Date (Old - New)</MenuItem>
				<MenuItem onClick={ () =>{ handleCloseMenu(); store.changeSortType("LAST_EDIT_DATE") }}>Last Edit Date (Old - New)</MenuItem>
				<MenuItem onClick={ () =>{ handleCloseMenu(); store.changeSortType("NAME") }}>Name (A - Z)</MenuItem>
			</Box>
		}
		else if (store.currentPage === "SEARCH_BY_PLAYLIST" || store.currentPage === "SEARCH_BY_USER")
		{
			menuList = 
			<Box>
				<MenuItem onClick={ () =>{ handleCloseMenu(); store.changeSortType("NAME") }}>Name (A - Z)</MenuItem>
				<MenuItem onClick={ () =>{ handleCloseMenu(); store.changeSortType("PUBLISH_DATE") }}>Publish Date (Newest)</MenuItem>
				<MenuItem onClick={ () =>{ handleCloseMenu(); store.changeSortType("LISTENS") }}>Listens (High - Low)</MenuItem>
				<MenuItem onClick={ () =>{ handleCloseMenu(); store.changeSortType("LIKES") }}>Likes (High - Low)</MenuItem>
				<MenuItem onClick={ () =>{ handleCloseMenu(); store.changeSortType("DISLIKES") }}>Dislikes (High - Low)</MenuItem>
			</Box>
		}
	}
	let player = "";
	let commentList = "";
	if (store)
	{
		if (store.currentList)
		{
			if (store.currentList.comments)
			{
				commentList =
				store.currentList.comments.map((pair) => (
					<CommentCard
							key={pair._id}
							commenter={pair.username}
							comment={pair.content}/>
				)) 
			}
			if(store.currentList)
			{
					let songLinkArray = []
					for (let song in store.currentList.songs)
					{
						songLinkArray.push(store.currentList.songs[song].youTubeId)
					}
					player =
					<YouTubePlayer 
						playlist={songLinkArray}
						id={store.currentList._id}
					/>

			}
		}
		else
		{
			player = 
			<YouTubePlayer 
				playlist={[]}
			/>
		}
	}
	

	if (store) {
		listCard = 
			<Grid container>
				<Grid item xs={12}>
    				<Toolbar sx={{bgcolor: '#3d5a80'}} variant="dense">
						<IconButton onClick={() => {changeCurrentPage("HOME_PAGE")}}>
							<HomeIcon style={{ color: store.currentPage === "HOME_PAGE" ? '#7CFC00' : 'black'}}></HomeIcon>
						</IconButton>
						<IconButton onClick={() => {changeCurrentPage("SEARCH_BY_PLAYLIST")}}>
							<GroupsIcon style={{ marginRight: '2%', color: store.currentPage === "SEARCH_BY_PLAYLIST" ? '#7CFC00' : 'black' }} ></GroupsIcon>
						</IconButton>
						<IconButton style={{ marginRight: '20%'}} onClick={() => {changeCurrentPage("SEARCH_BY_USER")}}>
							<PersonIcon style={{ color: store.currentPage === "SEARCH_BY_USER" ? '#7CFC00' : 'black' }}></PersonIcon>
						</IconButton>
						<TextField 
							fullWidth
							label="Search" 
							variant="filled"
							value={searchText}
							onKeyPress={handleSearchKeyPress}
							onChange={handleUpdateSearchText}
							sx={{ marginRight: '20%', input: { color: 'white' } }}>
						</TextField>
						<Typography sx={{ color: 'white' }}>SORT BY</Typography>
						<IconButton onClick={handleOpenMenu}>
							<MenuIcon style={{ marginLeft: "auto" }}> </MenuIcon>
						</IconButton>
							<Menu
								id="playlist-sort-menu"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={isMenuOpen}
								onClose={handleCloseMenu}
							>
								{menuList}
							</Menu>
    				</Toolbar>
				</Grid>
			<Grid item xs={12} sm={6}>
				<List disablePadding sx={{ width: '100%', height: '68.5vh', overflow: "hidden", overflowY: "scroll", }}>
				{
					newIdNamePairs.map((pair) => (
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
        				<Tab label="Player"/>
        				<Tab label="Comments"/>
      				</Tabs>
					  <Box>
						{tabIndex === 0 && (
          				<Box>
							<Grid container>
								<Grid item xs={1}>
								
								</Grid> 
								<Grid item xs={10}>
								{player}
								</Grid> 
								<Grid item xs={1}>
								
								</Grid> 
							</Grid>
          				</Box>
       					)}
        				{tabIndex === 1 && (
          				<Box>
							<List disablePadding sx={{ width: '100%', height: '55.5vh', overflow: "hidden", overflowY: "auto", }}>
							{
								commentList
							}
							</List>
							<TextField
							fullWidth
							label={!store.currentList ? "Unable to Add Comment" : "Add Comment"}
							variant="filled"
							disabled={!store.currentList}
							value={commentText}
							onKeyPress={handleCommentKeyPress}
							onChange={handleUpdateCommentText}>
							</TextField>
          				</Box>
        				)}
					</Box>
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