export const EXCEPTION_USER = {
    NOT_LOGIN: {
        code: 1001,
        msg: '未登录'
    }
}


export const EXCEPTION_ARTICLE = {
    PUBLISH_FAILED: {
        code: 2001,
        msg: '发布文章失败'
    },
    UPDATE_FAILED: {
        code: 2002,
        msg: '更新文章失败'
    },
    NOT_FOUND: {
        code: 2003,
        msg: '未找到文章'
    }
}

export const EXCEPTION_TAGS = {
    GET_FAILED: {
        code: 3001,
        msg: '获取数据失败'
    },
    FOLLOW_FAILED: {
        code: 3002,
        msg: '关注/取关操作失败'
    }
}

export const EXCEPTION_COMMENT = {
    PUBLISH_FAILED: {
        code: 4001,
        msg: '发表失败'
    }
}

