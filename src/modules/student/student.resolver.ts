// resolver文件（写接口）
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { StudentService } from './student.service'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '@/common/guards/auth.guards'
import { CurUserId } from '@/common/decorators/current-user.decorator'
import { StudentResult, StudentResults } from './dto/result-student.output'
import { StudentType } from './dto/student.type'
import {
    COURSE_DEL_FAIL,
    COURSE_NOT_EXIST,
    STUDENT_NOT_EXIST,
    SUCCESS,
} from '@/common/constants/code'
import { StudentInput } from './dto/student-input.type'
import { Result } from '@/common/dto/result.type'
import { PageInput } from '@/common/dto/page.input'
import { Like } from 'typeorm'

@Resolver(() => StudentType)
@UseGuards(GqlAuthGuard)
export class StudentResolver {
    constructor(private readonly studentService: StudentService) {}
    // 根据id查询学员信息
    @Query(() => StudentResult)
    async getStudentInfo(@Args('id') id: string): Promise<StudentResult> {
        const result = await this.studentService.findById(id)
        console.log('result', result)
        if (result) {
            return {
                code: SUCCESS,
                data: result,
                message: '获取成功',
            }
        }
        return {
            code: STUDENT_NOT_EXIST,
            message: '用户信息不存在',
        }
    }
    // 编辑学员信息
    @Mutation(() => StudentResult)
    async commitStudentInfo(
        @Args('params') params: StudentInput,
        @CurUserId() userId: string,
    ): Promise<Result> {
        const student = await this.studentService.findById(userId)
        if (student) {
            const res = await this.studentService.updateById(student.id, params)
            if (res) {
                return {
                    code: SUCCESS,
                    message: '更新成功',
                }
            }
            return {
                code: STUDENT_NOT_EXIST,
                message: '用户信息不存在',
            }
        }
    }
    // 获取所有的学员信息
    @Query(() => StudentResults)
    async getStudents(
        @Args('page') page: PageInput,
        @Args('name', { nullable: true }) name?: string,
    ): Promise<StudentResults> {
        const { pageNum, pageSize } = page
        const where: any = {}
        if (name) {
            where.name = Like(`%${name}%`)
        }
        const [result, total] = await this.studentService.findStudents({
            start: (pageNum - 1) * pageSize,
            length: pageSize,
            where,
        })
        if (result) {
            return {
                code: SUCCESS,
                data: result,
                page: {
                    pageNum,
                    pageSize,
                    total,
                },
                message: '获取成功',
            }
        }
    }
    // 删除学员信息
    @Mutation(() => Result)
    async deleteStudent(
        @Args('id') id: string,
        @CurUserId() userId: string,
    ): Promise<Result> {
        const result = await this.studentService.findById(id)
        if (result) {
            const delRes = await this.studentService.deleteStudent(id, userId)
            if (delRes) {
                return {
                    code: SUCCESS,
                    message: '删除成功',
                }
            }
            return {
                code: COURSE_DEL_FAIL,
                message: '删除失败',
            }
        }
        return {
            code: COURSE_NOT_EXIST,
            message: '门店信息不存在',
        }
    }

    // 编辑学员信息（PC）
    @Mutation(() => StudentResult)
    async commitStudentInfoPC(
        @Args('params') params: StudentInput,
        @Args('id') id: string,
        @CurUserId() userId: string,
    ): Promise<Result> {
        const student = await this.studentService.findById(id)
        if (student) {
            const res = await this.studentService.updateById(student.id, {
                ...params,
                updatedBy: userId,
            })
            if (res) {
                return {
                    code: SUCCESS,
                    message: '更新成功',
                }
            }
            return {
                code: STUDENT_NOT_EXIST,
                message: '学员信息不存在',
            }
        }
    }
}
