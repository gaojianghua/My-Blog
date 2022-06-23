import { useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { Button, Avatar, Dropdown, Menu, message } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import { useStore } from 'store/index';
import { navs } from './config';
import styles from './index.module.scss';
import Login from 'components/Login';
import request from 'service/fetch';

const Navbar: NextPage = () => {
    const store = useStore();
    const { userId, nickname, avatar } = store.user.userInfo;
    console.log(userId);
    const { pathname, push } = useRouter();
    const [isShowLogin, setIsShowLogin] = useState(false);
    const writeArticle = () => {
        if (userId) {
            push('/editor/new');
        } else {
            message.warning('请先登录');
        }
    };
    const login = () => {
        setIsShowLogin(true);
    };
    const onClose = () => {
        setIsShowLogin(false);
    };
    const GotoHomePage = () => {
        push(`/user/${userId}`);
    };
    const logOut = async () => {
        const res: any = await request.post('/api/user/logout');
        if (res?.code === 0) {
            store.user.setUserInfo({});
        }
    };
    const renderDropDownMenu = () => {
        return (
            <Menu
                items={[
                    {
                        key: '1',
                        icon: <HomeOutlined />,
                        label: '个人主页',
                        onClick: GotoHomePage,
                    },
                    {
                        key: '2',
                        icon: <LoginOutlined />,
                        label: '退出登录',
                        onClick: logOut,
                    },
                ]}
            ></Menu>
        );
    };
    return (
        <div className={styles.navbar}>
            <section className={styles.logoArea}>诤言天论</section>
            <section className={styles.linkArea}>
                {navs?.map((nav) => (
                    <Link key={nav?.label} href={nav?.value}>
                        <div>
                            <a
                                className={
                                    pathname === nav?.value ? styles.active : ''
                                }
                            >
                                {nav?.label}
                            </a>
                        </div>
                    </Link>
                ))}
            </section>
            <section className={styles.operationArea}>
                <Button onClick={writeArticle} type="primary">
                    写文章
                </Button>
                {userId ? (
                    <>
                        <Dropdown
                            overlay={renderDropDownMenu}
                            placement="bottomLeft"
                        >
                            <Avatar
                                src={avatar}
                                size={36}
                                className={styles.avatar}
                            ></Avatar>
                        </Dropdown>
                    </>
                ) : (
                    <Button onClick={login} type="primary">
                        登录
                    </Button>
                )}
            </section>
            <Login isShow={isShowLogin} onClose={onClose} />
        </div>
    );
};

export default observer(Navbar);
