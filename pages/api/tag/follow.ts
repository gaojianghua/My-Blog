import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import AppDataSource from 'db/index';
import { Tag, User } from 'db/entity/index'
import { EXCEPTION_TAGS, EXCEPTION_USER } from 'pages/api/config/codes'

export default withIronSessionApiRoute(follow, ironOptions);

async function follow(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const { userId = 0 } = session
    const { tagId = 0, type = '' } = req?.body
    const tagRepo = AppDataSource.getRepository(Tag);
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
        where: {
            id: userId
        }
    })
    const tag = await tagRepo.findOne({
        where:{
            id: Number(tagId)
        },
        relations: ['user']
    })
    if (!user) {
        res?.status(200)?.json({
            ...EXCEPTION_USER.NOT_LOGIN
        })
        return;
    }
    if (tag?.user) {
        if (type === 'follow') {
            tag.user = tag?.user?.concat([user])
            tag.follow_count = tag?.follow_count + 1
        }else if (type === 'unfollow') {
            tag.user = tag?.user?.filter((user) => user.id !== userId)
            tag.follow_count = tag?.follow_count - 1
        }
    }
    if (tag) {
        const resTag = await tagRepo.save(tag)
        res?.status(200)?.json({
            code: 0,
            msg: '',
            data: resTag
        })
    }else {
        res?.status(200)?.json({
            ...EXCEPTION_TAGS.FOLLOW_FAILED
        })
    }
}