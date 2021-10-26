import React from "react";
import plusPng from "../../assets/plus.png";
import axios from "axios";
import "./Tasks.scss";

const AddTaskForm = ({ list, onAddTask }) => {
  const [toggleVisible, setToggleVisible] = React.useState(false);
  const [inputVal, setInputVal] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(null);

  const onToggleVisible = () => {
    setToggleVisible((prev) => !prev);
    setInputVal("");
  };

  const addTask = () => {
    const obj = {
      listId: list.id,
      text: inputVal,
      completed: false,
    };
    setIsLoading(true);
    axios
      .post("http://localhost:3001/tasks", obj)
      .then(({ data }) => {
        console.log(data);
        onAddTask(list.id, data);
        onToggleVisible();
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="tasks__form">
      {!toggleVisible ? (
        <div className="tasks__form-new" onClick={onToggleVisible}>
          <img className="addBtn" src={plusPng} alt="" />
          <span>Новая задача</span>
        </div>
      ) : (
        <div className="tasks__form-block">
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            type="text"
            className="field"
            placeholder="Текст"
          />
          <div className="miniContainer">
            <button
              onClick={addTask}
              className={`add__btn ${isLoading ? "disabled" : ""}`}
            >
              {isLoading ? "Добавление..." : "Добавить задачу"}
            </button>
            <button
              className="add__btn add__btn--grey"
              onClick={onToggleVisible}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskForm;
