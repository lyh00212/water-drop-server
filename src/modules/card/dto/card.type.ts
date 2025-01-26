import { CommonType } from '@/common/dto/common.type'
import { CourseType } from '@/modules/course/dto/course.type'
import { Field, ObjectType } from '@nestjs/graphql'

/**
 * 学员
 */
@ObjectType()
export class CardType extends CommonType {
    @Field({
        description: 'id',
    })
    id: string

    @Field({
        description: '名字',
    })
    name: string

    @Field({
        description: `卡类型
         TIME = "time",
        DURATION = "duration"`,
    })
    type: string

    @Field({
        description: '上课次数',
    })
    time: number

    @Field({
        description: '有效期 (天)',
    })
    validateDay: number

    @Field(() => CourseType, {
        description: '课程',
    })
    course: CourseType
}
