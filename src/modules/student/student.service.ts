import { Injectable } from '@nestjs/common'
import { DeepPartial, Repository } from 'typeorm'
import { Student } from './models/student.entity'
import { InjectRepository } from '@nestjs/typeorm'

// service文件（写方法）
@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
    ) {}
    // 根据账户查数据
    async findByAccount(account: string): Promise<Student> {
        return this.studentRepository.findOne({
            where: {
                account,
            },
        })
    }
    async create(entity: DeepPartial<Student>): Promise<boolean> {
        // 这样创建的时候会帮我们加入createAt创建时间
        const res = await this.studentRepository.save(
            this.studentRepository.create(entity),
        )
        if (res) {
            return true
        }
        return false
    }

    // 根据ID查学员信息
    async findById(id: string): Promise<Student> {
        console.log('id', id)
        return this.studentRepository.findOne({
            where: {
                id,
            },
        })
    }

    // 根据ID删除学员信息
    async deleteStudent(id: string, userId: string): Promise<boolean> {
        // 确认删除人信息
        const res1 = await this.studentRepository.update(id, {
            deletedBy: userId,
        })
        if (res1) {
            const res = await this.studentRepository.softDelete(id)
            if (res.affected > 0) {
                return true
            }
        }
        return false
    }

    // 更新学员信息
    async updateById(
        id: string,
        entity: DeepPartial<Student>,
    ): Promise<boolean> {
        const res = await this.studentRepository.update(id, entity)
        if (res.affected > 0) {
            return true
        }
        return false
    }

    // 获取所有的学员信息
    async findStudents({
        start,
        length,
        where,
    }: {
        start: number
        length: number
        where: any
    }): Promise<[Student[], number]> {
        return this.studentRepository.findAndCount({
            take: length,
            skip: start,
            where,
            order: {
                createdAt: 'ASC',
            },
        })
    }
}
