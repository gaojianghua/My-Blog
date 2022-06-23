import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Input, Button, message } from 'antd'
import styles from './index.module.scss'
import request from 'service/fetch';
import { observer } from 'mobx-react-lite'
import AppDataSource from 'db';
import { Article } from 'db/entity';
import { useRouter } from 'next/router';
import { IArticle } from 'pages/api';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

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
        relations: ['user'],
    });
    console.log(JSON.parse(JSON.stringify(article)));
    return {
        props: {
            article: JSON.parse(JSON.stringify(article)),
        },
    };
}


const ModifyEditor = ({ article }: IProps) => {
    const { push, query } = useRouter()
    const articleId = Number(query?.id)
    const [title, setTitle] = useState(article?.title || '')
    const [content, setContent] = useState(article?.content || '')

    const handlePublish = async () => {
        if (!title) {
            message.warning('请输入文章标题')
        } else {
            let res: any = await request.post('/api/article/update', {
                id: articleId,
                title,
                content
            })
            console.log(res)
            if (res?.code === 0) {
                articleId ? push(`/article/${articleId}`) : push('/')
                message.success('更新成功')
            }else {
                message.error(res?.msg || '更新失败')
            }
        }
    }
    const handleTitleChange = (e: any) => {
        setTitle(e?.target?.value)
    }
    const handleContentChange = (e: any) => {
        setContent(e)
    }

    return (
        <div className={styles.container}>
            <div className={styles.operation}>
                <Input value={title} className={styles.title} placeholder="请输入文章标题" onChange={handleTitleChange}></Input>
                <Button className={styles.button} type="primary" onClick={handlePublish}>发布</Button>
            </div>
            <MDEditor height={1080} value={content} onChange={handleContentChange} />
        </div>
    );
}

(ModifyEditor as any).layout = null

export default observer(ModifyEditor);