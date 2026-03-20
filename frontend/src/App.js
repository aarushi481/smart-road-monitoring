import React, { useState, useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import Dashboard from "./Dashboard";
import Heatmap from "./Heatmap";
import ReportList from "./ReportList";

import "./App.css";

const BASE_URL = "http://localhost:3001";

/* ✅ FIX MARKER ICON ISSUE */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

/* 📍 CLICK MARKER */
function LocationMarker({
    markers,
    setMarkers,
    reportType,
    image,
    setPopupImage,
}) {
    useMapEvents({
        click(e) {
            if (!image) {
                alert("Upload image first!");
                return;
            }

            const formData = new FormData();
            formData.append("latitude", e.latlng.lat);
            formData.append("longitude", e.latlng.lng);
            formData.append("type", reportType);
            formData.append("image", image);

            axios.post(`${BASE_URL}/upload`, formData).then((res) => {
                const newReport = res.data.report;

                setMarkers((prev) => [...prev, newReport]);
            });
        },
    });

    return ( <
        > {
            markers.map((r, i) => {
                if (!r.latitude || !r.longitude) return null;

                return ( <
                    Marker key = { i }
                    position = {
                        [r.latitude, r.longitude] } >
                    <
                    Popup >
                    <
                    b > { r.type } < /b> <
                    br / >

                    {
                        r.image && ( <
                            img src = { `${BASE_URL}/uploads/${r.image}` }
                            width = "150"
                            alt = "report"
                            onClick = {
                                () =>
                                setPopupImage(`${BASE_URL}/uploads/${r.image}`)
                            }
                            style = {
                                { cursor: "pointer" } }
                            />
                        )
                    }

                    <
                    p style = {
                        {
                            color: r.detection === "POTHOLE" ? "red" : "green",
                        }
                    } >
                    { r.detection || "Processing..." } <
                    /p> <
                    /Popup> <
                    /Marker>
                );
            })
        } <
        />
    );
}

/* 🚀 MAIN APP */
function App() {
    const [markers, setMarkers] = useState([]);
    const [reportType, setReportType] = useState("Pothole");
    const [image, setImage] = useState(null);
    const [popupImage, setPopupImage] = useState(null);

    useEffect(() => {
        axios.get(`${BASE_URL}/reports`).then((res) => {
            setMarkers(res.data);
        });
    }, []);

    return ( <
        div > { /* NAVBAR */ } <
        div className = "navbar" >
        <
        h2 > 🚧Smart Road Monitoring < /h2> <
        /div>

        <
        div className = "main-container" > { /* CONTROLS */ } <
        div className = "card" >
        <
        h3 > Add Report < /h3>

        <
        select value = { reportType }
        onChange = {
            (e) => setReportType(e.target.value) } >
        <
        option > Pothole < /option> <
        option > Accident < /option> <
        option > Construction < /option> <
        /select>

        <
        br / >
        <
        br / >

        <
        input type = "file"
        onChange = {
            (e) => setImage(e.target.files[0]) }
        /> <
        /div>

        { /* MAIN MAP */ } <
        MapContainer center = {
            [29.6857, 76.9905] }
        zoom = { 13 }
        style = {
            { height: "500px", width: "100%" } } >
        <
        TileLayer url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" / >

        <
        LocationMarker markers = { markers }
        setMarkers = { setMarkers }
        reportType = { reportType }
        image = { image }
        setPopupImage = { setPopupImage }
        />

        <
        Heatmap reports = { markers }
        /> <
        /MapContainer>

        { /* IMAGE POPUP */ } {
            popupImage && ( <
                div className = "popup"
                onClick = {
                    () => setPopupImage(null) } >
                <
                img src = { popupImage }
                alt = "popup" / >
                <
                /div>
            )
        }

        { /* DASHBOARD */ } <
        Dashboard reports = { markers }
        />

        { /* REPORT LIST */ } <
        ReportList reports = { markers }
        setPopupImage = { setPopupImage }
        /> <
        /div> <
        /div>
    );
}

export default App;