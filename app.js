const exerciseCollection = document.querySelector(".exercise-collection");
const search = document.querySelector(".search");
const input = document.querySelector(".input");
const specificCard = document.querySelector(".specific");
const overview = document.querySelector(".overview");
const exerciseType = document.querySelectorAll(".exercise-type1");
const navHome = document.querySelector(".nav-home");
const navExercise = document.querySelector(".nav-exercise");
const videosCollection = document.querySelector(".videos");
const lower = document.querySelector(".lower");

let exercises = [];
let videos = [];
let pageSize = 10;
let currentPage = 1;
let apiFeature = 0;
let specificExercise = [];
let bodypart;

/**************FETCHING DATA*************/
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "9f85b9c537msh6b643c8f3c7baf8p1c6bc6jsn65a5c18831a9",
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
  },
};

const options1 = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "c9e3832670mshe83d54350da2933p1de219jsn6c2fe36914ea",
    "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
  },
};

async function getSpecificData(exerciseSearch) {
  let fetchURL = `https://youtube-v31.p.rapidapi.com/search?q=${exerciseSearch}&part=snippet%2Cid&maxResults=4`;
  const url = await fetch(fetchURL, options1);
  const res = await url.json();
  console.log(res.items);
  videos = [...res.items];
}

async function getData() {
  let fetchURL = "https://exercisedb.p.rapidapi.com/exercises";
  if (apiFeature == 3) {
    fetchURL = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodypart.innerHTML.toLowerCase()}`;
  }

  const url = await fetch(fetchURL, options);
  const res = await url.json();
  exercises = [...res];
}

/**************FETCHING DATA COMPLETED*************/

/*****************************************************FUNCTIONS*******************************************************************/

/**************CREATING INDIVIDUAL CARD OF EXERCISES*************/

function createCard(data) {
  const html = document.createElement("div");
  html.innerHTML = "";
  html.classList.add("card");
  html.style.width = "18rem";
  html.innerHTML = `<img src="${data.gifUrl}" class="card-img-top" alt="...">
 <div class="card-body text-center">
   <h5 class="card-title text-center">${data.name}</h5>
   <button class="btn bg-primary text-white">${data.target}</button>
   <button class="btn bg-primary text-white">${data.equipment}</button>
 </div>`;
  exerciseCollection.appendChild(html);
  html.addEventListener("click", () => {
    console.log("yo bro who gotcha smiling like that!!");
    specificCard.innerHTML = "";
    createSpecificard(data);
    lower.classList.remove("hidden");
    overview.classList.add("hidden");
  });
}

/**************CREATING SPECIFIC CARD OF EXERCISE*************/
async function createSpecificard(data) {
  console.log("hello moto");
  apiFeature = 4;

  const html = document.createElement("div");
  html.classList.add("specificExercise");
  html.innerHTML = "";
  html.innerHTML = ` 
  <div class="leftpart">
    <img src="${data.gifUrl}" alt="">
  </div>
  <div class="rightpart">
    <h1>${data.name}</h1>
     <p class="">This exercise helps you to be fit by targetting your <span class="text-primary">${data.target}</span>. This also helps you to be better <span class="text-warning">version of yourself</span>.</p>
  </div>`;
  specificCard.appendChild(html);
  await getSpecificData(`${data.name}`);
  const lowerSection = document.createElement("section");
  lowerSection.classList.add("mansi");

  lowerSection.innerHTML = `<h1 class="text-primary exercise-heading">Videos that might be useful for you.</h1>`;

  videos.forEach((video) => {
    console.log(video);
    const html1 = document.createElement("div");
    html1.classList.add("slide");
    html1.innerHTML = "";
    html1.innerHTML = `<iframe width="320" height="180" src="https://www.youtube.com/embed/${video.id.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    lowerSection.appendChild(html1);
  });
  lower.appendChild(lowerSection);
}

function createSpecificExerciseVideo() {
  console.log(videosCollection);
}

/**************CREATING INDIVIDUAL CARD OF EXERCISES COMPLETED*************/

