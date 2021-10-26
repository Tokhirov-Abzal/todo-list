import React from "react";
import "./List.scss";
import classNames from "classnames";
import axios from "axios";
import closeImg from "../../assets/close.png";

const List = ({
  items,
  onPress,
  className,
  isRemovable,
  onRemove,
  onClickItem,
  activeItem,
}) => {
  const removeList = (item) => {
    if (window.confirm("you sure ?")) {
      axios
        .delete("http://localhost:3001/lists/" + item.id)
        .then(() => onRemove(item));
    }
  };

  return (
    <ul
      onClick={onPress}
      className={`todo__list ${className ? "listClass" : ""}`}
    >
      {items &&
        items.map((obj, index) => (
          <li
            key={`${obj}_${index}`}
            className={classNames({
              active: obj.active
                ? obj.active
                : activeItem && activeItem.id === obj.id,
            })}
            onClick={onClickItem ? () => onClickItem(obj) : null}
          >
            <i>
              {obj.icon ? (
                <img className="todo_menuImg" src={obj.icon} alt="burgerMenu" />
              ) : (
                <span className={`circle ${obj.color.name}`}></span>
              )}
            </i>

            <span className="list__content">
              {obj.name}
              {obj.tasks && ` (${obj.tasks.length})`}
            </span>
            {isRemovable ? (
              <img
                onClick={() => removeList(obj)}
                className="cancelImg"
                src={closeImg}
                alt="cancel"
              />
            ) : (
              ""
            )}
          </li>
        ))}
    </ul>
  );
};

export default List;
