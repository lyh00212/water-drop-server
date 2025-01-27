import { Module } from '@nestjs/common'
import { ProductModule } from './modules/product/product.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/user/user.module'
import { OSSModule } from './modules/oss/oss.module'
import { AuthModule } from './modules/auth/auth.module'
import { OrganizationModule } from './modules/organization/organization.module'
import { StudentModule } from './modules/student/student.module'
import { CourseModule } from './modules/course/course.module'
import { CardModule } from './modules/card/card.module'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'Llyh0212',
            database: 'water-drop',
            // 指定项目里哪些文件是映射数据表的文件
            entities: [`${__dirname}/../modules/**/*.entity{.ts,.js}`],
            // 开启日志
            logging: true,
            // 修改.entity.ts文件时，自动修改数据库表结构
            synchronize: true,
            // 数据库中没有该表时，自动创建数据库表
            autoLoadEntities: true,
        }),
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            autoSchemaFile: './schema.gql',
        }),
        UserModule,
        OSSModule,
        AuthModule,
        StudentModule,
        OrganizationModule,
        CourseModule,
        CardModule,
        ProductModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
