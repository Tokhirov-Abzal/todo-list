import React from "react";
import { List, AddListButton, Task } from "./components";
import axios from "axios";
import { Route, useHistory, useLocation } from "react-router-dom";
// import AddListButton from "./components/AddListPopup";
// import Task from "./components/Tasks";

import menuPng from "./assets/menu.png";

function App() {
  const [lists, setLists] = React.useState(null);
  const [colors, setColors] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState(null);
  let history = useHistory();
  let location = useLocation();

  React.useState(() => {
    axios
      .get("http://localhost:3001/lists?_expand=color&_embed=tasks")
      .then(({ data }) => setLists(data));

    axios
      .get("http://localhost:3001/colors")
      .then(({ data }) => setColors(data));
  }, []);

  const onAddList = (obj) => {
    setLists((prev) => [...prev, obj]);
  };

  const onAddTask = (listId, taskObj) => {
    const newList = lists.map((item) => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }

      return item;
    });

    setLists(newList);
  };

  const onEditTask = (listId, taskObj) => {
    const newTaskText = window.prompt("Text zadachi", taskObj.text);

    if (!newTaskText) {
      return;
    }

    const newList = lists.map((item) => {
      if (item.id === listId) {
        item.tasks = item.tasks.map((task) => {
          if (task.id === taskObj.id) {
            task.text = newTaskText;
          }
          return task;
        });
      }

      return item;
    });
    setLists(newList);
    axios
      .patch("http://localhost:3001/tasks/" + taskObj.id, {
        text: newTaskText,
      })
      .catch((err) => console.log(err.message));
  };

  const onRemoveTask = (listId, taskId) => {
    if (window.confirm("You sure ?")) {
      const newList = lists.map((item) => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter((task) => task.id !== taskId);
        }

        return item;
      });
      setLists(newList);
      axios
        .delete("http://localhost:3001/tasks/" + taskId)
        .catch((err) => console.log(err.message));
    }
  };

  const onEditListTitle = (id, title) => {
    const newList = lists.map((item) => {
      if (item.id === id) {
        item.name = title;
      }

      return item;
    });
    setLists(newList);
  };

  const onRemove = (obj) => {
    setLists((prev) => prev.filter((item) => item.id !== obj.id));
  };

  const onCompleteTask = (listId, taskId, completed) => {
    const newList = lists.map((item) => {
      if (item.id === listId) {
        item.tasks = item.tasks.map((task) => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }

      return item;
    });
    setLists(newList);
    axios
      .patch("http://localhost:3001/tasks/" + taskId, {
        completed,
      })
      .catch((err) => console.log(err.message));
  };

  React.useEffect(() => {
    const listId = history.location.pathname.split("lists/")[1];
    if (lists) {
      const list = lists.find((list) => list.id === Number(listId));
      console.log(list);
      setActiveItem(list);
    }
  }, [history.location.pathname]);

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List
          onClickItem={(list) => {
            history.push(`/`);
          }}
          items={[
            {
              active: !activeItem,
              icon: menuPng,
              name: "Все задачи",
            },
          ]}
        />
        <List
          items={lists}
          isRemovable={true}
          className={"listClass"}
          activeItem={activeItem}
          onRemove={onRemove}
          onClickItem={(list) => {
            history.push(`/lists/${list.id}`);
          }}
        />
        <AddListButton colors={colors} onAdd={onAddList} />
      </div>
      <div className="todo__tasks">
        <Route exact path="/">
          {lists &&
            lists.map((list) => (
              <Task
                key={list.id}
                list={list}
                onAddTask={onAddTask}
                onEditTitle={onEditListTitle}
                onEditTitle={onEditListTitle}
                onRemoveTask={onRemoveTask}
                onEditTask={onEditTask}
                onCompleteTask={onCompleteTask}
                withoutEmpty
              />
            ))}
        </Route>
        <Route path="/lists/:id">
          {lists && activeItem && (
            <Task
              list={activeItem}
              onAddTask={onAddTask}
              onEditTitle={onEditListTitle}
              onRemoveTask={onRemoveTask}
              onEditTask={onEditTask}
              onCompleteTask={onCompleteTask}
            />
          )}
        </Route>
      </div>
    </div>
  );
}

export default App;
