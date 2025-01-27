import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class StudentInput {
    @Field({
        description: '昵称',
        nullable: true,
    })
    name: string

    @Field({
        description: '手机号',
        nullable: true,
    })
    tel: string

    @Field({
        description: '账号',
        nullable: true,
    })
    account: string

    @Field({
        description: '头像',
        nullable: true,
    })
    avatar: string
}
