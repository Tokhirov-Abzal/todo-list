import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "./Tasks.scss";
import editPng from "../../assets/edit.png";
import AddTaskForm from "./AddTaskForm";
import Task from "./Task";

const Tasks = ({
  list,
  onEditTitle,
  onAddTask,
  withoutEmpty,
  onEditTask,
  onRemoveTask,
  onCompleteTask,
}) => {
  const editTitle = () => {
    const newTitle = window.prompt("Название списка", list.name);

    if (newTitle) {
      onEditTitle(list.id, newTitle);
      axios
        .patch("http://localhost:3001/lists/" + list.id, {
          name: newTitle,
        })
        .catch((err) => console.log(err.message));
    }
  };

  return (
    <div className="tasks">
      <Link to={`/lists/${list.id}`}>
        <h1 style={{ color: list.color.hex }} className="tasks__title">
          {list.name}
          <img onClick={editTitle} src={editPng} alt="editIcon" />
        </h1>
      </Link>
      <div className="tasks__items">
        {!withoutEmpty && !list.tasks.length && <h2>Задачи отсутствуют</h2>}
        {list.tasks.map((task) => (
          <Task
            list={list}
            key={task.id}
            task={task}
            onRemove={onRemoveTask}
            onEdit={onEditTask}
            onComplete={onCompleteTask}
            {...task}
          />
        ))}

        <AddTaskForm key={list.id} list={list} onAddTask={onAddTask} />
      </div>
    </div>
  );
};

export default Tasks;
