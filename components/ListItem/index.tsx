import type { NextPage } from 'next';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns'
import { IArticle } from 'pages/api/index';
import { markdownToTxt } from 'markdown-to-txt'
import styles from './index.module.scss';
import { EyeOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import clsx from 'clsx';

interface IProps {
    article: IArticle;
}

const ListItem = (props: IProps) => {
    const { article } = props;
    return (
        <Link href={`/article/${article.id}`}>
            <div className={clsx(styles.container, 'cur')}>
                <div className={styles.article}>
                    <div className={styles.userInfo}>
                        <span style={{color: '#4e5969'}}>
                            {article?.user?.nickname}
                        </span>
                        <span style={{color: '#80909c'}}>
                            {formatDistanceToNow(new Date(article?.update_time))}
                        </span>
                    </div>
                    <div className={styles.title}>{article?.title}</div>
                    <p className={clsx(styles.content, 'textellipsis1')}>{markdownToTxt(article?.content)}</p>
                    <div className={clsx('dflex', 'acenter')}>
                        <div>
                            <EyeOutlined className={clsx('textmain')}/>
                            <span className={clsx('ml', 'textmain')}>{article?.views}</span>
                        </div>
                        <div className={clsx('ml2')}>
                            <LikeOutlined className={clsx('textmain')}/>
                            <span className={clsx('ml', 'textmain')}>{article?.views}</span>
                        </div>
                        <div className={clsx('ml2')}>
                            <MessageOutlined className={clsx('textmain')}/>
                            <span className={clsx('ml', 'textmain')}>{article?.views}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ListItem;
