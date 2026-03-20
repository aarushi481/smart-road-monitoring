import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const BASE_URL = "http://localhost:3001";

function ReportList({ reports, setPopupImage }) {
    const [filter, setFilter] = useState("All");

    const filtered =
        filter === "All" ? reports : reports.filter(r => r.type === filter);

    return ( <
        div style = {
            { marginTop: "30px" } } >
        <
        h2 > 📋Reports < /h2>

        { /* FILTER */ } <
        div style = {
            { marginBottom: "10px" } } >
        <
        button onClick = {
            () => setFilter("All") } > All < /button> <
        button onClick = {
            () => setFilter("Pothole") } > Potholes < /button> <
        button onClick = {
            () => setFilter("Accident") } > Accidents < /button> <
        button onClick = {
            () => setFilter("Construction") } > Construction < /button> <
        /div>

        { /* CARDS */ } <
        div className = "reports-grid" > {
            filtered.map((r, i) => ( <
                div key = { i }
                className = "card" >
                <
                b > { r.type } < /b>

                <
                p style = {
                    { color: r.detection === "POTHOLE" ? "red" : "green" } } > { r.detection || "Processing..." } <
                /p>

                {
                    r.image && ( <
                        img src = { `${BASE_URL}/uploads/${r.image}` }
                        alt = "report"
                        onClick = {
                            () =>
                            setPopupImage(`${BASE_URL}/uploads/${r.image}`)
                        }
                        />
                    )
                }

                <
                p style = {
                    { fontSize: "12px" } } > 📍{ r.latitude }, { r.longitude } <
                /p> <
                /div>
            ))
        } <
        /div>

        { /* SECOND MAP */ } <
        h3 style = {
            { marginTop: "20px" } } > 🗺️Map View < /h3>

        <
        MapContainer center = {
            [29.6, 76.9] }
        zoom = { 10 }
        style = {
            { height: "400px", width: "100%" } } >
        <
        TileLayer url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" / >

        {
            filtered.map((r, i) => {
                if (!r.latitude || !r.longitude) return null;

                return ( <
                    Marker key = { i }
                    position = {
                        [r.latitude, r.longitude] } >
                    <
                    Popup >
                    <
                    b > { r.type } < /b> <
                    br / > { r.detection } <
                    /Popup> <
                    /Marker>
                );
            })
        } <
        /MapContainer> <
        /div>
    );
}

export default ReportList;