"use strict";

window.addEventListener("load", () => {
  formOverlay();
  const progressTodos = JSON.parse(localStorage.getItem("progress")) || [];
  const closedTodos = JSON.parse(localStorage.getItem("closedItems")) || [];
  const allTodos = [...progressTodos, ...closedTodos];
  displayTodos(allTodos);
});

//display all todos
const allTodoItems = document.getElementById("all");
allTodoItems.addEventListener("click", () => {
  const progressTodos = JSON.parse(localStorage.getItem("progress")) || [];
  const closedTodos = JSON.parse(localStorage.getItem("closedItems")) || [];
  const allTodos = [...progressTodos, ...closedTodos];
  displayTodos(allTodos);
});

//display inprogress
const inProgess = document.getElementById("inProgress");
inProgess.addEventListener("click", () => {
  let progress = JSON.parse(localStorage.getItem("progress")) || [];
  displayTodos(progress);
});

//display closeds
const closedTodos = document.getElementById("closed");
closedTodos.addEventListener("click", () => {
  let closed = JSON.parse(localStorage.getItem("closedItems")) || [];
  displayTodos(closed);
});

//delete all the tasks in the array
let delBtn = document.getElementById("clear");
delBtn.addEventListener("click", () => {
  //clear original array
  let arrayItems = JSON.parse(localStorage.getItem("taskObject")) || [];
  arrayItems.splice(0);
  localStorage.setItem("taskObject", JSON.stringify(arrayItems));

  //clear closed array
  let closedArray = JSON.parse(localStorage.getItem("closedItems")) || [];
  closedArray.splice(0);
  localStorage.setItem("closedItems", JSON.stringify(closedArray));

  //clear progress array
  let progress = JSON.parse(localStorage.getItem("progress")) || [];
  progress.splice(0);
  localStorage.setItem("progress", JSON.stringify(progress));

  displayTodos(arrayItems);
});

function formOverlay() {
  let todo = document.getElementById("todo");
  todo.addEventListener("click", () => {
    //CREATE AN OVERLAY BACKGROUND
    let overlay = document.createElement("div");
    overlay.id = "overlay";
    document.body.appendChild(overlay);

    //CREATE THE FORM
    let form = document.createElement("form");
    form.action = "";
    form.id = "addTodo";

    //CREATE THE TITLE
    let formTitle = document.createElement("div");
    let formHeading = document.createElement("h1");
    formHeading.textContent = "MY TODO";
    formTitle.appendChild(formHeading);
    form.autocomplete = "off";
    form.appendChild(formTitle);

    //div to hold category input
    let catContent = document.createElement("div");
    catContent.id = "category";

    //cat label
    let catLabel = document.createElement("label");
    catLabel.textContent = "Enter cat";

    //category input
    let catInp = document.createElement("input");
    catInp.type = "text";
    catInp.id = "catInp";
    catLabel.htmlFor = catInp.id;

    //add input category and label to parent div
    catContent.appendChild(catLabel);
    catContent.appendChild(catInp);

    //div for todo input
    let inputContent = document.createElement("div");
    inputContent.id = "inputContent";

    //todo label
    let inputLabel = document.createElement("label");
    inputLabel.textContent = "Enter todo";

    //todo input
    let inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.id = "inputEl";
    inputLabel.htmlFor = inputEl.id;

    //add todo label and
    inputContent.appendChild(inputLabel);
    inputContent.appendChild(inputEl);

    //DIV TO HOLD BUTTONS
    let todoBtns = document.createElement("div");
    todoBtns.id = "todoBtns";

    //ADD BUTTON
    let saveBtn = document.createElement("div");
    let saveBtnContent = document.createElement("p");
    saveBtnContent.textContent = "Save";
    saveBtn.appendChild(saveBtnContent);
    saveBtn.classList.add("formBtn");
    saveBtn.id = "save";
    saveBtn.onclick = saveItem;

    //CLOSE FORM BUTTON
    let closeBtn = document.createElement("div");
    let closeBtnContent = document.createElement("p");
    closeBtnContent.textContent = "Close";
    closeBtn.appendChild(closeBtnContent);
    closeBtn.classList.add("formBtn");
    closeBtn.id = "close";
    closeBtn.onclick = () => {
      document.body.removeChild(overlay);
    };

    //ADD SAVE AND CLOSE BUTTON TO THE DIV
    todoBtns.appendChild(saveBtn);
    todoBtns.appendChild(closeBtn);

    //APPEND DIV ELEMENTS TO THE FORM
    form.appendChild(catContent);
    form.appendChild(inputContent);
    form.appendChild(todoBtns);

    //APPEND FORM TO THE OVERLAY
    overlay.appendChild(form);
  });
}

