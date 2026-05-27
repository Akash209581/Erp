// Native fetch

async function run() {
    try {
        const res = await fetch('http://localhost:3000/transport/dashboard/student/211FA04001');
        const text = await res.json();
        console.log('Result:', JSON.stringify(text, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    }
}
run();
