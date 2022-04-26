import { Repository } from 'typeorm';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column, IColumn } from './columns.entity';
import { BoardsService } from '../boards/boards.service';
export declare class ColumnsService {
    private columnsRepository;
    private boardRepository;
    constructor(columnsRepository: Repository<Column>, boardRepository: BoardsService);
    isExist(id: UUIDType): Promise<boolean>;
    getAll(boardId: UUIDType): Promise<IColumn[]>;
    getById(boardId: UUIDType, columnId: UUIDType): Promise<IColumn>;
    create(boardId: UUIDType, columnDto: CreateColumnDto): Promise<IColumn>;
    remove(boardId: UUIDType, columnId: UUIDType): Promise<void>;
    update(boardId: UUIDType, columnId: UUIDType, body: UpdateColumnDto): Promise<IColumn>;
}
