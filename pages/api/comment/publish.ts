import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import AppDataSource from 'db/index';
import { User, Comment, Article } from 'db/entity/index'
import { EXCEPTION_COMMENT } from 'pages/api/config/codes'

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session;
    const { articleId = 0, content = '' } = req.body
    const commentRepo = AppDataSource.getRepository(Comment);
    const userRepo = AppDataSource.getRepository(User);
    const articleRepo = AppDataSource.getRepository(Article);

    const comment = new Comment()
    comment.content = content
    comment.create_time = new Date()
    comment.update_time = new Date()

    const user = await userRepo.findOne({
        where: {
            id: session?.userId
        }
    })
    const article = await articleRepo.findOne({
        where: {
            id: articleId
        }
    })
    user ? comment.user = user : null
    article ? comment.article = article : null

    const resComment = await commentRepo.save(comment)
    if (resComment) {
        res.status(200).json({
            code: 0,
            msg: '发表成功',
            data: resComment
        })
    }else {
        res.status(200).json({
            ...EXCEPTION_COMMENT.PUBLISH_FAILED
        })
    }
}