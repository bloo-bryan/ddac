import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const LOGIN_URL = 'http://localhost:8800/login';

const initialState = {
    showPopUp: false,
    isLoggedIn: false,
    showWarning: false,
}

export const loginPost = createAsyncThunk('login',async (loginCredential)=>{
    try{
        const response = await axios.post(LOGIN_URL,{
            username: loginCredential.username,
            password: loginCredential.password,
        })
        return response.data;
    }catch (err) {
        return err.message;
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        showLoginPopUp: (state) => {
            return {...state, showPopUp: true}
        },
        hideLoginPopUp: (state) => {
            return {...state, showPopUp: false}
        },
        logout: (state) => {
            return {isLoggedIn: false, showWarning: false}
        },
        showLogoutWarning: (state)=>{
            return {...state, showWarning: true}
        },
        hideLogoutWarning: (state)=> {
            return {...state, showWarning: false}
        },
    },
    extraReducers(builder) {
        builder
            .addCase(loginPost.fulfilled, (state, action)=>{
                if (action.payload.status == 'logged in'){
                    const result = action.payload;
                    return { isLoggedIn: true, userID: result.username, role: result.role};
                }
                return {...state, loginStatus: action.payload.status};
            })
    }
})

export const {showLoginPopUp, hideLoginPopUp, logout, showLogoutWarning, hideLogoutWarning} = userSlice.actions;
export default userSlice.reducer;