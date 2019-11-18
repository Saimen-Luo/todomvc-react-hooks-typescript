import React, {useContext, useState, useRef, useEffect} from 'react';

import {DESTROY_ITEM, ListItem, TOGGLE_COMPLETED} from "../interfaces";
import {AppContest} from "../App";

interface Props {
    item: ListItem
}


const TodoItem: React.FC<Props> = (props) => {
    const {item} = props
    const {list, dispatch} = useContext(AppContest)
    const toggleCompleted: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        const newList = list.map((i: ListItem) => { // 需要指定i类型为ListItem
            return item.id === i.id ? {...i, completed: event.target.checked} : i
        })
        dispatch({type: TOGGLE_COMPLETED, data: newList})
    }
    const handleDestroy = () => {
        const newList = list.filter((i: ListItem) => {
            return item.id !== i.id
        })
        dispatch({type: DESTROY_ITEM, data: newList})
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
            <input className="edit" value="Create a TodoMVC template" ref={inputRef}/>
        </li>
    );
};

export default TodoItem;