import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

const possiblePaths = [
    'C:\\Program Files\\cloudflared\\cloudflared.exe',
    'C:\\Program Files (x86)\\cloudflared\\cloudflared.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages', 'Cloudflare.cloudflared_1.0.0', 'cloudflared.exe'), // Adjust version if needed
];

let cloudflaredPath = null;

// Search for cloudflared
for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        cloudflaredPath = p;
        break;
    }
}

if (!cloudflaredPath) {
    // try to find it dynamically in WinGet packages
    const wingetPath = path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
    if (fs.existsSync(wingetPath)) {
        const dirs = fs.readdirSync(wingetPath);
        for (const dir of dirs) {
            if (dir.toLowerCase().includes('cloudflared')) {
                const exePath = path.join(wingetPath, dir, 'cloudflared.exe');
                if (fs.existsSync(exePath)) {
                    cloudflaredPath = exePath;
                    break;
                }
            }
        }
    }
}

if (cloudflaredPath) {
    console.log(`Found cloudflared at: ${cloudflaredPath}`);
    console.log('Starting tunnel...');
    const child = spawn(cloudflaredPath, ['tunnel', '--url', 'http://localhost:3000'], { stdio: 'inherit' });
    child.on('error', (err) => console.error('Error starting cloudflared:', err));
} else {
    console.error('cloudflared not found. Please try another tunnel method.');
}
