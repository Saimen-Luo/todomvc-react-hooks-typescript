export interface ListItem {
    id: number,
    title: string,
    completed: boolean
}

export interface Action {
    type: string,
    data: ListItem[]
}

export const ADD_TODO = 'add_todo'
export const TOGGLE_ALL = 'toggle_all'
export const TOGGLE_COMPLETED = 'toggle_completed'
export const DESTROY_ITEM = 'destroy_item'