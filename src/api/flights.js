import axiosClient from "./axiosClient";

export function searchFlightApi(payload){
    return axiosClient.post(`/flights/search_flight`,payload);
}

export function getServicesApi(payload){
    return axiosClient.post(`/api/v1/flights/get_services`,payload);
}

export function getPriceApi(payload){
    return axiosClient.post(`/api/v1/flights/get_price`,payload);
}



export function bookApi(payload){
    return axiosClient.post(`/api/v1/flights/book`,payload)
}