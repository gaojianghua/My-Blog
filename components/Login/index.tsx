import CountDown from 'components/CountDown';
import type { NextPage } from 'next';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss';
import { message } from 'antd';
import request from 'service/fetch';
import { useStore } from 'store/index';

interface Iprops {
    isShow: boolean;
    onClose: Function;
}

const Login: NextPage<Iprops> = (props) => {
    const store = useStore();
    const { isShow, onClose } = props;
    const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
    const [form, setForm] = useState({
        phone: '',
        verify: '',
    });
    const toClose = () => {
        onClose && onClose();
    };
    const getVerify = async () => {
        if (!form?.phone) {
            message.warning('请输入手机号');
            return;
        }
        const res: any = await request.post('/api/user/sendVerifyCode', {
            to: form?.phone,
            templateId: 1,
        });
        if (res?.code === 0) {
            setIsShowVerifyCode(true);
        } else {
            message.warning(res?.msg || '未知错误');
        }
    };
    const openLogin = async () => {
        const res: any = await request.post('/api/user/login', {
            ...form,
            identity_type: 'phone',
        });
        if (res?.code === 0) {
            // 登录成功
            store.user.setUserInfo(res?.data);

            onClose && onClose();
        } else {
            message.warning(res?.msg || '未知错误');
        }
    };
    // 9ee7f60894e39b7ee3f6
    // d51c94429e77ef1666fa15c3384e85faf8f49861
    const otherLogin = () => {
        const githubClientID = '9ee7f60894e39b7ee3f6';
        const redirectUri = 'http://localhost:3000/api/oauth/redirect';

        window.open(`https://github.com/login/oauth/authorize?client_id=${githubClientID}&redirect_uri=${redirectUri}`);
    };
    const phoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;
        setForm({
            ...form,
            [name]: value,
        });
    };
    const verifyChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;
        setForm({
            ...form,
            [name]: value,
        });
    };
    const countDownEnd = () => {
        setIsShowVerifyCode(false);
    };
    return isShow ? (
        <div className={styles.loginArea}>
            <div className={styles.lgoinBox}>
                <div className={styles.lgoinTitle}>
                    <div>手机号登录</div>
                    <div className={styles.close} onClick={toClose}>
                        x
                    </div>
                </div>
                <input
                    name="phone"
                    type="number"
                    placeholder="请输入手机号"
                    value={form.phone}
                    onChange={phoneChange}
                />
                <div className={styles.verifyCodeArea}>
                    <input
                        name="verify"
                        type="number"
                        placeholder="请输入验证码"
                        value={form.verify}
                        onChange={verifyChange}
                    />
                    <span className={styles.verifyCode} onClick={getVerify}>
                        {isShowVerifyCode ? (
                            <CountDown time={10} onEnd={countDownEnd} />
                        ) : (
                            '获取验证码'
                        )}
                    </span>
                </div>
                <div className={styles.loginBtn} onClick={openLogin}>
                    登录
                </div>
                <div className={styles.otherLogin} onClick={otherLogin}>
                    使用 GitHub 登录
                </div>
                <div className={styles.loginPrivacy}>
                    注册登录即表示同意
                    <a href="http://gaojianghua.cn:3000/">隐私政策</a>
                </div>
            </div>
        </div>
    ) : null;
};

export default observer(Login);
