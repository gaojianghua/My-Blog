import 'reflect-metadata';
import { DataSource } from 'typeorm';
import ormConfig from 'ormConfig';
import { User, UserAuth, Article, Comment, Tag } from './entity/index';

const AppDataSource = new DataSource({
    ...ormConfig,
    entities: [UserAuth, User, Article, Comment, Tag],
    synchronize: false,
    logging: true,
});
AppDataSource.initialize()
//     .then((e) => {
//         console.log('初始化')
//     })
//     .catch((error) => console.log(error, '---'));

export default AppDataSource