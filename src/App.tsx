///<reference path="index.tsx"/>
import React, {useState, useEffect} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Router} from "director/build/director.min";
// Try `npm install @types/director` if it exists or add a new declaration (.d.ts) file containing `declare module 'director/build/director.min';`

import 'todomvc-app-css/index.css'
import 'todomvc-common/base.css'

import {
    ListItem
} from "./interfaces";
import TodoItem from "./components/todoItem";
import {getTodos, addTodo, toggleAllCompleted} from "./queries/queries";


const App: React.FC = () => {
    const {loading, error, data} = useQuery(getTodos)
    const [AddTodo] = useMutation(addTodo)
    const [ToggleAllCompleted] = useMutation(toggleAllCompleted)
    // console.log(loading, error, data)
    let list: ListItem[] = data === undefined ? [] : data.todos

    const [title, setTitle] = useState('')
    const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setTitle(event.target.value)
    }

    const handleKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void = (event) => {
        if (event.keyCode === 13) {
            const titleTrim = title.trim()
            if (titleTrim) {
                // const newList = [...list, {
                //     id: list.length ? list[list.length - 1].id + 1 : 1,
                //     title: titleTrim,
                //     completed: false
                // }]
                // dispatch({
                //     type: UPDATE_LIST, data: newList
                // })
                AddTodo({
                    variables: {title},
                    refetchQueries: [{query: getTodos}]
                })

            }
            setTitle('')
            setAllCompleted(false)
        }
    }
    const [allCompleted, setAllCompleted] = useState(false)
    const toggleAll: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setAllCompleted(event.target.checked)
        ToggleAllCompleted({
            variables: {completed: event.target.checked},
            refetchQueries: [{query: getTodos}]
        })
        // const newList = list.map((item) => {
        //     return {...item, completed: event.target.checked}
        // })
        // dispatch({type: UPDATE_LIST, data: newList})
    }
    const itemsLeft = list.filter((item) => {
        return !item.completed
    })
    const clearCompleted = () => {
        // const newList = list.filter((item) => {
        //     return !item.completed
        // })
        // dispatch({type: UPDATE_LIST, data: newList})
    }
    const [currentHash, setCurrentHash] = useState('/')

    const checkAllCompleted: (newList: ListItem []) => void = (newList) => {
        let allCompletedFlag = true
        if (!newList.length) {
            allCompletedFlag = false
        } else {
            for (let i = 0; i < newList.length; i++) {
                if (!newList[i].completed) {
                    allCompletedFlag = false
                    break
                }
            }
        }
        setAllCompleted(allCompletedFlag)
        console.log('checkAllCompleted')
    }
    useEffect(() => {
        checkAllCompleted(list)
    }, [list])
    // 持久化 读取
    useEffect(() => {
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

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
                            {filterList.map((item) => <TodoItem item={item} key={item.id}/>)}
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
