/* eslint-disable quotes */
import $ from "jquery";
import cuid from "cuid";

import api from "./api";
import store from "./store";

const generateBookmarkElement = function (bookmark) {
  console.log("generate bookmark element ran");
  return `<li class= "bookmark-element" data-item-id="${bookmark.id}"> 
  <div class='top-row'><span class="link-title"> ${bookmark.title}</span>
  
  <span class="rating"> Rating: ${bookmark.rating}</span></div>
  <div class="bottom-row hidden">
  <div id='url'class='hidden'> <a class='link-button' href="${bookmark.url}" target='_blank'> Go there!</a></div>
  <p> Description: </p>
  <p>${bookmark.desc}</p> 
  <button class= "delete"> Delete </button></div></li>`;
};

const addScreen = ` <form class="add-bookmarks-form ">
<label for="item">Title:</label>
<input required type="text" name="item-name" id="item-name" />
<label for="url">URL: </label>
<input required type="text" name="url" id="url" />
<label for="description">Description:</label>
<textarea name="description" id="description"></textarea>
<label for="rating">Rating: </label>
<input type="number" min="1" max="5" id="rating"/>
<button type="submit" class="add-bookmark-button">Add Bookmark</button>
<button type="reset"  class="cancel">Cancel</button>
</form>

</form>`;

const generateBookmarksString = function (bookmarks) {
  console.log("generate bookmarks str ran");
  const bookmarksList = bookmarks.map((bookmark) => {
    if (bookmark.rating >= store.filter) {
      return generateBookmarkElement(bookmark);
    }
  });
  console.log(
    "this is the bookmarks list from generate str: ",
    bookmarksList
  );
  return bookmarksList.join("");
};

const generateError = function (error) {
  $(".err-msg").children("span").html(`ERROR: ${store.error}`);
};

const renderError = function () {
  if (store.error) {
    console.log("render error ran with error")
    generateError(store.error);
    $(".err-msg").toggleClass("hidden");
  }
};

const handleCloseError = function () {
  $("body").on("click", ".errbtn", function (evt) {
    evt.preventDefault();
    console.log("handle close err ran");
    store.setError(null);
    console.log("err state is: ", store.error);
    $(".err-msg").toggleClass("hidden");
  });
};
const render = function () {
  $(".loading").addClass("hidden");
  renderError();
  console.log("render ran");
  if (store.adding) {
    $(".js-display-bookmarks").html(addScreen);
  } else if (store.bookmarks.length === 0) {
    $(".js-display-bookmarks").html(
      `<p> You don't have any bookmarks! Click Add to add some.</p>`
    );
  } else {
    let bookmarks = [...store.bookmarks];
    console.log("this is bkmarks: ", bookmarks);
    let bookmarksStr = generateBookmarksString(bookmarks);
    console.log("this is bookmarks str from render: ", bookmarksStr);
    $(".js-display-bookmarks").html(bookmarksStr);
  }
};


const handleAddButton = function () {
  $(".command-bar").on("click", ".add", function (evt) {
    console.log("add button clicked");
    store.setAdding();
    render();
  });
};

const handleNewBookmarkSubmit = function () {
  $("body").on("click", ".add-bookmark-button", function (event) {
    console.log("handel new bookmark submit ran, add was clicked");
    event.preventDefault();
    const newBookmarkTitle = $("#item-name").val();
    const newBookmarkUrl = $("#url").val();
    const newBookmarkDescription = $("#description").val();
    console.log("new desc: ", newBookmarkDescription);
    const newBookmarkRating = $("#rating").val();
    const newBookmark = {
      title: newBookmarkTitle,
      url: newBookmarkUrl,
      rating: newBookmarkRating,
      desc: newBookmarkDescription,
    };

    console.log("current bkmks: ", store.bookmarks);
    
    store.setFilter(0);
    let isOk;
    api
      .createBookmark(newBookmark)
      .then((res) => {
        isOk = res.ok;
        return res.json();
      })

      .then((jsonData) => {
        if (isOk) {
          store.setAdding();
          store.addBookmark(jsonData);
          render();
        } else {
          throw new Error(jsonData.message);
        }
      })
      .catch((error) => {
        store.setError(error.message);
        console.log("error: ", error);
        render();
        console.log("store err: ", store.error);
      });
  });
};

const handleCancelSubmit = function () {
  $("body").on("click", ".cancel", function (event) {
    console.log("cancel clicked");
    event.preventDefault();
    console.log("cancel button clicked");
    store.setAdding();
    render();
    $(".add-bookmarks-form").toggleClass("hidden");
  });
};

const getBookmarkFromElement = function (bookmark) {
  let id = $(bookmark).closest(".bookmark-element").data("item-id");
  console.log("id of clicked is: ", id);
  return store.findById(id);
};

const handleDeleteBookmark = function () {
  $(".js-display-bookmarks").on("click", ".delete", (evt) => {
    const bookmk = getBookmarkFromElement(evt.currentTarget);
    const theId = bookmk.id;
    let toDel = store.bookmarks.indexOf(bookmk);
    console.log("index ", toDel);
    console.log("id to del", theId);

    api
      .deleteBookmark(theId)
      .then(() => {
        console.log("bookmarks pre: ", store.bookmarks);
        store.bookmarks.splice(toDel, 1);

        console.log("bookmarks post: ", store.bookmarks);
        render();
      })
      .catch((error) => {
        store.setError(error.message);
      });
  });
};

const handleBookMarkExpand = function () {
  $(".js-display-bookmarks").on("click", "li", function (evt) {
    console.log("handle expand ran");
    $(this).children(".bottom-row").toggleClass("hidden");
    $(this).children().children("#url").toggleClass("hidden");
  });
};

const handleFilter = function () {
  $("#rating-filter").on("change", function (event) {
    console.log("filter ran");
    let value = this.value;
    console.log("filter set to ", value);
    store.setFilter(value);
    render();
  });
};


const bindEventListeners = function () {
  handleNewBookmarkSubmit();
  handleBookMarkExpand();
  handleDeleteBookmark();
  handleAddButton();
  handleFilter();
  handleCancelSubmit();
  handleCloseError();
};

export default {
  render,
  bindEventListeners,
};
