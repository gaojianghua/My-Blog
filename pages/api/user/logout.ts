import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie'
import { setCookie } from 'utils/index'
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';

export default withIronSessionApiRoute(logout, ironOptions);

async function logout(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const cookies = Cookie.fromApiRoute(req, res)

    await session.destroy()
    cookies.set('userId', '')
    cookies.set('nickname', '')
    cookies.set('avatar', '')

    res?.status(200).json({
        code: 0,
        msg: '退出成功'
    });
}