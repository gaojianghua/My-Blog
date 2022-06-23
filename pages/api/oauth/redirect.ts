import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie'
import { setCookie } from 'utils/index'
import { ironOptions } from 'config/index';
import { UserAuth, User } from 'db/entity';
import { ISession } from 'pages/api/index';
import request from 'service/fetch';
import AppDataSource from 'db/index';

export default withIronSessionApiRoute(redirect, ironOptions);

async function redirect(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const { code } = req?.query
    const githubClientID = '9ee7f60894e39b7ee3f6'
    const githubSecrect = 'd51c94429e77ef1666fa15c3384e85faf8f49861'
    const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecrect}&code=${code}`
    const result = await request.post(url, {}, {
        headers: {
            accept: 'application/json'
        }
    })
    const { access_token } = result as any

    const githubUserInfo = await request.get('https://api.github.com/user', {
        headers: {
            accept: 'application/json',
            Authorization: `token ${access_token}`
        }
    })
    const cookies = Cookie.fromApiRoute(req, res)
    const userAuthRepo = AppDataSource.getRepository(UserAuth);
    const userAuth = await userAuthRepo.findOne({
        relations: ["user"],
        where: {
            identity_type: 'github',
            identifier: githubClientID,
        }
    });
    if (userAuth) {
        // 登录过的用户
        const user = userAuth.user;
        const { id, nickname, avatar } = user;
        userAuth.credential = access_token
        session.userId = id
        session.nickname = nickname
        session.avatar = avatar
        await session.save()
        setCookie(cookies, { id, nickname, avatar })
        res.redirect(302, '/')
    } else {
        // 第一次登录的用户
        
        const { login = '', avatar_url = '' } = githubUserInfo as any
        const user = new User()
        user.nickname = login;
        user.avatar = avatar_url
        user.job = '暂无';
        user.introduce = '暂无';

        const userAuth = new UserAuth();
        userAuth.identity_type = 'github';
        userAuth.identifier = githubClientID;
        userAuth.credential = access_token;
        userAuth.user = user;

        const resUserAuth = await userAuthRepo.save(userAuth);
        const {
            user: { id, nickname, avatar },
        } = resUserAuth;
        session.userId = id
        session.nickname = nickname
        session.avatar = avatar
        await session.save()
        setCookie(cookies, { id, nickname, avatar })
        res.redirect(302, '/')
    }
}