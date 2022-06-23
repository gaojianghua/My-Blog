import { Avatar, Button, Input, message } from 'antd';
import clsx from 'clsx';
import AppDataSource from 'db/index';
import { Article } from 'db/entity';
import { observer } from 'mobx-react-lite';
import Markdown from 'markdown-to-jsx';
import type { NextPage } from 'next';
import { IArticle } from 'pages/api';
import { format } from 'date-fns';
import styles from './index.module.scss';
import { EditOutlined, FireOutlined, PlusOutlined } from '@ant-design/icons';
import { useStore } from 'store';
import Link from 'next/link';
import { useState } from 'react';
import request from 'service/fetch';

interface IProps {
    article: IArticle;
}

export async function getServerSideProps({ params }: any) {
    const articleId = params?.id;
    const articleRepo = AppDataSource.getRepository(Article);

    const article = await articleRepo.findOne({
        where: {
            id: articleId,
        },
        relations: ['user', 'comments', 'comments.user'],
    });
    if (article) {
        article.views = article?.views + 1;
        await articleRepo.save(article);
    }
    console.log(JSON.parse(JSON.stringify(article)));
    return {
        props: {
            article: JSON.parse(JSON.stringify(article)),
        },
    };
}

const ArticleDetail: NextPage<IProps> = (props) => {
    const { article } = props;
    const store = useStore();
    const loginUserInfo = store?.user?.userInfo;
    const {
        user: { nickname, avatar, id }
    } = article;
    const [comments, setComments] = useState(article?.comments || [])
    const [inputVal, setInputVal] = useState('');
    const [focus, setFocus] = useState(false);

    const handleComment = async () => {
        const res: any = await request.post('/api/comment/publish', {
            articleId: article?.id,
            content: inputVal,
        });
        if (res?.code === 0) {
            message.success('发表成功');
            const newComments = [
                {
                    id: Math.random(),
                    create_time: new Date(),
                    update_time: new Date(),
                    content: inputVal,
                    user: {
                        avatar: loginUserInfo?.avatar,
                        nickname: loginUserInfo?.nickname
                    }
                },
            ].concat([...comments])
            setComments(newComments)
            setInputVal('');
        } else {
            message.error(res?.msg || '发表失败');
        }
    };

    return (
        <div className={clsx(styles.page, 'dflex', 'jcenter')}>
            <div className={styles.content}>
                <div className={styles.articleDetail}>
                    <div className={styles.articleTitle}>{article?.title}</div>
                    <div className={clsx('dflex', 'acenter')}>
                        <Avatar
                            className={styles.avatar}
                            src={avatar}
                            size={40}
                        />
                        <div>
                            <span className={styles.nickname}>{nickname}</span>
                            <div
                                className={clsx(
                                    styles.userMsg,
                                    'dflex',
                                    'acenter'
                                )}
                            >
                                <span className={styles.time}>
                                    {format(
                                        new Date(article?.update_time),
                                        'yyyy年MM月dd日 hh:mm'
                                    )}
                                    &nbsp;
                                </span>
                                <span>·&nbsp;&nbsp;阅读 {article?.views}</span>
                            </div>
                        </div>
                        {Number(loginUserInfo?.userId) === Number(id) ? (
                            <Link href="">
                                <Button
                                    className={clsx('mlauto')}
                                    type="primary"
                                    ghost
                                    icon={<EditOutlined />}
                                >
                                    编辑
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                className={clsx('mlauto')}
                                type="primary"
                                ghost
                                icon={<PlusOutlined />}
                            >
                                关注
                            </Button>
                        )}
                    </div>
                    <div className={styles.articleContent}>
                        <Markdown>{article?.content}</Markdown>
                    </div>
                </div>
                <div className={styles.comment}>
                    <div className={styles.title}>评论</div>
                    <div className={styles.userCom}>
                        <Avatar src={avatar} size={40}></Avatar>
                        <div className={styles.userContent}>
                            <textarea
                                placeholder="输入评论（Enter换行，Ctrl + Enter发送）"
                                value={inputVal}
                                onFocus={(e) => setFocus(true)}
                                onBlur={(e) => setFocus(false)}
                                className={clsx(
                                    styles.testarea,
                                    focus && styles.testareaActive
                                )}
                                onChange={(e) => setInputVal(e?.target?.value)}
                            />
                            {focus ? (
                                <div
                                    onMouseDown={(e) => e.preventDefault()}
                                    className={styles.operation}
                                >
                                    <div className={styles.button}>
                                        <p className={styles.dosc}>
                                            Ctrl + Enter发送
                                        </p>
                                        <Button
                                            type="primary"
                                            onClick={handleComment}
                                        >
                                            发表评论
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <div className={styles.commentContent}>
                        <div className={styles.title}>
                            全部评论
                            <FireOutlined className={styles.commentIcon} />
                        </div>
                        <div className={styles.display}>
                            {comments?.map((comment: any) => (
                                <div
                                    className={clsx(styles.wrapper, 'dflex')}
                                    key={comment?.id}
                                >
                                    <Avatar
                                        src={comment?.user?.avatar}
                                        size={40}
                                    />
                                    <div className={styles.commentDetail}>
                                        <div className={clsx(styles.info, 'dflex', 'jsb', 'acenter')}>
                                            <div className={styles.name}>
                                                {comment?.user?.nickname}
                                            </div>
                                            <div className={styles.date}>
                                                {format(new Date(comment?.update_time), 'yyyy-MM-dd hh:mm:ss')}
                                            </div>
                                        </div>
                                        <div className={styles.commentText}>
                                            {comment?.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(ArticleDetail);
