import type { NextPage } from 'next';
import { Article } from 'db/entity';
import AppDataSource from 'db/index';
import ListItem from 'components/ListItem';
import styles from './index.module.scss';
import { useState } from 'react';
import clsx from 'clsx';
import { IArticle } from 'pages/api/index';

interface IProps {
    articles: IArticle[];
}

export async function getServerSideProps() {
    const articleRepo = AppDataSource.getRepository(Article);
    const articles = await articleRepo.find({
        relations: ['user'],
    });
    console.log(JSON.parse(JSON.stringify(articles)));
    return {
        props: {
            articles: JSON.parse(JSON.stringify(articles)),
        },
    };
}

interface IOptions {
    name: string;
    value: number;
}

const Home: NextPage<IProps> = ({ articles }) => {
    const [options, setOptions] = useState([
        {
            name: '推荐',
            value: 1,
        },
        {
            name: '最新',
            value: 2,
        },
        {
            name: '热榜',
            value: 3,
        },
    ]);
    const [optionActive, setOptionActive] = useState(1)

    return (
        <div className={styles.home}>
            <div className={styles.list}>
                <div className={styles.listMenu}>
                    {
                        options?.map(item => (
                            <span key={item.value} className={clsx('cur', styles.optionsItem, optionActive === item.value && styles.colors)}>
                                {item.name}
                            </span>
                        ))
                    }
                </div>
                <div className={styles.listContent}>
                    {articles?.map((article, i) => (
                        <ListItem article={article} key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Home;
