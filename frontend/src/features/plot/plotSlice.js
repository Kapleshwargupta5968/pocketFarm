import {createSlice} from "@reduxjs/toolkit";
const initialState = {
    plots: [],
    myPlots:[],
    stats:{},
    selectedPlot: null,
};

const plotSlice = createSlice({
    name:"plot",
    initialState,
    reducers:{
        setPlots: (state, action) => {
            state.plots = action.payload;
        },
        setMyPlots: (state, action) => {
            state.myPlots = action.payload.plots;
            state.stats = action.payload.stats;

        },
        setSelectedPlot: (state, action) => {
            state.selectedPlot = action.payload;
        }
    }
});


export const {setPlots, setMyPlots, setSelectedPlot} = plotSlice.actions;
export default plotSlice.reducer;