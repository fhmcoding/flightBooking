import {Routes, Route } from 'react-router-dom';
import Layout from './pages/layout';
import IndexPage from './pages/Index';
import SearchResult from "./pages/flights/SearchResult";
import Booking from "./pages/flights/Booking"

const PagesRoute  = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />} >
                <Route index  element={<IndexPage />} />
                <Route path="/results" element={<SearchResult />} />
                <Route path="/booking/:sequence_number" element={<Booking />} />
            </Route>
        </Routes>
    )
}

export default PagesRoute