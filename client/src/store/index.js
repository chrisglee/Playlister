import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    PUBLISH_LIST: "PUBLISH_LIST",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    SET_EXPAND_LIST: "SET_EXPAND_LIST",
    CLOSE_EXPAND_LIST: "CLOSE_EXPAND_LIST",
    CHANGE_CURRENT_PAGE: "CHANGE_CURRENT_PAGE",
    CHANGE_SEARCH_CRITERIA: "CHANGE_SEARCH_CRITERIA",
    CHANGE_SORT_TYPE: "CHANGE_SORT_TYPE",
    UPDATE_PLAYLIST: "UPDATE PLAYLIST",
    ERROR_CHANGE_LIST_NAME : "ERROR_CHANGE_LIST_NAME",
    LOGIN_AS_GUEST : "LOGIN_AS_GUEST",
    LOGIN_AS_USER : "LOGIN_AS_USER",
    DELETE_MARKED_LIST : "DELETE_MARKED_LIST",
    SET_PLAYING_SONG_INDEX : "SET_PLAYING_SONG_INDEX"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG",
    EDIT_ERROR : "EDIT_ERROR"
}

const CurrentPage = {
    HOME_PAGE : "HOME_PAGE",
    SEARCH_BY_PLAYLIST : "SEARCH_BY_PLAYLIST",
    SEARCH_BY_USER : "SEARCH_BY_USER"
}

const CurrentSort = {
    NONE : "NONE",
    CREATION_DATE : "CREATION DATE",
    LAST_EDIT_DATE : "LAST EDIT DATE",
    NAME : "NAME",
    PUBLISH_DATE : "PUBLISH DATE",
    LISTENS : "LISTENS",
    LIKES : "LIKES",
    DISLIKES : "DISLIKES"
}

