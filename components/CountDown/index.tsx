import type { NextPage } from 'next';
import styles from './index.module.scss'
import { useEffect, useState } from 'react'

interface Iprops {
    time: number;
    onEnd: Function;
}

const CountDown: NextPage<Iprops> = ({time, onEnd}) => {
    const [ count, setCount ] = useState(time || 60)
    useEffect(() => {
        const id = setInterval(() => {
            setCount((count) => {
                if (count === 0) {
                    clearInterval(id)
                    onEnd && onEnd()
                    return count
                }
                return count - 1
            })
        }, 1000)
        return () => {
            clearInterval(id)
        }
    }, [time])

    return (<div className={styles.countDown}>{count}</div>);
};

export default CountDown;