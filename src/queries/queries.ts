import {gql} from 'apollo-boost';

const getTodos = gql`
    {
      todos {
        id
        title
        completed
      }
    }
`

const addTodo = gql`
    mutation AddTodo($title: String){
      addTodo(title: $title,completed: false){
        id
        title
        completed
      }
    }
`

const toggleAllCompleted = gql`
    mutation ToggleAllCompleted($completed: Boolean){
      toggleAllCompleted(completed: $completed){
        n
        nModified
        ok
      }
    }
`

const delTodo = gql`
    mutation DelTodo($id: ID){
      delTodo (id: $id){
        id
        title
        completed
      }
    }
`

const toggleCompletedMT = gql`
    mutation ToggleCompleted($id: ID, $completed: Boolean){
      toggleCompleted(id: $id,completed: $completed){
        n
        nModified
        ok
      }
    }
`

const updateTitle = gql`
    mutation UpdateTitle($id: ID, $title: String){
      updateTitle(id: $id,title: $title){
        n
        nModified
        ok
      }
    }
`

export {getTodos, addTodo, toggleAllCompleted, delTodo, toggleCompletedMT, updateTitle}