import React from "react";
import { List, AddListButton, Task } from "./components";
import axios from "axios";
// import AddListButton from "./components/AddListPopup";
// import Task from "./components/Tasks";

import menuPng from "./assets/menu.png";

function App() {
  const [lists, setLists] = React.useState(null);
  const [colors, setColors] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState(null);

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

  const onClickItem = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List
          items={[
            {
              active: true,
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
          onClickItem={onClickItem}
        />
        <AddListButton colors={colors} onAdd={onAddList} />
      </div>
      <div className="todo__tasks">
        {lists && activeItem && (
          <Task
            list={activeItem}
            onAddTask={onAddTask}
            onEditTitle={onEditListTitle}
          />
        )}
      </div>
    </div>
  );
}

export default App;
