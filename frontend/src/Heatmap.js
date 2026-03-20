import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

function Heatmap({ reports }) {
    const map = useMap();

    useEffect(() => {
        if (!reports.length) return;

        const points = reports
            .filter(r => r.latitude && r.longitude)
            .map(r => [r.latitude, r.longitude, 0.5]);

        const heat = L.heatLayer(points, { radius: 25 }).addTo(map);

        return () => {
            map.removeLayer(heat);
        };
    }, [reports, map]);

    return null;
}

export default Heatmap;