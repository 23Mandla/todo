"use strict";

window.addEventListener("load", () => {
  formOverlay();
  let taskItems = [];
  //display added todos after page reload
  let storedItem = localStorage.getItem("taskObject");
  if (storedItem != null) {
    taskItems = JSON.parse(storedItem);
    displayTodos(taskItems);
  }
});

//All progress items
let allTask = document.getElementById("all");
allTask.addEventListener("click", () => {
  let taskItems = [];
  //style clicked subheading
  allTask.style.backgroundColor = "#B17979";
  allTask.style.color = "whitesmoke";

  //set styles for "unclicked" subheadings
  inProgress.style.backgroundColor = "transparent";
  inProgress.style.color = "#473737";
  closed.style.backgroundColor = "transparent";
  closed.style.color = "#473737";

  //display items as stored from local storage
  let allTasks = localStorage.getItem("taskObject");
  if (allTask !== null) {
    taskItems = JSON.parse(allTasks);
    displayTodos(taskItems);
  }
});

//in-progress tasks
let inProgress = document.getElementById("inProgress");
inProgress.addEventListener("click", () => {
  let progressArry = [];
  //style clicked subheading
  inProgress.style.backgroundColor = "#B17979";
  inProgress.style.color = "whitesmoke";

  //set styles for "unclicked" subheadings
  allTask.style.backgroundColor = "transparent";
  allTask.style.color = "#473737";
  closed.style.backgroundColor = "transparent";
  closed.style.color = "#473737";

  progressArry = JSON.parse(localStorage.getItem("taskObject"));

  for (let item of progressArry) {
    let falseItems = [
      ...new Set(
        item.objectItem.filter((subItem) => {
          return subItem.fulfilled === false;
        })
      ),
    ];

    item.objectItem = falseItems;
    displayTodos(progressArry);
  }
});

//closed tasks
let closed = document.getElementById("closed");

closed.addEventListener("click", () => {
  let closedArray = [];
  //style clicked subheading
  closed.style.backgroundColor = "#B17979";
  closed.style.color = "whitesmoke";
  inProgress.style.backgroundColor = "transparent";
  allTask.style.backgroundColor = "transparent";
  inProgress.style.color = "#473737";
  allTask.style.color = "#473737";

  closedArray = JSON.parse(localStorage.getItem("taskObject"));

  for (let item of closedArray) {
    let trueItems = [
      ...new Set(
        item.objectItem.filter((subItem) => {
          return subItem.fulfilled === true;
        })
      ),
    ];
    console.log(trueItems);
    item.objectItem = trueItems;
    displayTodos(closedArray);
  }
});

//delete all the tasks in the array
let delBtn = document.getElementById("clear");
delBtn.addEventListener("click", () => {
  let arrayItems = [];
  arrayItems - JSON.stringify(localStorage.getItem("taskObject"));
  arrayItems.splice(0);
  localStorage.setItem("taskObject", JSON.stringify(arrayItems));
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
  let taskItems = [];
  //get input value and create an object
  let taskTitle = document.getElementById("catInp").value;
  let taskItem = document.getElementById("inputEl").value;

  let taskObject = {
    taskTitle: taskTitle,
    objectItem: [
      {
        id: Math.floor(Math.random() * 100),
        fulfilled: false,
        category: taskTitle,
        taskItem: taskItem,
      },
    ],
  };

  taskItems = JSON.parse(localStorage.getItem("taskObject"));
  let titleExist = taskItems.find((item) => item.taskTitle === taskTitle);
  if (titleExist) {
    titleExist.objectItem.push({
      id: Math.floor(Math.random() * 100) + Date.now(),
      fulfilled: false,
      category: titleExist.taskTitle,
      taskItem: taskItem,
    });
    displayTodos(taskItems);
  } else {
    taskItems.push(taskObject);
    displayTodos(taskItems);
  }
  localStorage.setItem("taskObject", JSON.stringify(taskItems));
}

function displayTodos(items) {
  // Clear existing content
  let categories = document.getElementById("categories");
  let listItems = document.getElementById("listItems");
  categories.innerHTML = "";
  listItems.innerHTML = "";

  if (items.length <= 0) {
    listItems.innerHTML = `<h1>No todos add yet</h1>`;
  } else {
    for (let item of items) {
      // Side menu titles
      let category = document.createElement("h3");
      category.classList.add("catContent");
      category.textContent = item.taskTitle;
      categories.appendChild(category);

      //filter todos by category
      let catContents = document.querySelectorAll(".catContent");
      catContents.forEach((category) => {
        category.addEventListener("click", (evt) => {
          let catTitle = evt.target.textContent;
          let catContent = [];
          catContent = JSON.parse(localStorage.getItem("taskObject"));
          if (catContent !== null) {
            for (let catItem of catContent) {
              let catObject = catItem.objectItem.filter((cat) => {
                return cat.category == catTitle;
              });
              catItem.objectItem = catObject;
              displayTodos(catContent);
            }
          }
        });
      });

      //todo list
      for (let subItem of item.objectItem) {
        //create place holder for list todos
        let todoContainer = document.createElement("div");
        todoContainer.classList.add("todoContainer");

        //create checked input
        let checkInput = document.createElement("div");
        checkInput.id = subItem.id;
        checkInput.classList.add("checkbox");
        if (subItem.fulfilled === true) {
          checkInput.classList.add("active");
        } else {
          checkInput.classList.remove("active");
        }

        checkInput.addEventListener("click", (evt) => {
          let subItemIndex = item.objectItem.findIndex(
            (subItem) => subItem.id == evt.target.id
          );

          if (subItemIndex > -1) {
            item.objectItem[subItemIndex].fulfilled =
              !item.objectItem[subItemIndex].fulfilled;
            checkInput.classList.toggle("active");
            localStorage.setItem("taskObject", JSON.stringify(items));
          }
        });

        //create list item
        let listItem = document.createElement("li");
        listItem.classList.add("listItem");

        let listContent = document.createElement("p");
        listContent.textContent = subItem.taskItem;
        listItem.appendChild(listContent);

        let editContainer = document.createElement("div");
        editContainer.id = "editContainer";

        //edit icon
        let editIcon = document.createElement("i");
        editIcon.classList.add("fa-solid", "fa-pen-to-square");
        editIcon.dataset.id = subItem.id;
        editIcon.addEventListener("click", editItem);

        //delete icon
        let delIcon = document.createElement("i");
        delIcon.classList.add("fa-solid", "fa-trash-can");
        delIcon.dataset.id = subItem.id;
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
}

function deleteItem(evt) {
  let storedItems = [];
  let itemToDelete = localStorage.getItem("taskObject");
  storedItems = JSON.parse(itemToDelete);
  for (let item of storedItems) {
    let subItemIndex = item.objectItem.findIndex(
      (subItem) => subItem.id == evt.target.dataset.id
    );

    if (subItemIndex !== -1) {
      item.objectItem.splice(subItemIndex, 1);
      localStorage.setItem("taskObject", JSON.stringify(storedItems));
      displayTodos(storedItems);
      return;
    }
  }
}

function editItem(evt) {
  // Find the task item in the taskItems array by its ID
  let storedItems = [];
  let itemToEdit = localStorage.getItem("taskObject");
  storedItems = JSON.parse(itemToEdit);
  for (let item of storedItems) {
    let editTask = item.objectItem.find(
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
      editTitleValue.value = editTask.category;
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
        editTask.taskItem = taskValue;
        editTask.category = taskTitle;
        displayTodos(storedItems);
        localStorage.setItem("taskObject", JSON.stringify(storedItems));
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
}
