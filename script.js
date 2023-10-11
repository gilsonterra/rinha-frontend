'use strict'

const $containerUpload = document.getElementById("container-upload");
const $containerViewer = document.getElementById("container-viewer");
const $btnLoad = document.getElementById("btn-load");
const $msgError = document.getElementById("msg-error");
const $containerBtnLoad = document.querySelector(".btn-load");
const $treeviewer = document.getElementById("treeviewer");

const trampoline = fn => (...args) => {
  let result = fn(...args)
  while (typeof result === 'function') {
    result = result()
  }
  return result
}


const isObject = (val) =>{
  return val instanceof Object; 
}

$btnLoad.onchange = function () {
  $msgError.innerHTML = "";
  let file = this.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onprogress = () => {
      $containerBtnLoad.innerHTML = "Loading...";
    };

    reader.onloadend = () => {
      $containerBtnLoad.innerHTML = "Load JSON";
    };

    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target.result);

        console.log("content", content);
        createTree(content);

        $containerViewer.getElementsByClassName("title")[0].innerHTML =
          file.name;

        $containerUpload.style.display = "none";
        $containerViewer.style.display = "flex";

        //configureTreeviewer();
      } catch (e) {
        $msgError.innerHTML = "Invalid file. Please load a valid JSON file.";
        console.log(e);
      }
    };
    reader.readAsText(file);
  }
};

const createTreeTitle = (title, children) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  li.appendChild(span);

  if (children) {
    span.classList.add("caret");
    const ul = document.createElement("ol");
    ul.classList.add("nested");
    ul.classList.add("active");

    Object.keys(children).forEach((key) => {
      if(isObject(children[key])) {
        ul.appendChild(createTreeTitle(key, children[key]));
      }
      else {
        ul.appendChild(createTreeTitle(key, false));
      }
    });

    //console.log("ul", ul);
    li.appendChild(ul);
  }

  span.innerHTML = title;

  return li;
};

const createTree = (content) => {
  Object.keys(content).forEach((key) => {
    $treeviewer.appendChild(createTreeTitle(key, content[key]));
  });
};

const configureTreeviewer = () => {
  const toggler = document.getElementsByClassName("caret");
  let i;

  for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function () {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  }
};


