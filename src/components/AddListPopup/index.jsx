import React from "react";
import List from "../List";
import axios from "axios";
import plusPng from "../../assets/plus.png";
import cancelPng from "../../assets/cancel.png";

import "./AddListPopup.scss";
import classNames from "classnames";

const AddListButton = ({ colors, onAdd }) => {
  const [visiblePopup, setVisiblePopup] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [inputVal, setInputVal] = React.useState("");

  React.useEffect(() => {
    if (Array.isArray(colors)) {
      setSelectedColor(colors[0].id);
    }
  }, [colors]);

  const addlist = () => {
    if (!inputVal) {
      return console.log("Unout val");
    }

    setIsLoading(true);
    axios
      .post("http://localhost:3001/lists", {
        name: inputVal,
        colorId: selectedColor,
      })
      .then(({ data }) => {
        const color = colors.filter((c) => c.id === selectedColor)[0];
        const listObj = { ...data, color: color, tasks: [] };
        onAdd(listObj);
        setInputVal("");
      })
      .catch(() => {
        alert("Ошибка при добавлении списка!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="add-list">
      <List
        onPress={() => setVisiblePopup((prev) => !prev)}
        items={[
          {
            icon: plusPng,
            name: "Добавить",
          },
        ]}
      />
      {visiblePopup && (
        <div className="add-list__popup">
          <img
            className="add-list__popup--cancel"
            src={cancelPng}
            alt="cancel"
            onClick={() => setVisiblePopup(false)}
          />
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Название папки"
            className="field"
            type="text"
          />
          <div className="add-list_circles">
            {colors &&
              colors.map((obj) => (
                <span
                  key={obj.id}
                  onClick={() => setSelectedColor(obj.id)}
                  className={`circle__item circle__item--${obj.name} ${
                    obj.id === selectedColor ? "active" : ""
                  }`}
                ></span>
              ))}
          </div>
          <button
            onClick={addlist}
            className={`add__btn ${isLoading ? "disabled" : ""}`}
          >
            {isLoading ? "Ждите" : "Добавить"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddListButton;
