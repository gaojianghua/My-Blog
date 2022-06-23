import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie'
import { setCookie } from 'utils/index'
import { ironOptions } from 'config/index';
import { UserAuth, User } from 'db/entity';
import { ISession } from 'pages/api/index';
import AppDataSource from 'db/index';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const cookies = Cookie.fromApiRoute(req, res)
    const { phone = '', verify = '', identity_type = 'phone' } = req.body;
    const userAuthRepo = AppDataSource.getRepository(UserAuth);
    
    if (String(session.verifyCode) === String(verify)) {
        // 验证码正确
        const userAuth = await userAuthRepo.findOne({
            relations: ["user"],
            where: {
                identity_type,
                identifier: phone
            }
        });
        if (userAuth) {
            // 已存在的用户
            const user = userAuth.user;
            const { id, nickname, avatar } = user;
            session.userId = id
            session.nickname = nickname
            session.avatar = avatar
            await session.save()
            setCookie(cookies, { id, nickname, avatar })
        } else {
            // 新用户
            const user = new User();
            user.nickname = `用户:${phone}`;
            user.avatar =
                'https://gaojianghua.oss-cn-hangzhou.aliyuncs.com/home/%E7%81%B0%E5%A4%AA%E7%8B%BC.png';
            user.job = '暂无';
            user.introduce = '暂无';

            const userAuth = new UserAuth();
            userAuth.identifier = phone;
            userAuth.identity_type = identity_type;
            userAuth.credential = session.verifyCode;
            userAuth.user = user;
            const resUserAuth = await userAuthRepo.save(userAuth);
            const {
                user: { id, nickname, avatar },
            } = resUserAuth;
            session.userId = id
            session.nickname = nickname
            session.avatar = avatar
            await session.save()

            res?.status(200).json({
                code: 0,
                msg: '登录成功',
                data: {
                    userId: id,
                    nickname,
                    avatar
                },
            });
        }
    } else {
        res?.status(200).json({
            code: -1,
            msg: '验证码错误'
        });
    }
}
