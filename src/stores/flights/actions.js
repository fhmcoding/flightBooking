import flightStore from './flightStore'

import {searchFlightApi} from "../../api/flights"

export  function searchFlights  (payload)  {
    return function(dispatch) {
        dispatch({type:"SEARCH_FLIGHT",payload})
        return searchFlightApi(payload).then(response => response.data)
                                        .then(data => {
                                            console.log(data);
                                            dispatch({ type: 'SEARCH_FLIGHT_SUCCESS', payload: data.flights })
                                        })

    }
}