const UpdateType = {
    LISTENS : "LISTENS",
    LIKES : "LIKES",
    DISLIKES : "DISLIKES",
    COMMENTS : "COMMENTS",
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        currentExpandedList: null,
        currentPage: CurrentPage.HOME_PAGE,
        currentSearchCriteria: null,
        currentSortType: CurrentSort.NONE,
        currentEditString: null,
        playingSongIndex: -1
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: payload,
                    playingSongIndex: store.playingSongIndex
                });
            }
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: payload.text,
                    playingSongIndex: store.playingSongIndex
                });
            }
            // FAIL CHANGE LIST NAME
            case GlobalStoreActionType.ERROR_CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.EDIT_ERROR,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: payload.text,
                    playingSongIndex: store.playingSongIndex
                });
            }
            // PUBLISH LIST
            case GlobalStoreActionType.PUBLISH_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: null,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: null,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: payload.length,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: 0
                });
            }
            // EDIT SONG
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            case GlobalStoreActionType.SET_EXPAND_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: payload.id,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            case GlobalStoreActionType.CLOSE_EXPAND_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: null,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            case GlobalStoreActionType.CHANGE_CURRENT_PAGE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: payload,
                    currentSearchCriteria: null,
                    currentSortType: CurrentSort.NONE,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            case GlobalStoreActionType.CHANGE_SEARCH_CRITERIA: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: payload,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            case GlobalStoreActionType.CHANGE_SORT_TYPE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: payload,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            case GlobalStoreActionType.UPDATE_PLAYLIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }
            case GlobalStoreActionType.LOGIN_AS_GUEST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: [],
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    newListCounter: 0,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: null,
                    currentPage: CurrentPage.SEARCH_BY_PLAYLIST,
                    currentSearchCriteria: null,
                    currentSortType: CurrentSort.NONE,
                    currentEditString: null,
                    playingSongIndex: -1
                });
            }
            case GlobalStoreActionType.LOGIN_AS_USER: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: [],
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    newListCounter: 0,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: null,
                    currentPage: CurrentPage.HOME_PAGE,
                    currentSearchCriteria: null,
                    currentSortType: CurrentSort.NONE,
                    currentEditString: null,
                    playingSongIndex: -1
                });
            }
            
            case GlobalStoreActionType.DELETE_MARKED_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: null,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: store.playingSongIndex
                });
            }

            case GlobalStoreActionType.SET_PLAYING_SONG_INDEX: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentExpandedList: store.currentExpandedList,
                    currentPage: store.currentPage,
                    currentSearchCriteria: store.currentSearchCriteria,
                    currentSortType: store.currentSortType,
                    currentEditString: null,
                    playingSongIndex: payload
                });
            }

            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) 
            {
                let playlist = response.data.playlist;
                response = await api.getPlaylistPairs();
                if (response.data.success)
                {
                    let fail = false;
                    let pairsArray = response.data.idNamePairs;
                    for (let pair in pairsArray)
                    {
                        if (pairsArray[pair].name === newName)
                        {
                            fail = true;
                        }
                    }
                    if (!fail)
                    {
                        playlist.name = newName;
                        updateList(playlist);
                    }
                    else
                    {
                        storeReducer({
                            type: GlobalStoreActionType.ERROR_CHANGE_LIST_NAME,
                            payload: { text: newName }
                        });
                    }
                    async function updateList(playlist) {
                        response = await api.updatePlaylistById(playlist._id, playlist);
                        if (response.data.success) {
                            async function getListPairs(playlist) {
                                if (store.currentPage === CurrentPage.HOME_PAGE)
                                {
                                    response = await api.getPlaylistPairs();
                                }
                                else
                                {
                                    response = await api.getAllPlaylists();
                                }
                                if (response.data.success) 
                                {
                                    let pairsArray = response.data.idNamePairs;
                                    if (store.currentSearchCriteria !== null)
                                    {
                                        if (store.currentPage === CurrentPage.HOME_PAGE || store.currentPage === CurrentPage.SEARCH_BY_PLAYLIST)
                                        {
                                            pairsArray = pairsArray.filter(function (playlist) {
                                                return playlist.name.toLowerCase().includes(store.currentSearchCriteria.toLowerCase())
                                                });
                                        }
                                        else if (store.currentPage === CurrentPage.SEARCH_BY_USER)
                                        {
                                            pairsArray = pairsArray.filter(function (playlist) {
                                                return (playlist.ownerUserName).toLowerCase().includes(store.currentSearchCriteria.toLowerCase())
                                                });
                                        }
                                    }
                                    switch (store.currentSortType)
                                    {
                                        case CurrentSort.CREATION_DATE:
                                        {
                                            pairsArray = pairsArray.sort((list1,list2) => new Date(list1.creationDate) - new Date(list2.creationDate))
                                            break;
                                        }
                                        case CurrentSort.LAST_EDIT_DATE:
                                        {
                                            pairsArray = pairsArray.sort((list1,list2) => new Date(list1.lastEditDate) - new Date(list2.lastEditDate))
                                            break;
                                        }
                                        case CurrentSort.NAME:
                                        {
                                            pairsArray = pairsArray.sort((list1,list2) => list1.name.localeCompare(list2.name))
                                            break;
                                        }
                                        case CurrentSort.PUBLISH_DATE:
                                        {
                                            pairsArray = pairsArray.sort((list1,list2) => new Date(list2.publishDate) - new Date(list1.publishDate))
                                            break;
                                        }
                                        case CurrentSort.LISTENS:
                                        {
                                            pairsArray = pairsArray.sort((list1,list2) => list2.listens - list1.listens)
                                            break;
                                        }
                                        case CurrentSort.LIKES:
                                        {
                                            pairsArray = pairsArray.sort((list1,list2) => list2.numLikes - list1.numLikes)
                                            break;
                                        }
                                        case CurrentSort.DISLIKES:
                                        {
                                            pairsArray = pairsArray.sort((list1,list2) => list2.numDislikes - list1.numDislikes)
                                            break;
                                        }
                                        default: //usually defualt is null anyways
                                        {
                                            pairsArray = pairsArray //bsaically no change
                                        }
                                    }
                                    if (store.currentSearchCriteria === "")
                                    {
                                        pairsArray = []
                                    }
                                    storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: 
                                    {
                                        playlist: playlist,
                                        text: null
                                    }
                                    });
                                }
                                else
                                {
                                    console.log("API FAILED TO GET THE LIST PAIRS");
                                }
                            }
                            getListPairs(playlist);
                        }
                    }
                }
            }
        }
        asyncChangeListName(id);
    }
    

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () 
    {
        let response = await api.getPlaylistPairs();
        if (response.data.success)
        {
            let pairsArray = response.data.idNamePairs;
            let listNamesArray = []
            for (let pair in pairsArray)
            {
                if(pairsArray[pair].name.substring(0,8) === "Untitled" && pairsArray[pair].name.substring(8,pairsArray[pair].name.length))
                {   
                    listNamesArray.push(Number(pairsArray[pair].name.substring(8,pairsArray[pair].name.length)))
                }
            }
            let maxNumber = 0;
            for (let number in listNamesArray)
            {
                if (maxNumber <= listNamesArray[number])
                {
                    maxNumber = listNamesArray[number] + 1
                }
            }
            async function asyncCreateNewList()
            {
                let newListName = "Untitled" + maxNumber;
                let date = Date.now();
                response = await api.createPlaylist(newListName, auth.user.email, auth.user.userName, auth.user.firstName, auth.user.lastName, 0, [], 0, [], 0, false, -1, [], [], date, date);
                console.log("createNewList response: " + response);
                if (response.status === 201) 
                {
                    tps.clearAllTransactions();
                    let newList = response.data.playlist;
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: newList
                    }
                    );
                    store.loadIdNamePairs();
                }
                else 
                {
                    console.log("API FAILED TO CREATE A NEW LIST");
                }
            }
            asyncCreateNewList();
        }
    }


    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS, AND FILTER LISTS BASED ON SEARCH CRITERIA AND SORTS IT AS WELL
    store.loadIdNamePairs = async function () 
    {
        console.log("load id name pairs")
        async function asyncLoadIdNamePairs() 
        {
            let response = ""
            if (store.currentPage === CurrentPage.HOME_PAGE)
            {
                response = await api.getPlaylistPairs();
            }
            else
            {
                response = await api.getAllPlaylists();
            }
            if (response.data.success) 
            {
                let pairsArray = response.data.idNamePairs;
                if (store.currentSearchCriteria !== null)
                {
                    if (store.currentPage === CurrentPage.HOME_PAGE || store.currentPage === CurrentPage.SEARCH_BY_PLAYLIST)
                    {
                        pairsArray = pairsArray.filter(function (playlist) {
                            return playlist.name.toLowerCase().includes(store.currentSearchCriteria.toLowerCase())
                            });
                    }
                    else if (store.currentPage === CurrentPage.SEARCH_BY_USER)
                    {
                        pairsArray = pairsArray.filter(function (playlist) {
                            return (playlist.ownerUserName).toLowerCase().includes(store.currentSearchCriteria.toLowerCase())
                            });
                    }
                }
                switch (store.currentSortType)
                {
                    case CurrentSort.CREATION_DATE:
                    {
                        pairsArray = pairsArray.sort((list1,list2) => new Date(list1.creationDate) - new Date(list2.creationDate))
                        break;
                    }
                    case CurrentSort.LAST_EDIT_DATE:
                    {
                        pairsArray = pairsArray.sort((list1,list2) => new Date(list1.lastEditDate) - new Date(list2.lastEditDate))
                        break;
                    }
                    case CurrentSort.NAME:
                    {
                        pairsArray = pairsArray.sort((list1,list2) => list1.name.localeCompare(list2.name))
                        break;
                    }
                    case CurrentSort.PUBLISH_DATE:
                    {
                        pairsArray = pairsArray.sort((list1,list2) => new Date(list2.publishDate) - new Date(list1.publishDate))
                        break;
                    }
                    case CurrentSort.LISTENS:
                    {
                        pairsArray = pairsArray.sort((list1,list2) => list2.listens - list1.listens)
                        break;
                    }
                    case CurrentSort.LIKES:
                    {
                        pairsArray = pairsArray.sort((list1,list2) => list2.numLikes - list1.numLikes)
                        break;
                    }
                    case CurrentSort.DISLIKES:
                    {
                        pairsArray = pairsArray.sort((list1,list2) => list2.numDislikes - list1.numDislikes)
                        break;
                    }
                    default: //usually defualt is null anyways
                    {
                        pairsArray = pairsArray //bsaically no change
                    }
                    }
                    if (store.currentSearchCriteria === "")
                    {
                        pairsArray = []
                    }
                storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: 
                {
                    pairsArray: pairsArray,
                    length: pairsArray.length
                }
                });
            }
            else
            {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            console.log(response)
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            console.log(response)
            if (response.data.success) {
                async function getListPairs(playlist) {
                    if (store.currentPage === CurrentPage.HOME_PAGE)
                    {
                        response = await api.getPlaylistPairs();
                    }
                    else
                    {
                        response = await api.getAllPlaylists();
                    }
                    if (response.data.success) 
                    {
                        let pairsArray = response.data.idNamePairs;
                        if (store.currentSearchCriteria !== null)
                        {
                            if (store.currentPage === CurrentPage.HOME_PAGE || store.currentPage === CurrentPage.SEARCH_BY_PLAYLIST)
                            {
                                pairsArray = pairsArray.filter(function (playlist) {
                                    return playlist.name.toLowerCase().includes(store.currentSearchCriteria.toLowerCase())
                                    });
                            }
                            else if (store.currentPage === CurrentPage.SEARCH_BY_USER)
                            {
                                pairsArray = pairsArray.filter(function (playlist) {
                                    return (playlist.ownerUserName).toLowerCase().includes(store.currentSearchCriteria.toLowerCase())
                                    });
                            }
                        }
                        switch (store.currentSortType)
                        {
                            case CurrentSort.CREATION_DATE:
                            {
                                pairsArray = pairsArray.sort((list1,list2) => new Date(list1.creationDate) - new Date(list2.creationDate))
                                break;
                            }
                            case CurrentSort.LAST_EDIT_DATE:
                            {
                                pairsArray = pairsArray.sort((list1,list2) => new Date(list1.lastEditDate) - new Date(list2.lastEditDate))
                                break;
                            }
                            case CurrentSort.NAME:
                            {
                                pairsArray = pairsArray.sort((list1,list2) => list1.name.localeCompare(list2.name))
                                break;
                            }
                            case CurrentSort.PUBLISH_DATE:
                            {
                                pairsArray = pairsArray.sort((list1,list2) => new Date(list2.publishDate) - new Date(list1.publishDate))
                                break;
                            }
                            case CurrentSort.LISTENS:
                            {
                                pairsArray = pairsArray.sort((list1,list2) => list2.listens - list1.listens)
                                break;
                            }
                            case CurrentSort.LIKES:
                            {
                                pairsArray = pairsArray.sort((list1,list2) => list2.numLikes - list1.numLikes)
                                break;
                            }
                            case CurrentSort.DISLIKES:
                            {
                                pairsArray = pairsArray.sort((list1,list2) => list2.numDislikes - list1.numDislikes)
                                break;
                            }
                            default: //usually defualt is null anyways
                            {
                                pairsArray = pairsArray //bsaically no change
                            }
                        }
                        if (store.currentSearchCriteria === "")
                        {
                            pairsArray = []
                        }
                        storeReducer({
                        type: GlobalStoreActionType.DELETE_MARKED_LIST,
                        payload: pairsArray
                        });
                    }
                    else
                    {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                }
                getListPairs();
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        console.log("setting list")
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            let date = Date.now()
            store.currentList.lastEditDate = date;
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                store.loadIdNamePairs()
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    store.clearAllTransactions = function()
    {
        tps.clearAllTransactions();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: "I AM CURRENTLY EDITING SOMETHING"
        });
    }

    // NEW FUNCTIONS

    // THIS FUNCTION PUBLISHES A LIST USING ITS ID
    store.publishList = function (id, date) {
        // GET THE LIST
        async function asyncPublishList(id, date) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.published = true;
                playlist.publishDate = date;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.PUBLISH_LIST,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncPublishList(id, date);
    }
    
    //THIS FUNCTION SETS THE CURRENT EXPANDED LIST, this is so sad that this has to be overloaded
    store.expandList = function (id) {
        async function asyncSetExpandList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (!store.currentList)
                {
                    playlist.listens++;
                }
                else 
                {
                    if(store.currentList._id !== id)
                    {
                        playlist.listens++;
                    }
                }
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            if (store.currentPage === CurrentPage.HOME_PAGE)
                            {
                                response = await api.getPlaylistPairs();
                            }
                            else
                            {
                                response = await api.getAllPlaylists();
                            }
                            if (response.data.success) 
                            {
                                let pairsArray = response.data.idNamePairs;
                                if (store.currentSearchCriteria !== null)
                                {
                                    if (store.currentPage === CurrentPage.HOME_PAGE || store.currentPage === CurrentPage.SEARCH_BY_PLAYLIST)
                                    {
                                        pairsArray = pairsArray.filter(function (playlist) {
                                            return playlist.name.toLowerCase().includes(store.currentSearchCriteria.toLowerCase())
                                            });
                                    }
                                    else if (store.currentPage === CurrentPage.SEARCH_BY_USER)
                                    {
                                        pairsArray = pairsArray.filter(function (playlist) {
                                            return (playlist.ownerUserName).toLowerCase().includes(store.currentSearchCriteria.toLowerCase())
                                            });
                                    }
                                }
                                switch (store.currentSortType)
                                {
                                    case CurrentSort.CREATION_DATE:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => new Date(list1.creationDate) - new Date(list2.creationDate))
                                        break;
                                    }
                                    case CurrentSort.LAST_EDIT_DATE:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => new Date(list1.lastEditDate) - new Date(list2.lastEditDate))
                                        break;
                                    }
                                    case CurrentSort.NAME:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => list1.name.localeCompare(list2.name))
                                        break;
                                    }
                                    case CurrentSort.PUBLISH_DATE:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => new Date(list2.publishDate) - new Date(list1.publishDate))
                                        break;
                                    }
                                    case CurrentSort.LISTENS:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => list2.listens - list1.listens)
                                        break;
                                    }
                                    case CurrentSort.LIKES:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => list2.numLikes - list1.numLikes)
                                        break;
                                    }
                                    case CurrentSort.DISLIKES:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => list2.numDislikes - list1.numDislikes)
                                        break;
                                    }
                                    default: //usually defualt is null anyways
                                    {
                                        pairsArray = pairsArray //bsaically no change
                                    }
                                }
                                if (store.currentSearchCriteria === "")
                                {
                                    pairsArray = []
                                }
                                storeReducer({
                                type: GlobalStoreActionType.SET_EXPAND_LIST,
                                payload: 
                                {
                                    pairsArray: pairsArray,
                                    playlist: playlist,
                                    id: id
                                }
                                });
                            }
                            else
                            {
                                console.log("API FAILED TO GET THE LIST PAIRS");
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncSetExpandList(id);
    }


    //THIS FUNCTION CLOSES THE CURRENT EXPANDED LIST
    store.closeExpandList = function (id) {
        async function asyncSetExpandList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.CLOSE_EXPAND_LIST,
                });
            }
        }
        asyncSetExpandList(id);
    }

    //THIS FUNCTION DUPLICATES THE GIVEN LIST
    store.duplicateList = async function (id) {
        async function asyncDuplicateList(id) 
        {
            let response = await api.getPlaylistById(id);
            if (response.data.success) 
            {
                let playlist = response.data.playlist;
                response = await api.getPlaylistPairs();
                if(response.data.success)
                {
                    let pairsArray = response.data.idNamePairs;
                    let listNamesArray = [];
                    for (let pair in pairsArray)
                    {
                        if(pairsArray[pair].name.substring(0,playlist.name.length) === playlist.name && pairsArray[pair].name.substring(playlist.name.length,pairsArray[pair].name.length))
                        {   
                            listNamesArray.push(Number(pairsArray[pair].name.substring(playlist.name.length,pairsArray[pair].name.length)))
                        }
                    }
                    let maxNumber = 0;
                    for (let number in listNamesArray)
                    {
                        if (maxNumber <= listNamesArray[number])
                        {
                            maxNumber = listNamesArray[number] + 1
                        }
                    }
                    async function asyncFilterThenCreate()
                    {
                        let duplicateName = playlist.name + " " + maxNumber
                        let date = Date.now()
                        response = await api.createPlaylist(duplicateName, auth.user.email, auth.user.userName, auth.user.firstName, auth.user.lastName, 0, [], 0, [], 0, false, -1, [], playlist.songs, date, date);
                        if (response.status === 201) 
                        {
                            store.loadIdNamePairs();
                        }
                        else 
                        {
                            console.log("API FAILED TO DUPLICATE A LIST");
                        }
                    }
                    asyncFilterThenCreate()
                }
            }
        }
        asyncDuplicateList(id);
    }

    //THIS FUNCTION CHANGES THE CURRENT PAGE
    store.changeCurrentPage = function (pageType)
    {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_CURRENT_PAGE,
            payload: pageType
        });
    }

    //THIS FUNCTIONS CHANGES THE SEARCH FIELD
    store.changeSearchCriteria = function (searchText)
    {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SEARCH_CRITERIA,
            payload: searchText
        });
    }

    //THIS FUNCTIONS CHANGES THE SORT TYPE
    store.changeSortType = function (sortType)
    {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SORT_TYPE,
            payload: sortType
        });
    }

    // THIS FUNCTIONS CHANGES THE LIKE COUNT
    store.updateAttributePlaylist = function (id, user, updateType, commentContent) {
        // GET THE LIST
        console.log("updating playlist")
        async function updateAttributePlaylist(id, user, updateType, commentContent) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) 
            {
                let playlist = response.data.playlist;
                if (updateType === UpdateType.LIKES)
                {
                    if (store.currentList === null)
                    {
                        playlist.listens++
                    }
                    else if (store.currentList._id !== id)
                    {
                        playlist.listens++
                    }
                    if (!playlist.userLikes.includes(user))
                    {
                        playlist.userLikes.push(user)
                        playlist.numLikes++
                        if (playlist.userDislikes.includes(user))
                        {
                            let index = playlist.userDislikes.indexOf(user);
                            playlist.userDislikes.splice(index, 1)
                            playlist.numDislikes--
                        }
                    }
                    else
                    {
                        let index = playlist.userLikes.indexOf(user);
                        playlist.userLikes.splice(index, 1)
                        playlist.numLikes--
                    }
                } 
                if (updateType === UpdateType.DISLIKES)
                {
                    if (store.currentList === null)
                    {
                        playlist.listens++
                    }
                    else if (store.currentList._id !== id)
                    {
                        playlist.listens++
                    }
                    if (!playlist.userDislikes.includes(user))
                    {
                        playlist.userDislikes.push(user)
                        playlist.numDislikes++
                        if (playlist.userLikes.includes(user))
                        {
                            let index = playlist.userLikes.indexOf(user);
                            playlist.userLikes.splice(index, 1)
                            playlist.numLikes--
                        }
                    }
                    else
                    {
                        let index = playlist.userDislikes.indexOf(user);
                        playlist.userDislikes.splice(index, 1)
                        playlist.numDislikes--
                    }
                } 
                if (updateType === UpdateType.COMMENTS)
                {
                    let commentTuple = {
                        username: user,
                        content: commentContent,
                    };
                    playlist.comments.push(commentTuple);
                }
                if (updateType === UpdateType.LISTENS)
                {
                    playlist.listens++
                }
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            if (store.currentPage === CurrentPage.HOME_PAGE)
                            {
                                response = await api.getPlaylistPairs();
                            }
                            else
                            {
                                response = await api.getAllPlaylists();
                            }
                            if (response.data.success) 
                            {
                                let pairsArray = response.data.idNamePairs;
                                if (store.currentSearchCriteria !== null)
                                {
                                    if (store.currentPage === CurrentPage.HOME_PAGE || store.currentPage === CurrentPage.SEARCH_BY_PLAYLIST)
                                    {
                                        pairsArray = pairsArray.filter(function (playlist) {
                                            return playlist.name.toLowerCase().includes(store.currentSearchCriteria.toLowerCase())
                                            });
                                    }
                                    else if (store.currentPage === CurrentPage.SEARCH_BY_USER)
                                    {
                                        pairsArray = pairsArray.filter(function (playlist) {
                                            return (playlist.ownerUserName).toLowerCase().includes(store.currentSearchCriteria.toLowerCase())
                                            });
                                    }
                                }
                                switch (store.currentSortType)
                                {
                                    case CurrentSort.CREATION_DATE:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => new Date(list1.creationDate) - new Date(list2.creationDate))
                                        break;
                                    }
                                    case CurrentSort.LAST_EDIT_DATE:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => new Date(list1.lastEditDate) - new Date(list2.lastEditDate))
                                        break;
                                    }
                                    case CurrentSort.NAME:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => list1.name.localeCompare(list2.name))
                                        break;
                                    }
                                    case CurrentSort.PUBLISH_DATE:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => new Date(list2.publishDate) - new Date(list1.publishDate))
                                        break;
                                    }
                                    case CurrentSort.LISTENS:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => list2.listens - list1.listens)
                                        break;
                                    }
                                    case CurrentSort.LIKES:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => list2.numLikes - list1.numLikes)
                                        break;
                                    }
                                    case CurrentSort.DISLIKES:
                                    {
                                        pairsArray = pairsArray.sort((list1,list2) => list2.numDislikes - list1.numDislikes)
                                        break;
                                    }
                                    default: //usually defualt is null anyways
                                    {
                                        pairsArray = pairsArray //bsaically no change
                                    }
                                }
                                if (store.currentSearchCriteria === "")
                                {
                                    pairsArray = []
                                }
                                storeReducer({
                                type: GlobalStoreActionType.UPDATE_PLAYLIST,
                                payload: 
                                {
                                    pairsArray: pairsArray,
                                    playlist: playlist,
                                }
                                });
                            }
                            else
                            {
                                console.log("API FAILED TO GET THE LIST PAIRS");
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        updateAttributePlaylist(id, user, updateType, commentContent);
    }

    store.loginAsGuest = function ()
    {
        storeReducer({
            type: GlobalStoreActionType.LOGIN_AS_GUEST,
            payload: null
        });
    }

    store.loginAsUser = function ()
    {
        storeReducer({
            type: GlobalStoreActionType.LOGIN_AS_USER,
            payload: null
        });
    }

    store.setPlayingSongIndex = function (index)
    {
        storeReducer({
            type: GlobalStoreActionType.SET_PLAYING_SONG_INDEX,
            payload: index
        });
    }


    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };