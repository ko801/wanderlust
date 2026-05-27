if (document.getElementById("listing-map")) {

    const map = L.map("listing-map").setView(
        [mapCoordinates.lat, mapCoordinates.lng],
        13
    );

    // Load OpenStreetMap tiles — completely free, no key needed
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }).addTo(map);

    
    const redIcon = L.divIcon({
        className: "",
        html: `
            <div style="
                background-color: #FF385C;
                width: 36px;
                height: 36px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid #fff;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            "></div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
    });

    // Add marker with popup
    L.marker([mapCoordinates.lat, mapCoordinates.lng], { icon: redIcon })
        .addTo(map)
        .bindPopup(
            `<b style="font-size:14px;">${listingTitle}</b><br>
             <span style="font-size:12px; color:#717171;">${listingLocation}</span><br>
             <span style="font-size:11px; color:#717171;">Exact location provided after booking</span>`
        )
        .openPopup();

    // Privacy circle — Airbnb style
    L.circle([mapCoordinates.lat, mapCoordinates.lng], {
        color: "#FF385C",
        fillColor: "#FF385C",
        fillOpacity: 0.15,
        radius: 500,
        weight: 1.5,
    }).addTo(map);
}