/**************FILTERING FETCHED DATA USING PAGINATION OF PAGE LIMIT=10 *************/
async function renderData(page = 1) {
  exerciseCollection.innerHTML = "";
  if (page == 1) {
    prevButton.style.visibility = "hidden";
  } else {
    prevButton.style.visibility = "visible";
  }

  if (page == numPages()) {
    nextButton.style.visibility = "hidden";
  } else {
    nextButton.style.visibility = "visible";
  }
  if (apiFeature == 1 || apiFeature == 3) {
    await getData();
  }
  console.log(exercises);

  if (apiFeature == 1 || apiFeature == 3) {
    exercises
      .filter((row, index) => {
        let start = (currentPage - 1) * pageSize;
        let end = currentPage * pageSize;
        if (index >= start && index < end) return true;
      })
      .forEach((element) => createCard(element));
  }

  if (apiFeature == 2) {
    console.log("hello ayush");
    specificExercise
      .filter((row, index) => {
        let start = (currentPage - 1) * pageSize;
        let end = currentPage * pageSize;
        if (index >= start && index < end) return true;
      })
      .forEach((element) => createCard(element));
  }
}
/**************FILTERING FETCHED DATA USING PAGINATION OF PAGE LIMIT=10 COMPLETED*************/

/**************CALCULATING TOTAL NUMBER OF PAGES FOR PAGINATION*************/
function numPages() {
  if (apiFeature == 1 || apiFeature == 3) {
    return Math.ceil(exercises.length / pageSize);
  }
  if (apiFeature == 2) {
    return Math.ceil(specificExercise.length / pageSize);
  }
}

/**************WINDOW LOAD *************/
function previousPage() {
  if (currentPage > 1) currentPage--;
  renderData(currentPage);
}
function nextPage() {
  if (currentPage * pageSize < exercises.length) currentPage++;
  renderData(currentPage);
}

/******************************************************EVENT LISTENERS *****************************************************/

document
  .querySelector("#nextButton")
  .addEventListener("click", nextPage, false);
document
  .querySelector("#prevButton")
  .addEventListener("click", previousPage, false);
/**************WINDOW LOAD *************/

window.addEventListener("load", () => {
  apiFeature = 1;
  renderData();
});

let potraitResolution = true;
let landscapeResolution = true;
window.addEventListener("resize", () => {
  console.log(screen.width);
  if (screen.width < 500) {
    document.querySelector(".landscape").classList.add("hidden");
    document.querySelector(".potrait").classList.remove("hidden");
  }

  if (screen.width > 500) {
    document.querySelector(".landscape").classList.remove("hidden");
    document.querySelector(".potrait").classList.add("hidden");
  }
});

search.addEventListener("click", function () {
  let a = 0;
  specificExercise = [];
  exercises.forEach((elem) => {
    let element = elem.name;
    if (element.toLowerCase().includes(input.value.toLowerCase())) {
      specificExercise.push(elem);
      a++;
    }
  });
  console.log(specificExercise);
  if (a == 0)
    window.alert(
      "Exercise is not present💣💣!Try searching for another one✨✨."
    );
  else {
    apiFeature = 2;
    renderData();
  }
});

navHome.addEventListener("click", () => {
  lower.classList.add("hidden");
  overview.classList.remove("hidden");
});

navExercise.addEventListener("click", () => {
  lower.classList.add("hidden");
  overview.classList.remove("hidden");
});

/******************************EXERCISES BY CATEGORIES **************************/

for (let i = 0; i < exerciseType.length; i++) {
  exerciseType[i].addEventListener(
    "click",
    function (e) {
      e.preventDefault();

      console.log(exerciseType[i].id);
      if (exerciseType[i].id == 10) {
        apiFeature = 1;
        renderData();
      } else {
        bodypart = exerciseType[i].children[1];
        console.log(bodypart.innerHTML);
        console.log("hello1");
        apiFeature = 3;
        renderData();
      }
    },
    false
  );
}

/**************JS Slider************/

let swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  centerSlide: "true",
  fade: "true",
  grabcursor: "true",
  loopFillGroupWithBlank: true,
  pagination: {
    el: ".swiper-pagination",

    dynamicBullets: "true",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    520: {
      slidesPerView: 2,
    },
    960: {
      slidesPerView: 3,
    },
  },
});
