import React, {useState, useEffect, createContext} from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, query, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyC7cmMd-eIOQAedFGzHqqi6ux4IKyKFVQY",
  authDomain: "to-do-b2aeb.firebaseapp.com",
  projectId: "to-do-b2aeb",
  storageBucket: "to-do-b2aeb.firebasestorage.app",
  messagingSenderId: "592661695925",
  appId: "1:592661695925:web:5c22c7aa75792e51671dfc",
  measurementId: "G-VVF68940WB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

const TodoContext = createContext()

const TodoProvider = ({children}) => {
 const [isLogin, setIsLogin] = useState(false)
 const [task, setTask] = useState('')
 const [finishDate, setFinishDate] = useState('')
 const [tasks, setTasks] = useState([])
 
 const signInWithGoogle = async () => {
   try{
     const result = await signInWithPopup(auth, googleProvider)
     setIsLogin(true)
   }catch(err){
     console.log(err)
   }
 } 
 
 const addTask = async () => {
   const userId = auth.currentUser.uid
  const taskRef = collection(db, `users/${userId}/tasks`)
  const newTask = {
     todo: task,
     isCompleted: false,
     finishTime: finishDate,
     createdAt: new Date()
  }
  try{
    if(task !== "" && finishDate !== ""){
      await addDoc(taskRef, newTask);
      alert('task added');
      setTask('')
      setFinishDate('')
    }else{
      alert("add a task")
    }
  }catch(err){
    console.log(err)
  }
 }
 

const deleteTask = async (taskId) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    // Reference to the specific task document
    const taskRef = doc(db, `users/${userId}/tasks`, taskId);
    
    await deleteDoc(taskRef);
    alert("Task deleted successfully!");
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

const finishTask = async (taskId, taskName, taskTime) => {
  try{
    const userId = auth.currentUser?.uid;
    const updatedtask = doc(db, `users/${userId}/tasks`, taskId)
    await updateDoc(updatedtask, {
     todo: taskName,
      isCompleted: true,
      finishTime: taskTime,
      createdAt: new Date()
    })
    console.log("Task marked as completed!");
  }catch(error) {
    console.error("Error finishing task:", error);
  }
};

 useEffect(() => {
  let unsubscribeTasks;

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) {
      setTasks([]); // Clear tasks when user logs out
      return;
    }

    const userId = user.uid;
    const tasksRef = collection(db, `users/${userId}/tasks`); // Ensure correct Firestore path
    const q = query(tasksRef);

    unsubscribeTasks = onSnapshot(q, (querySnapshot) => {
      const arrayOfTask = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(arrayOfTask);
    });
  });

  return () => {
    if (unsubscribeTasks) unsubscribeTasks();
    unsubscribeAuth();
  };
}, []); // No need for auth.currentUser as a dependency


 const getDate = (userdate) => {
   const daysOfWeek = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
   const monthsOfYear = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
   const userDate = new Date(userdate)
   const day = daysOfWeek[userDate.getDay()]
   const month = monthsOfYear[userDate.getMonth()]
   const date = userDate.getDate()
   const year = userDate.getFullYear()
   return `${day} ${month} ${date}, ${year}`
 }
 
 
  return(
    <TodoContext.Provider value ={{signInWithGoogle, isLogin, task, setTask, addTask, finishDate, setFinishDate, tasks, setTasks, deleteTask, getDate, finishTask}}>
      {children}
    </TodoContext.Provider>
    )
}


export {TodoContext, TodoProvider}