function saveItem() {
  // Retrieve existing items from localStorage or initialize an empty array
  const originalArr = JSON.parse(localStorage.getItem("taskObject")) || [];

  // Get input values and create an object
  let taskTitle = document.getElementById("catInp").value;
  let taskItem = document.getElementById("inputEl").value;

  let taskObject = {
    id: Math.floor(Math.random() * 100),
    taskTitle: taskTitle,
    fulfilled: false,
    taskItem: taskItem,
  };

  originalArr.push(taskObject);
  displayTodos(originalArr);

  //initialise closed Todos
  let closedTodos = originalArr.filter((item) => item.fulfilled === true);
  localStorage.setItem("closedItems", JSON.stringify(closedTodos));

  //initialise closed Todos
  let progressTodo = originalArr.filter((item) => item.fulfilled === false);
  localStorage.setItem("progress", JSON.stringify(progressTodo));

  // Save the updated array back to localStorage
  localStorage.setItem("taskObject", JSON.stringify(originalArr));
}

function displayTodos(items) {
  // Clear existing content
  let categories = document.getElementById("categories");
  let listItems = document.getElementById("listItems");
  categories.innerHTML = "";
  listItems.innerHTML = "";

  if (items.length <= 0) {
    listItems.innerHTML = `<h1 class="text-[#165030] text-4xl text-center">All cleared no todo's!</h1>`;
  } else {
    //create uniues for titles **UPDATE**
    const todoItems = [...new Set(items.map((item) => item.taskTitle))];

    //create place holder for unique values
    const categoryTitle = document.getElementById("categories");
    categoryTitle.innerHTML = todoItems
      .map((item) => {
        return `<h3 class="catContent">${item}</h3>`;
      })
      .join("");

    for (let item of items) {
      //create place holder for list todos
      let todoContainer = document.createElement("div");
      todoContainer.classList.add("todoContainer");

      //create checked input
      let checkInput = document.createElement("div");
      checkInput.id = item.id;
      checkInput.classList.add("checkbox");
      if (item.fulfilled === true) {
        checkInput.classList.add("active");
      } else {
        checkInput.classList.remove("active");
      }

      checkInput.addEventListener("click", () => {
        //find array index
        let subItemIndex = items.indexOf(item);

        //get closed and in progress arrays
        const closedTodoItems =
          JSON.parse(localStorage.getItem("closedItems")) || [];
        const progressItems =
          JSON.parse(localStorage.getItem("progress")) || [];

        //if the origanal array has subItemIndex
        if (subItemIndex > -1) {
          //change fulifled value based on the current value false <=> true
          items[subItemIndex].fulfilled = !items[subItemIndex].fulfilled;
          checkInput.classList.toggle("active");

          // Check item id if it already exist exists in closedTodoItems
          const closedItemIndex = closedTodoItems.findIndex(
            (item) => item.id === items[subItemIndex].id
          );

          // Check item id if it already exist exists in progressItems
          const progressItemIndex = progressItems.findIndex(
            (item) => item.id === items[subItemIndex].id
          );

          if (items[subItemIndex].fulfilled === true) {
            //item does not exist in cloaseItem array, add it
            if (closedItemIndex === -1) {
              closedTodoItems.push(items[subItemIndex]);
            }

            //but item found in progressItems, remove it
            if (progressItemIndex !== -1) {
              progressItems.splice(progressItemIndex, 1);
            }
          } else {
            //item does not exist in progress array, add it
            if (progressItemIndex === -1) {
              progressItems.push(items[subItemIndex]);
            }

            //but item found in progressItems, remove it
            if (closedItemIndex !== -1) {
              closedTodoItems.splice(closedItemIndex, 1);
            }
          }

          localStorage.setItem("closedItems", JSON.stringify(closedTodoItems));
          localStorage.setItem("progress", JSON.stringify(progressItems));
          localStorage.setItem("taskObject", JSON.stringify(items));
        }
      });

      //create list item
      let listItem = document.createElement("li");
      listItem.classList.add("listItem");

      let listContent = document.createElement("p");
      listContent.textContent = item.taskItem;
      listItem.appendChild(listContent);

      let editContainer = document.createElement("div");
      editContainer.id = "editContainer";

      //edit icon
      let editIcon = document.createElement("i");
      editIcon.classList.add("fa-solid", "fa-pen-to-square");
      editIcon.dataset.id = item.id;
      editIcon.addEventListener("click", editItem);

      //delete icon
      let delIcon = document.createElement("i");
      delIcon.classList.add("fa-solid", "fa-trash-can");
      delIcon.dataset.id = item.id;
      delIcon.addEventListener("click", deleteItem);

      //append delete and edit icon
      editContainer.appendChild(editIcon);
      editContainer.appendChild(delIcon);

      todoContainer.appendChild(checkInput);
      todoContainer.appendChild(listItem);
      todoContainer.appendChild(editContainer);
      listItems.appendChild(todoContainer);
    }
  }
}

