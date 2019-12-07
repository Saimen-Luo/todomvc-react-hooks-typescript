///<reference path="index.tsx"/>
import React, {useState, useReducer, createContext, Context, useEffect} from 'react';
import {Router} from "director/build/director.min";
// Try `npm install @types/director` if it exists or add a new declaration (.d.ts) file containing `declare module 'director/build/director.min';`

import 'todomvc-app-css/index.css'
import 'todomvc-common/base.css'

import {
    ListItem,
    Action,
    UPDATE_LIST
} from "./interfaces";
import TodoItem from "./components/todoItem";

export const AppContest: Context<any> = createContext({}) // 需要引入Context并指定类型为Context<any>

const App: React.FC = () => {
    const initList: ListItem[] = [
        {
            id: 1,
            title: 'xxx',
            completed: false
        },
        {
            id: 2,
            title: 'yyy',
            completed: true
        },
    ]
    // const [list, setList] = useState(initList)
    const reducer: (list: ListItem[], action: Action) => ListItem[] = (list, action) => {
        switch (action.type) {
            // todo reducer 重构，如果data传递newList，直接返回，完全没必要分这么多case
            // 方案 1. 所有case直接合并为一个 UPDATE_LIST
            // 方案 2. 保持case分开，把修改逻辑放到reducer这里，Action要用联合类型，data?可选
            case UPDATE_LIST:
                localStorage.setItem('todos-react-hooks-typescript', JSON.stringify(action.data))
                return action.data
            default:
                return list
        }
    }

    const [list, dispatch] = useReducer(reducer, initList);
    const [title, setTitle] = useState('')
    const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setTitle(event.target.value)
    }

    const handleKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void = (event) => {
        if (event.keyCode === 13) {
            const titleTrim = title.trim()
            if (titleTrim) {
                const newList = [...list, {
                    id: list.length ? list[list.length - 1].id + 1 : 1,
                    title: titleTrim,
                    completed: false
                }]
                dispatch({
                    type: UPDATE_LIST, data: newList
                })
            }
            setTitle('')
            setAllCompleted(false)
        }
    }
    const [allCompleted, setAllCompleted] = useState(false)
    const toggleAll: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setAllCompleted(event.target.checked)
        const newList = list.map((item) => {
            return {...item, completed: event.target.checked}
        })
        dispatch({type: UPDATE_LIST, data: newList})
    }
    const itemsLeft = list.filter((item) => {
        return !item.completed
    })
    const clearCompleted = () => {
        const newList = list.filter((item) => {
            return !item.completed
        })
        dispatch({type: UPDATE_LIST, data: newList})
    }
    const [currentHash, setCurrentHash] = useState('/')
    // 持久化 读取
    useEffect(() => {
        const newList = JSON.parse(localStorage.getItem('todos-react-hooks-typescript') === null ? '[]' : localStorage.getItem('todos-react-hooks-typescript') as string)
        dispatch({type: UPDATE_LIST, data: newList})
        // console.log('getItem')
        let allCompletedFlag = true
        for (let i = 0; i < newList.length; i++) {
            if (!newList[i].completed) {
                allCompletedFlag = false
                break
            }
        }
        setAllCompleted(allCompletedFlag)

        // router
        const router = new Router()
        ;['/', '/active', '/completed'].forEach((item) => {
            router.on(item, () => {
                setCurrentHash(item)
            })
        })
        router.configure({
            notfound: () => {
                window.location.hash = '/'
            }
        })
        router.init()
    }, [])
    let filterList = list
    if (currentHash === '/active') {
        filterList = list.filter((item) => {
            return !item.completed
        })
    } else if (currentHash === '/completed') {
        filterList = list.filter((item) => {
            return item.completed
        })
    }

    return (
        <div className="App">
            <section className="todoapp">
                <header className="header">
                    <h1>todos</h1>
                    <input className="new-todo" placeholder="What needs to be done?" autoFocus
                           value={title}
                           onChange={handleChange}
                           onKeyUp={handleKeyUp}
                    />
                </header>
                {list.length ? (<>
                    <section className="main">
                        <input id="toggle-all" className="toggle-all" type="checkbox"
                               onChange={toggleAll}
                               checked={allCompleted}
                        />
                        <label htmlFor="toggle-all">Mark all as complete</label>
                        <ul className="todo-list">
                            <AppContest.Provider value={{list, dispatch, setAllCompleted}}>
                                {filterList.map((item) => <TodoItem item={item} key={item.id}/>)}
                            </AppContest.Provider>
                        </ul>
                    </section>
                    <footer className="footer">
                        <span
                            className="todo-count"><strong>{itemsLeft.length}</strong> {itemsLeft.length === 1 ? 'item' : 'items'} left</span>
                        <ul className="filters">
                            <li>
                                <a className={currentHash === '/' ? "selected" : undefined} href="#/">All</a>
                            </li>
                            <li>
                                <a className={currentHash === '/active' ? "selected" : undefined}
                                   href="#/active">Active</a>
                            </li>
                            <li>
                                <a className={currentHash === '/completed' ? "selected" : undefined}
                                   href="#/completed">Completed</a>
                            </li>
                        </ul>
                        {list.length === itemsLeft.length ? null :
                            <button className="clear-completed" onClick={clearCompleted}>Clear completed</button>}
                    </footer>
                </>) : null}
            </section>
            <footer className="info">
                <p>Double-click to edit a todo</p>
                <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
                <p>Created by <a href="http://todomvc.com">you</a></p>
                <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
            </footer>
        </div>
    );
}

export default App;
