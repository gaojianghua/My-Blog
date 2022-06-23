import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import styles from './index.module.scss'
import request from 'service/fetch';
import { observer } from 'mobx-react-lite'
import { useStore } from 'store';
import * as ANTD_ICONS from '@ant-design/icons'
import { Button, message, Tabs } from 'antd';

const { TabPane } = Tabs;

interface IUser {
    id: number;
    nickname: string;
    avatar: string;
}

interface ITag {
    id: number;
    title: string;
    icon: string;
    follow_count: number;
    article_count: number;
    user: IUser[];
}

const Tag: NextPage = () => {
    const store = useStore()
    const [followTags, setFollowTags] = useState<ITag[]>()
    const [allTags, setAllTags] = useState<ITag[]>()
    const [needRefresh, setNeedRefresh] = useState(false)
    const { userId } = store?.user?.userInfo

    useEffect(() => {
        request('/api/tag/get').then((res: any) => {
            if (res?.code === 0) {
                const { followTags = [], allTags = [] } = res?.data
                setFollowTags(followTags)
                setAllTags(allTags)
            }
        })
    }, [needRefresh])

    const tabsChange = () => {

    }

    const handleUnFollow = async (e: number) => {
        const res: any= await request.post('/api/tag/follow', {
            type: 'unfollow',
            tagId: e
        })
        if (res?.code === 0) {
            message.success('取消关注成功')
            const { followTags = [], allTags = [] } = res?.data || {}
            setFollowTags(followTags)
            setAllTags(allTags)
            setNeedRefresh(!needRefresh)
        }else{
            message.success(res?.msg || '取消关注失败')
        }
    }

    const handleFollow = async (e: number) => {
        const res: any= await request.post('/api/tag/follow', {
            type: 'follow',
            tagId: e
        })
        if (res?.code === 0) {
            message.success('关注成功')
            const { followTags = [], allTags = [] } = res?.data || {}
            setFollowTags(followTags)
            setAllTags(allTags)
            setNeedRefresh(!needRefresh)
        }else{
            message.success(res?.msg || '关注失败')
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.contentLayout}>
                <Tabs defaultActiveKey="all" tabBarStyle={{paddingLeft: '20px'}} tabBarGutter={30} onChange={tabsChange}>
                    <TabPane tab="已关注" key="follow" className={styles.follow}>
                        {
                            followTags?.map(tag => (
                                <div key={tag?.title} className={styles.tagWapper}>
                                    <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
                                    <div className={styles.title}>{tag?.title}</div>
                                    <div>{tag?.follow_count} 关注 {tag?.article_count} 文章</div>
                                    {
                                        tag?.user?.find((item) => Number(item?.id) === Number(userId)) ? (
                                            <Button type='primary' onClick={() => handleUnFollow(tag?.id)}>已关注</Button>
                                        ) : (
                                            <Button ghost type='primary' onClick={() => handleFollow(tag?.id)}>关注</Button>
                                        )
                                    }
                                </div>
                            ))
                        }
                    </TabPane>
                    <TabPane tab="全部" key="all" className={styles.follow}>
                    {
                            allTags?.map(tag => (
                                <div key={tag?.title} className={styles.tagWapper}>
                                    <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
                                    <div className={styles.title}>{tag?.title}</div>
                                    <div>{tag?.follow_count} 关注 {tag?.article_count} 文章</div>
                                    {
                                        tag?.user?.find((item) => Number(item?.id) === Number(userId)) ? (
                                            <Button type='primary' onClick={() => handleUnFollow(tag?.id)}>已关注</Button>
                                        ) : (
                                            <Button ghost type='primary' onClick={() => handleFollow(tag?.id)}>关注</Button>
                                        )
                                    }
                                </div>
                            ))
                        }
                    </TabPane>
                    <TabPane tab="Tab 3" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default observer(Tag);
