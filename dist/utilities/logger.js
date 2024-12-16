"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Logger {
    constructor(fileName) {
        this.filePath = path_1.default.join(__dirname, '..', '..', 'logs', fileName);
        this.ensureLogFileExists();
    }
    ensureLogFileExists() {
        const dirPath = path_1.default.dirname(this.filePath);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
        if (!fs_1.default.existsSync(this.filePath)) {
            fs_1.default.writeFileSync(this.filePath, '', { encoding: 'utf8' });
        }
    }
    log(message) {
        const timestamp = new Date().toISOString();
        fs_1.default.appendFileSync(this.filePath, `[${timestamp}] ${message}\n`, 'utf8');
    }
    error(message) {
        this.log(`ERROR: ${message}`);
    }
}
const logger = new Logger('log.txt');
exports.default = logger;
