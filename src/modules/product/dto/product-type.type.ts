import { Field, ObjectType } from '@nestjs/graphql'

/**
 * 商品类型
 */
@ObjectType()
export class ProductTypeType {
    @Field({
        description: 'key',
    })
    key: string

    @Field({
        description: '名称',
        nullable: true,
    })
    title: string
}
