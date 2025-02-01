import React, {useContext} from 'react';
import {TodoContext} from './Context';
import './App.css'
import {GoClock} from 'react-icons/go'
import {MdDelete} from 'react-icons/md'
import {TiTick} from 'react-icons/ti'


const Todo = () => {
  
  const {signInWithGoogle, isLogin, task, setTask, addTask, finishDate, setFinishDate, tasks, setTasks, deleteTask, getDate, finishTask} = useContext(TodoContext)
  
  const handleSignin = async () => {
    await signInWithGoogle()
  }
  
  const handleAddTask = async () => {
    await addTask()
  }



  return(
    <div className='main'>
     {isLogin ?
       (
       <div className='todo'>
        <div>
          <h1 className='text-6xl m-[10px] font-bold'>Todo</h1>
        </div>
         <div className='input-div flex gap-[5px]'>
           <input 
            type='text'
            className='task-input'
             placeholder='Enter Task'
             value={task}
             onChange={(e) => {setTask(e.target.value)}}
             />
             <input 
             type='date'
             className='date-input'
             placeholder='Set finish date'
             value={finishDate}
             onChange={(e) => {setFinishDate(e.target.value)}}
             />
           <button className='' onClick={handleAddTask}>Add Task</button>
         </div>
         <div className="tasks-container">
           {
            tasks.length === 0 ? (
              <div className='no'>
                <h2>No Task</h2>
              </div>
            ):
            (
              tasks.map((task) => (
                <div key={task.id}  className='task'>
                  <div>
                    <p className={`taskName ${task.isCompleted ? 'done':''}`}>{task.todo}</p>
                  </div>
                  <div className='time'>
                   <span><GoClock /></span>
                   <p>{getDate(task.finishTime)}</p>
                  </div>
                  <div className='btns'>
                    <button className='delete-btn' onClick={() => deleteTask(task.id)} ><MdDelete /></button>
                   <button className='done-btn' onClick={() => finishTask(task.id, task.todo, task.finishTime)}><TiTick/></button>
                  </div>
                </div>          
               ))
            )
           }
         </div>
       </div>
       ):
       (
       <div className='home'>
        <h1>Todo App</h1>
        <p>Sign Up to keep tracks of your tasks</p>
        <button
          onClick={handleSignin}>Sign In With Google</button>
      </div>
       )
     } 
    </div>
    )
}

export default Todo;