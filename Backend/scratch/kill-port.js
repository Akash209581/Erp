import { execSync } from 'child_process';
import os from 'os';

function killPort3000() {
    if (os.platform() === 'win32') {
        try {
            const stdout = execSync('netstat -ano | findstr :3000').toString();
            const lines = stdout.split('\n');
            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                if (parts.length > 4 && parts[1].includes(':3000')) {
                    const pid = parts[4];
                    if (pid !== '0') {
                        console.log(`Killing PID ${pid}`);
                        try {
                            execSync(`taskkill /PID ${pid} /F`);
                            console.log(`Killed ${pid}`);
                        } catch(e) {}
                    }
                }
            });
        } catch (err) {
            console.log('No process on port 3000');
        }
    }
}

killPort3000();
