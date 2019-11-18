export interface ListItem {
    id: number,
    title: string,
    completed: boolean
}

export interface Action {
    type: string,
    data: ListItem
}

export const ADD_TODO = 'add_todo'