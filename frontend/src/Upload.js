import React, { useState, useEffect } from "react";

const BASE_URL = "http://localhost:3001";

function Upload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [type, setType] = useState("Pothole");
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    /* 📍 GET LOCATION */
    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
            },
            (err) => {
                console.error(err);
                alert("⚠️ Location permission denied");
            }
        );
    }, []);

    /* 📸 FILE CHANGE + PREVIEW */
    const handleFileChange = (e) => {
        const selected = e.target.files[0];

        if (!selected) return;

        // Optional validation
        if (!selected.type.startsWith("image/")) {
            alert("⚠️ Please upload an image file");
            return;
        }

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    /* 🧹 CLEANUP PREVIEW */
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    /* 📤 UPLOAD */
    const handleUpload = async() => {
        if (!file) return alert("⚠️ Select an image first");
        if (!location.latitude)
            return alert("⏳ Waiting for location...");

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", type);
        formData.append("latitude", location.latitude);
        formData.append("longitude", location.longitude);

        try {
            const res = await fetch(`${BASE_URL}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();

            setResult(data.report ? .detection || "Unknown");

            alert("✅ Uploaded successfully");

            // RESET
            setFile(null);
            setPreview(null);
        } catch (err) {
            console.error(err);
            alert("❌ Upload failed");
        }

        setLoading(false);
    };

    return ( <
        div className = "card" >
        <
        h2 > 📤Upload Report < /h2>

        { /* FILE INPUT */ } <
        input type = "file"
        onChange = { handleFileChange }
        />

        <
        br / > < br / >

        { /* IMAGE PREVIEW */ } {
            preview && ( <
                img src = { preview }
                alt = "preview"
                width = "200"
                style = {
                    { borderRadius: "10px" } }
                />
            )
        }

        <
        br / > < br / >

        { /* TYPE */ } <
        label > Select Type: < /label> <
        select value = { type }
        onChange = {
            (e) => setType(e.target.value) } >
        <
        option value = "Pothole" > Pothole < /option> <
        option value = "Accident" > Accident < /option> <
        option value = "Construction" > Construction < /option> <
        /select>

        <
        br / > < br / >

        { /* BUTTON */ } <
        button onClick = { handleUpload }
        disabled = { loading } > { loading ? "⏳ Uploading..." : "🚀 Upload" } <
        /button>

        <
        br / > < br / >

        { /* LOCATION */ } <
        p > 📍Lat: { location.latitude || "Fetching..." } < /p> <
        p > 📍Lng: { location.longitude || "Fetching..." } < /p>

        { /* RESULT */ } {
            result && ( <
                p style = {
                    {
                        marginTop: "10px",
                        fontWeight: "bold",
                        color: result === "POTHOLE" ? "red" : "green",
                    }
                } >
                🤖Detection: { result } <
                /p>
            )
        } <
        /div>
    );
}

export default Upload;