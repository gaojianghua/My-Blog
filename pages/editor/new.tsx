import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Input, Button, message } from 'antd'
import styles from './index.module.scss'
import request from 'service/fetch';
import { observer } from 'mobx-react-lite'
import { useStore } from 'store';
import { useRouter } from 'next/router';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor = () => {
    const store = useStore()
    const { push } = useRouter()
    const { userId } = store.user.userInfo
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handlePublish = async () => {
        if (!title) {
            message.warning('请输入文章标题')
        } else {
            let res: any = await request.post('/api/article/publish', {
                title,
                content
            })
            console.log(res)
            if (res?.code === 0) {
                userId ? push(`/user/${userId}`) : push('/')
                message.success('发布成功')
            }else {
                message.error(res?.msg || '发布失败')
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

(NewEditor as any).layout = null

export default observer(NewEditor);