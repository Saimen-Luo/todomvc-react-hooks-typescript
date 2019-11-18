import React, {useContext} from 'react';

import {ListItem, TOGGLE_COMPLETED} from "../interfaces";
import {AppContest} from "../App";

interface Props {
    item: ListItem
}


const TodoItem: React.FC<Props> = (props) => {
    const {item} = props
    const {list, dispatch} = useContext(AppContest)
    const toggleCompleted: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
        const newList = list.map((i: ListItem) => {
            return item.id === i.id ? {...i, completed: event.target.checked} : i
        })
        dispatch({type: TOGGLE_COMPLETED, data: newList})
    }
    return (
        <li className={item.completed ? "completed" : undefined}>
            <div className="view">
                <input className="toggle" type="checkbox"
                       checked={item.completed}
                       onChange={toggleCompleted}
                />
                <label>{item.title}</label>
                <button className="destroy"></button>
            </div>
            <input className="edit" value="Create a TodoMVC template"/>
        </li>
    );
};

export default TodoItem;