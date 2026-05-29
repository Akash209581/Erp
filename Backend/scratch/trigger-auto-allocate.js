// Native fetch

async function run() {
    try {
        const res = await fetch('http://localhost:3000/transport/auto-allocate/1', {
            method: 'POST'
        });
        const text = await res.text();
        console.log('Result:', text);
    } catch (e) {
        console.error('Error:', e.message);
    }
}
run();
