import { createSlice } from '@reduxjs/toolkit';

const initialState = {  
    businesses: [],
    selectedBusiness: null,

};
const businessSlice = createSlice({
    name: 'business',
    initialState,
    reducers: {
        setBusinesses: (state, action) => {
            state.businesses = action.payload;
        },
        setSelectedBusiness: (state, action) => {
            state.selectedBusiness = action.payload;
        },
        addBusiness: (state, action) => {
            state.businesses.push(action.payload);
        }
    },
});

export const { setBusinesses, setSelectedBusiness, addBusiness } = businessSlice.actions;   
export default businessSlice.reducer;
