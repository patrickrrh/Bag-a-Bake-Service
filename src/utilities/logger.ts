import fs from 'fs';
import path from 'path';

class Logger {
    private filePath: string;

    constructor(fileName: string) {
        this.filePath = path.join(__dirname, '..', '..', 'logs', fileName);
        this.ensureLogFileExists();
    }

    private ensureLogFileExists() {
        const dirPath = path.dirname(this.filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, '', { encoding: 'utf8' });
        }
    }

    public log(message: string): void {
        const timestamp = new Date().toISOString();
        fs.appendFileSync(this.filePath, `[${timestamp}] ${message}\n`, 'utf8');
    }

    public error(message: string): void {
        this.log(`ERROR: ${message}`);
    }
}

const logger = new Logger('log.txt');
export default logger;
