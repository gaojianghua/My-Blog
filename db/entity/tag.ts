import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { User } from './user'
import { Article } from './article'

@Entity({name: 'tags'})
export class Tag extends BaseEntity {
    @PrimaryGeneratedColumn()
    readonly id!: number

    @Column()
    title!: string

    @Column()
    icon!: string

    @Column()
    follow_count!: number
    
    @Column()
    article_count!: number

    @ManyToMany(() => User, {
        cascade: true
    })
    @JoinTable({
        name: 'tags_users_rel',
        joinColumn: {
            name: 'tag_id'
        },
        inverseJoinColumn: {
            name: 'user_id'
        }
    })
    user!: User[]

    @ManyToMany(() => Article, {
        cascade: true
    })
    @JoinTable({
        name: 'articles_tags_rel',
        joinColumn: {
            name: 'tag_id'
        },
        inverseJoinColumn: {
            name: 'article_id'
        }
    })
    articles!: Article[]
}