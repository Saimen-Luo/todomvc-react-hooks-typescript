import React, {useState, useReducer, useContext} from 'react';
import 'todomvc-app-css/index.css'
import 'todomvc-common/base.css'

import {ListItem, Action, ADD_TODO} from "./interfaces";
import TodoItem from "./components/todoItem";

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
            case ADD_TODO:
                return [...list, action.data]
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
                dispatch({
                    type: ADD_TODO, data: {
                        id: list.length ? list[list.length - 1].id + 1 : 1,
                        title: titleTrim,
                        completed: false
                    }
                })
            }
        setTitle('')
        }
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
                        <input id="toggle-all" className="toggle-all" type="checkbox"/>
                        <label htmlFor="toggle-all">Mark all as complete</label>
                        <ul className="todo-list">
                            {list.map((item) => <TodoItem item={item} key={item.id}/>)}
                        </ul>
                    </section>
                    <footer className="footer">
                        <span className="todo-count"><strong>0</strong> item left</span>
                        <ul className="filters">
                            <li>
                                <a className="selected" href="#/">All</a>
                            </li>
                            <li>
                                <a href="#/active">Active</a>
                            </li>
                            <li>
                                <a href="#/completed">Completed</a>
                            </li>
                        </ul>
                        <button className="clear-completed">Clear completed</button>
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
