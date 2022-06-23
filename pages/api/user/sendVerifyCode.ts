import type { NextApiRequest, NextApiResponse } from 'next';
import { format } from 'date-fns'
import md5 from 'md5'
import { encode } from 'js-base64'
import request from 'service/fetch';
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config/index'
import { ISession } from '../index'

export default withIronSessionApiRoute(sendVerifyCode, ironOptions)

async function sendVerifyCode(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session: ISession = req.session
    const { to = '', templateId = 1 } = req.body
    const AppId = '8a216da880d67afb0181381956ab0d9c'
    const AccountId = '8a216da880d67afb0181381955c80d95'
    const AuthToken = '456b8ebb57c341acbffd132d6678c028'
    const NowDate = format(new Date(), 'yyyyMMddHHmmss')
    const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`)
    const Authorization = encode(`${AccountId}:${NowDate}`)
    const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`
    
    const verifyCode = Math.floor(Math.random() * (9999-1000)) + 1000
    const expireMinute = '5'

    const response = await request.post(url, {
        to,
        templateId,
        appId: AppId,
        datas:[verifyCode, expireMinute],
    }, {
        headers: {
            Authorization
        }
    })
    
    const { statusCode, TemplateSMS, statusMsg } = response as any

    if (statusCode === '000000') {
        session.verifyCode = verifyCode
        await session.save()
        res?.status(200).json({
            code: 0,
            data: {TemplateSMS},
            msg: statusMsg
        });
    } else {
        res?.status(200).json({
            code: statusCode,
            msg: statusMsg
        });
    }
}
