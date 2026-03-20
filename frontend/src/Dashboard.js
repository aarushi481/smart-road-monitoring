import React from "react";

function Dashboard({ reports }) {
    const total = reports.length;
    const potholes = reports.filter(r => r.type === "Pothole").length;
    const accidents = reports.filter(r => r.type === "Accident").length;
    const construction = reports.filter(r => r.type === "Construction").length;
    const detected = reports.filter(r => r.detection === "POTHOLE").length;

    return ( <
        div style = {
            { marginTop: "30px" } } >
        <
        h2 > 📊Dashboard < /h2>

        <
        div className = "dashboard-grid" >
        <
        div className = "stat-card" > Total { total } < /div> <
        div className = "stat-card" > Potholes { potholes } < /div> <
        div className = "stat-card" > Accidents { accidents } < /div> <
        div className = "stat-card" > Construction { construction } < /div> <
        div className = "stat-card" > Detected { detected } < /div> <
        /div>

        <
        h3 > Statistics < /h3>

        <
        div className = "bar-container" >
        <
        Bar label = "Total"
        value = { total }
        /> <
        Bar label = "Potholes"
        value = { potholes }
        color = "red" / >
        <
        Bar label = "Accidents"
        value = { accidents }
        color = "blue" / >
        <
        Bar label = "Construction"
        value = { construction }
        color = "orange" / >
        <
        Bar label = "Detected"
        value = { detected }
        color = "green" / >
        <
        /div> <
        /div>
    );
}

function Bar({ label, value, color = "green" }) {
    return ( <
        div style = {
            { textAlign: "center" } } >
        <
        div className = "bar"
        style = {
            { height: value * 10, background: color } }
        /> <
        p > { label } < /p> <
        /div>
    );
}

export default Dashboard;