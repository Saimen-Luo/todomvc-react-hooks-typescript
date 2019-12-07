import React, {useContext, useState, useRef, useEffect} from 'react';

import {ListItem, UPDATE_LIST} from "../interfaces";
import {AppContest} from "../App";

interface Props {
    item: ListItem
}


const TodoItem: React.FC<Props> = (props) => {
    const {item} = props
    const {list, dispatch, checkAllCompleted} = useContext(AppContest)

    const toggleCompleted: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        const newList = list.map((i: ListItem) => { // 需要指定i类型为ListItem
            return item.id === i.id ? {...i, completed: event.target.checked} : i
        })
        dispatch({type: UPDATE_LIST, data: newList})
        checkAllCompleted(newList)
    }
    const handleDestroy = () => {
        const newList = list.filter((i: ListItem) => {
            return item.id !== i.id
        })
        dispatch({type: UPDATE_LIST, data: newList})
        checkAllCompleted(newList)
    }
    const [editing, setEditing] = useState(false)
    const toggleEditing = () => {
        setEditing(true)
    }
    const inputRef = useRef<HTMLInputElement>(null) // 需要初始值为null
    useEffect(() => {
        inputRef.current && inputRef.current.focus()
        // 需要上面 useRef<HTMLInputElement> 否则 && 也不行
        // 参考 https://dev.to/busypeoples/notes-on-typescript-react-hooks-28j2
    })
    const [title, setTitle] = useState('')
    useEffect(() => {
        // 挂载时同步item.title 和 title
        // console.log('同步title')
        setTitle(item.title)
    }, [item.title])
    const saveTitle: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        setTitle(event.target.value)
    }
    const updateOrDelTodo = () => {
        setEditing(false)
        const titleTrim = title.trim()
        if (!titleTrim) {
            handleDestroy()
        } else {
            const newList = list.map((i: ListItem) => {
                return item.id === i.id ? {...i, title} : i
            })
            dispatch({type: UPDATE_LIST, data: newList})
        }
    }
    const handleKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void = (event) => {
        if (event.keyCode === 13) { // 回车
            updateOrDelTodo()
        } else if (event.keyCode === 27) { // 按esc，恢复title并退出编辑
            setEditing(false)
            setTitle(item.title)
        }
    }
    return (
        <li className={`${item.completed ? "completed" : undefined} ${editing ? "editing" : undefined}`}>
            <div className="view">
                <input className="toggle" type="checkbox"
                       checked={item.completed}
                       onChange={toggleCompleted}
                />
                <label onDoubleClick={toggleEditing}>{item.title}</label>
                <button className="destroy" onClick={handleDestroy}></button>
            </div>
            <input className="edit"
                   value={title}
                   ref={inputRef}
                   onChange={saveTitle}
                   onBlur={updateOrDelTodo}
                   onKeyUp={handleKeyUp}
            />
        </li>
    );
};

export default TodoItem;