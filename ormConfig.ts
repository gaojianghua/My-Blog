interface OrmConfig{
    type: 'mysql',
    host: string,
    port: number,
    username: string,
    password: string,
    database: string
}

const ormConfig: OrmConfig = {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'tomas'
}

export default ormConfig