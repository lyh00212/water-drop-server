import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import * as dayjs from 'dayjs'
import * as md5 from 'md5'
import { AuthService } from './auth.service'
import { UserService } from '@/modules/user/user.service'
import { StudentService } from '@/modules/student/student.service'
import { Result } from '@/common/dto/result.type'
import { accountAndPwdValidate } from '@/shared/utils'
import {
    ACCOUNT_EXIST,
    ACCOUNT_NOT_EXIST,
    CODE_NOT_EXIST,
    CODE_NOT_EXPIRE,
    LOGIN_ERROR,
    REGISTER_ERROR,
    SUCCESS,
} from '@/common/constants/code'

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly studentService: StudentService,
        private readonly jwtService: JwtService,
    ) {}

    @Mutation(() => Result, { description: '发送短信验证码' })
    async sendCodeMsg(@Args('tel') tel: string): Promise<Result> {
        console.log(tel)
        return await this.authService.sendCodeMsg(tel)
    }

    @Mutation(() => Result, { description: '登录' })
    async login(
        @Args('tel') tel: string,
        @Args('code') code: string,
    ): Promise<Result> {
        const user = await this.userService.findByTel(tel)
        if (!user) {
            return {
                code: ACCOUNT_NOT_EXIST,
                message: '账号不存在',
            }
        }
        if (!user.codeCreateTimeAt || !user.code) {
            return {
                code: CODE_NOT_EXIST,
                message: '验证码不存在',
            }
        }
        if (dayjs().diff(dayjs(user.codeCreateTimeAt)) > 1000 * 60 * 60) {
            return {
                code: CODE_NOT_EXPIRE,
                message: '验证码已过期',
            }
        }
        if (user.code === code) {
            // 使用id生产jwt格式的token
            const token = this.jwtService.sign({
                id: user.id,
            })
            return {
                code: SUCCESS,
                message: '登录成功',
                data: token,
            }
        }
        return {
            code: LOGIN_ERROR,
            message: '登录失败，手机号或者验证码不对',
        }
    }

    // mobile-学员登录
    @Mutation(() => Result, { description: '学员登录' })
    async studentLogin(
        @Args('account') account: string,
        @Args('password') password: string,
    ): Promise<Result> {
        console.log('account, password', account, password)
        // 先校验账号密码格式
        const result = await accountAndPwdValidate(account, password)
        if (result.code !== SUCCESS) {
            return result
        }
        // 判断该账户是否存在
        const student = await this.studentService.findByAccount(account)
        if (!student) {
            return {
                code: ACCOUNT_NOT_EXIST,
                message: '账户不存在',
            }
        }
        // 需要对密码进行 md5 加密
        if (student.password === md5(password)) {
            const token = this.jwtService.sign({
                id: student.id,
            })
            return {
                code: SUCCESS,
                message: '登陆成功',
                data: token,
            }
        }
        return {
            code: LOGIN_ERROR,
            message: '登陆失败，账号或密码错误',
        }
    }

    // mobile-学员注册
    @Mutation(() => Result, { description: '学员注册' })
    async studentRegister(
        @Args('account') account: string,
        @Args('password') password: string,
    ): Promise<Result> {
        // 先校验账号密码格式
        const result = await accountAndPwdValidate(account, password)
        if (result.code !== SUCCESS) {
            return result
        }
        // 判断该账户是否被注册
        const student = await this.studentService.findByAccount(account)
        if (student) {
            return {
                code: ACCOUNT_EXIST,
                message: '账户已注册过',
            }
        } else {
            console.log('account,password', account, password)
            const student = await this.studentService.create({
                account,
                password: md5(password),
            })
            if (student) {
                return {
                    code: SUCCESS,
                    message: '注册成功',
                }
            } else {
                return {
                    code: REGISTER_ERROR,
                    message: '注册失败',
                }
            }
        }
    }
}
