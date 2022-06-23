import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import AppDataSource from 'db/index';
import { Tag } from 'db/entity/index'
import { EXCEPTION_TAGS } from 'pages/api/config/codes'

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const { userId = 0 } = session
    const tagRepo = AppDataSource.getRepository(Tag);

    const followTags = await tagRepo.find({
        where:{
            id: userId
        },
        relations: ['user']
    })
    const allTags = await tagRepo.find({
        relations: ['user']
    })
    if (followTags && allTags) {
        res?.status(200)?.json({
            code: 0,
            msg: '',
            data: {
                followTags,
                allTags
            }
        })
    }else {
        res?.status(200)?.json({
            ...EXCEPTION_TAGS.GET_FAILED
        })
    }
}