import { createStore,applyMiddleware  } from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    params:null,
    flights: [],
    selected_flights:[],
    isLoading: false
};


const flightReducer = (state = initialState ,action) => {
    switch(action.type){
        case 'SEARCH_FLIGHT':
            return {
                ...state,
                flights:[],
                params:action.payload,
                isLoading: true
            };
        case 'SEARCH_FLIGHT_SUCCESS':
            return {
                ...state,
                flights: action.payload,
                isLoading: false
            };
        default:
            return state    
    }
}

let flightStore = createStore(flightReducer,applyMiddleware(thunk))


export default flightStore;
