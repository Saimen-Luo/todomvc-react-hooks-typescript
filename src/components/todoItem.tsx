import React from 'react';

import {listItem} from "../interfaces";

interface Props {
    item: listItem
}


const TodoItem: React.FC<Props> = (props) => {
    const {item} = props
    return (
        <li className={item.completed ? "completed" : undefined}>
            <div className="view">
                <input className="toggle" type="checkbox" checked={item.completed}/>
                <label>{item.title}</label>
                <button className="destroy"></button>
            </div>
            <input className="edit" value="Create a TodoMVC template"/>
        </li>
    );
};

export default TodoItem;