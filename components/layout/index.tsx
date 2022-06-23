import type { NextPage } from 'next';
import Navbar from 'components/Navbar';
import styles from './index.module.scss'

interface Props {
    children: any;
}

const Layout: NextPage<Props> = ({ children } ) => {
    return (
        <div className={styles.layout}>
            {
                children.type.layout === null ? <></> : <Navbar />
            }
            <main>{children}</main>
        </div>
    );
};

export default Layout;
