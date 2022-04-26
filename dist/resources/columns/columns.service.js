"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const columns_entity_1 = require("./columns.entity");
const boards_service_1 = require("../boards/boards.service");
let ColumnsService = class ColumnsService {
    constructor(columnsRepository, boardRepository) {
        this.columnsRepository = columnsRepository;
        this.boardRepository = boardRepository;
    }
    async isExist(id) {
        const resp = await this.columnsRepository.findOne({ where: { id } });
        if (!resp) {
            throw new common_1.HttpException('Column was not founded!', common_1.HttpStatus.NOT_FOUND);
        }
        return !!resp;
    }
    async getAll(boardId) {
        await this.boardRepository.isExist(boardId);
        const resp = await this.columnsRepository.find({ select: ['id', 'title', 'order'], where: { boardId } });
        return resp;
    }
    async getById(boardId, columnId) {
        await this.boardRepository.isExist(boardId);
        const column = await this.columnsRepository
            .createQueryBuilder('columns')
            .where({ boardId, id: columnId })
            .select([
            'columns.id',
            'columns.title',
            'columns.order',
            'tasks.id',
            'tasks.title',
            'tasks.order',
            'tasks.description',
            'tasks.userId',
            'files.filename',
            'files.fileSize',
        ])
            .leftJoin('columns.tasks', 'tasks')
            .leftJoin('tasks.files', 'files')
            .getOne();
        if (!column) {
            throw new common_1.HttpException('Column was not founded!', common_1.HttpStatus.NOT_FOUND);
        }
        return column;
    }
    async create(boardId, columnDto) {
        await this.boardRepository.isExist(boardId);
        const { id, title, order } = await this.columnsRepository.create({ ...columnDto, boardId }).save();
        return { id, title, order };
    }
    async remove(boardId, columnId) {
        await this.boardRepository.isExist(boardId);
        const column = (await this.columnsRepository.findOne({ where: { boardId, id: columnId } }));
        if (!column) {
            throw new common_1.HttpException('Column was not founded!', common_1.HttpStatus.NOT_FOUND);
        }
        await column.remove();
    }
    async update(boardId, columnId, body) {
        await this.boardRepository.isExist(boardId);
        const column = (await this.columnsRepository.findOne({ where: { boardId, id: columnId } }));
        if (!column) {
            throw new common_1.HttpException('Column was not founded!', common_1.HttpStatus.NOT_FOUND);
        }
        column.title = body.title;
        column.order = body.order;
        const { id, title, order } = await column.save();
        return { id, title, order };
    }
};
ColumnsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(columns_entity_1.Column)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        boards_service_1.BoardsService])
], ColumnsService);
exports.ColumnsService = ColumnsService;