function deleteItem(evt) {
  //get arrays and create new one
  const progressTodos = JSON.parse(localStorage.getItem("progress")) || [];
  const closedTodos = JSON.parse(localStorage.getItem("closedItems")) || [];
  const allTodos = [...progressTodos, ...closedTodos];

  //find index of item to be deleted
  const subItemIndex = allTodos.findIndex(
    (subItem) => subItem.id == evt.target.dataset.id
  );

  if (subItemIndex !== -1) {
    //update closed todos
    if (allTodos[subItemIndex].fulfilled === true) {
      let deletedClosed = closedTodos.filter((item) => {
        return item.id !== allTodos[subItemIndex].id;
      });
      let closedTodosUpdated = [...deletedClosed];
      displayTodos(closedTodosUpdated);
      localStorage.setItem("closedItems", JSON.stringify(closedTodosUpdated));
    } else {
      //update progress todos
      let deletedProg = progressTodos.filter((item) => {
        return item.id !== allTodos[subItemIndex].id;
      });
      let progresTodosUpdated = [...deletedProg];
      displayTodos(progresTodosUpdated);
      localStorage.setItem("progress", JSON.stringify(progresTodosUpdated));
    }
  }
}

function editItem(evt) {
  //get arrays and create new one
  const progressTodos = JSON.parse(localStorage.getItem("progress")) || [];
  const closedTodos = JSON.parse(localStorage.getItem("closedItems")) || [];
  const allTodos = [...progressTodos, ...closedTodos];

  let editTask = allTodos.find(
    (editItem) => editItem.id == evt.target.dataset.id
  );

  if (editTask) {
    // Display a prompt dialog to edit the task item
    let editOverlay = document.createElement("div");
    editOverlay.id = "editOverlay";

    //ctreate input and assign task tittle and element
    let editTitle = document.createElement("h1");
    editTitle.textContent = "Edit todo";

    //create from input element
    let editForm = document.createElement("form");
    editForm.action = "";
    editForm.id = "editForm";

    //input holder
    let editInputHolder = document.createElement("div");
    editInputHolder.id = "editInputHolder";

    //edit title holder
    let editTitleholder = document.createElement("div");
    editTitleholder.id = "editTitleHolder";

    //edit lable
    let editTitleLabel = document.createElement("label");
    editTitleLabel.textContent = "Category";
    editTitleLabel.id = "editTitleLabel";

    //input value
    let editTitleValue = document.createElement("input");
    editTitleValue.value = editTask.taskTitle;
    editTitleValue.id = "editTitleValue";
    editTitleLabel.htmlFor = editTitleValue.id;

    //append edit label and title
    editTitleholder.appendChild(editTitleLabel);
    editTitleholder.appendChild(editTitleValue);

    //edit value holder
    let editValueholder = document.createElement("div");
    editValueholder.id = "editValueHolder";

    //edit label
    let editLabel = document.createElement("label");
    editLabel.textContent = "Edit todo";
    editLabel.id = "editLabel";

    //input value
    let editValue = document.createElement("input");
    editValue.value = editTask.taskItem;
    editValue.id = "editValue";
    editLabel.htmlFor = editValue.id;

    //append edit label and edit input value
    editValueholder.appendChild(editLabel);
    editValueholder.appendChild(editValue);

    //add title and input value to the form
    editInputHolder.appendChild(editTitleholder);
    editInputHolder.appendChild(editValueholder);

    //button holder
    let editBtnHolder = document.createElement("div");
    editBtnHolder.id = "editBtnHolder";

    //save button
    let editSaveBtn = document.createElement("div");
    editSaveBtn.id = "editSaveBtn";
    let saveBtnContent = document.createElement("P");
    saveBtnContent.textContent = "Ok";
    editSaveBtn.appendChild(saveBtnContent);

    editSaveBtn.addEventListener("click", () => {
      let taskTitle = document.getElementById("editTitleValue").value;
      let taskValue = document.getElementById("editValue").value;

      if (editTask.fulfilled === true) {
        const editClosedTask =
          JSON.parse(localStorage.getItem("closedItems")) || [];
        const index = editClosedTask.findIndex(
          (item) => item.id == evt.target.dataset.id
        );

        if (index !== -1) {
          // Update the object's properties
          editClosedTask[index].taskTitle = taskTitle;
          editClosedTask[index].taskItem = taskValue;

          // Save the updated array back to localStorage
          localStorage.setItem("closedItems", JSON.stringify(editClosedTask));
          displayTodos(editClosedTask);
          console.log("Updated closed item:", editClosedTask[index]);
        }
      } else {
        const progressTodos =
          JSON.parse(localStorage.getItem("progress")) || [];
        const index = progressTodos.findIndex(
          (item) => item.id == evt.target.dataset.id
        );

        if (index !== -1) {
          // Update the object's properties
          progressTodos[index].taskTitle = taskTitle;
          progressTodos[index].taskItem = taskValue;

          // Save the updated array back to localStorage
          localStorage.setItem("progress", JSON.stringify(progressTodos));
          displayTodos(progressTodos);
          console.log("Updated progress item:", progressTodos[index]);
        }
      }
    });

    //cancel btn
    let cancelBtn = document.createElement("div");
    cancelBtn.id = "cancelBtn";
    let cancelBtnContent = document.createElement("P");
    cancelBtnContent.textContent = "Cancel";
    cancelBtn.appendChild(cancelBtnContent);
    cancelBtn.addEventListener("click", () => {
      document.body.removeChild(editOverlay);
    });

    //add button to the container
    editBtnHolder.appendChild(editSaveBtn);
    editBtnHolder.appendChild(cancelBtn);

    //add input values to the form
    editForm.appendChild(editInputHolder);
    editForm.appendChild(editBtnHolder);

    //add overlay title and form to the overlay
    editOverlay.appendChild(editTitle);
    editOverlay.appendChild(editForm);

    document.body.appendChild(editOverlay);
  }
}
