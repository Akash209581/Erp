// Using native fetch

async function mockDriverApp() {
    const busId = 1;
    const url = `http://localhost:3000/transport/location/${busId}`;
    
    // Mock coordinates near Guntur
    const latitude = 16.2345 + (Math.random() - 0.5) * 0.01;
    const longitude = 80.4567 + (Math.random() - 0.5) * 0.01;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude })
        });
        const data = await res.json();
        console.log('Mock Driver App: Location sent!', data);
    } catch (err) {
        console.error('Mock Driver App: Failed to send location', err.message);
    }
}

mockDriverApp();
