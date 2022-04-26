"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.join(__dirname, '.env'),
});
exports.default = {
    type: 'postgres',
    host: 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10),
    cache: false,
    username: 'postgres',
    password: '36ed',
    database: 'postgres',
    synchronize: false,
    logging: false,
    entities: ['src/resources/**/**.entity{.ts,.js}'],
    migrations: ['./migrations/*.ts'],
};
