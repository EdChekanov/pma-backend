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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const boards_service_1 = require("../boards/boards.service");
const columns_service_1 = require("../columns/columns.service");
const tasks_entity_1 = require("./tasks.entity");
let TasksService = class TasksService {
    constructor(tasksRepository, columnRepository, boardRepository) {
        this.tasksRepository = tasksRepository;
        this.columnRepository = columnRepository;
        this.boardRepository = boardRepository;
    }
    async getAll(boardId, columnId) {
        this.boardRepository.isExist(boardId);
        this.columnRepository.isExist(columnId);
        const resp = await this.tasksRepository
            .createQueryBuilder('tasks')
            .where({ boardId, columnId })
            .select([
            'tasks.id',
            'tasks.title',
            'tasks.order',
            'tasks.description',
            'tasks.userId',
            'tasks.boardId',
            'tasks.columnId',
            'files.filename',
            'files.fileSize',
        ])
            .leftJoin('tasks.files', 'files')
            .getMany();
        return resp;
    }
    async getById(boardId, columnId, taskId) {
        this.boardRepository.isExist(boardId);
        this.columnRepository.isExist(columnId);
        const task = await this.tasksRepository
            .createQueryBuilder('tasks')
            .where({ boardId, columnId, id: taskId })
            .select([
            'tasks.id',
            'tasks.title',
            'tasks.order',
            'tasks.description',
            'tasks.userId',
            'tasks.boardId',
            'tasks.columnId',
            'files.filename',
            'files.fileSize',
        ])
            .leftJoin('tasks.files', 'files')
            .getOne();
        if (!task) {
            throw new common_1.HttpException('Task was not founded!', common_1.HttpStatus.NOT_FOUND);
        }
        return task;
    }
    async create(boardId, columnId, taskDto) {
        this.boardRepository.isExist(boardId);
        this.columnRepository.isExist(columnId);
        const modelTask = await this.tasksRepository.create({ ...taskDto, columnId, boardId }).save();
        return modelTask;
    }
    async remove(boardId, columnId, taskId) {
        this.boardRepository.isExist(boardId);
        this.columnRepository.isExist(columnId);
        const task = (await this.tasksRepository.findOne({ where: { boardId, columnId, id: taskId } }));
        if (!task) {
            throw new common_1.HttpException('Task was not founded!', common_1.HttpStatus.NOT_FOUND);
        }
        await task.remove();
    }
    async update(boardId, columnId, taskId, body) {
        this.boardRepository.isExist(boardId);
        this.columnRepository.isExist(columnId);
        const task = (await this.tasksRepository.findOne({ where: { boardId, columnId, id: taskId } }));
        if (!task) {
            throw new common_1.HttpException('Task was not founded!', common_1.HttpStatus.NOT_FOUND);
        }
        task.title = body.title;
        task.order = body.order;
        task.description = body.description;
        task.userId = body.userId;
        task.boardId = body.boardId;
        task.columnId = body.columnId;
        const data = await task.save();
        return data;
    }
};
TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tasks_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        columns_service_1.ColumnsService,
        boards_service_1.BoardsService])
], TasksService);
exports.TasksService = TasksService;
