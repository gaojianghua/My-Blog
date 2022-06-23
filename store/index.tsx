import React, { Children, createContext, ReactElement, useContext } from "react";
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite'
import createStore, { IStore } from "./rootStore";

enableStaticRendering(!process.browser)

interface IProps {
    initialValue: Record<any, any>
    children: ReactElement
}

const StoreContext = createContext({})

export const StoreProvider = ({initialValue, children}: IProps) => {
    const store: IStore = useLocalObservable(createStore(initialValue))
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    )
}

export const useStore = () => {
    const store: IStore = useContext(StoreContext) as IStore
    if (!store) {
        throw new Error('数据不存在')
    }
    return store
}