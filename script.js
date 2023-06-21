  // Initializing variables
  var groupData;

  // Loading Data
  d3.csv("groups.csv", function(data) {

    // Store the loaded data in a variable
    groupData = data;
  })

  // Defining languages
  var english = /[a-zA-Z]/;
  var korean = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7A3]/;
  var russian = /[\u0400-\u04FF]/;
  var chinese = /[\u4E00-\u9FFF\u3400-\u4DBF]/;
  var japanese = /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\u4E00-\u9FFF]/;
  var arabic = /[\u0600-\u06FF\u0750-\u077F]/;
  var hindi = /[\u0900-\u097F]/;
  var numbers = /[0-9]/;

  // Get the current date
  var currentDate = new Date();

  // Format the current date as YYYY-MM-DD
  var year = currentDate.getFullYear();
  var month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  var day = currentDate.getDate().toString().padStart(2, "0");
  var formattedCurrentDate = `${year}-${month}-${day}`;

  // Initializing other variables
  var language = "any";
  var length = "any";
  var startDate = "Invalid Date";
  var endDate = "Invalid Date";
  var matching = false;
  var temp;
  var maxPerPage = 15;
  var currentPage = 1;
  var lower, upper;

  // Function to apply settings
  function applySettings() {
    language = document.getElementById("language").value;
    length = document.getElementById("length").value;
    startDate = new Date(document.getElementById("start-date").value);
    endDate = new Date(document.getElementById("end-date").value);
    matching = document.getElementById("matching-checkbox").checked;
    endDate.setDate(endDate.getDate() + 1);
  }

  // Filtering by Tag
  function filterByTag() {
    currentPage = 1;
    var containsRadioButton = document.getElementById("contains").checked;
    var query = document.getElementById("search-bar").value;
    var regex = languageRegex()
    var mode = "tag"
    temp = filterByLength(mode)
    var filteredGroups = temp.filter(function(group) {
      if (containsRadioButton && language === "any") {
        return (group.Tag.toLowerCase().includes(query.toLowerCase()))
      } else if (containsRadioButton && language !== "any") {
        return (group.Tag.toLowerCase().includes(query.toLowerCase()) && regex.test(group.Tag))
      } else {
        return (group.Tag.toLowerCase() === query.toLowerCase())
      }
    });
    displayResults(filteredGroups);
  }

  // Filtering by Name
  function filterByName() {
    currentPage = 1;
    var containsRadioButton = document.getElementById("contains").checked;
    var query = document.getElementById("search-bar").value;
    var regex = languageRegex()
    var mode = "name"
    temp = filterByLength(mode)
    var filteredGroups = temp.filter(function(group) {
      if (containsRadioButton && language === "any") {
        return (group.Name.toLowerCase().includes(query.toLowerCase()))
      } else if (containsRadioButton && language !== "any") {
        return (group.Name.toLowerCase().includes(query.toLowerCase()) && regex.test(group.Name))
      } else {
        return (group.Name.toLowerCase() === query.toLowerCase())
      }
    });
    displayResults(filteredGroups);
  }

  // Set the languageRegex based on the selected language
  function languageRegex() {
    if (language === "english") {
      return english;
    } else if (language === "korean") {
      return korean;
    } else if (language === "russian") {
      return russian;
    } else if (language === "chinese") {
      return chinese;
    } else if (language === "japanese") {
      return japanese;
    } else if (language === "arabic") {
      return arabic;
    } else if (language === "hindi") {
      return hindi;
    } else if (language === "numbers") {
      return numbers;
    }
  }

  // Filtering by Length of Name/Tag
  function filterByLength(mode) {
    temp = filterByDate()
    return temp.filter(function(group) {
      if (length === "any") {
        return true
      } else if (mode === "tag") {
        return (group.Tag.length === parseInt(length))
      } else {
        return (group.Name.length === parseInt(length))
      }
    });
  }

  // Filtering by Date
  function filterByDate() {
    temp = filterByMatching()
    return temp.filter(function(group) {
      if ((isNaN(Date.parse(startDate)) && isNaN(Date.parse(endDate)))) {
        return true
      } else if (isNaN(Date.parse(startDate)) && !(isNaN(Date.parse(endDate)))) {
        var curr = new Date(group.Date)
        return (curr <= endDate)
      } else if (!(isNaN(Date.parse(startDate))) && isNaN(Date.parse(endDate))) {
        var curr = new Date(group.Date)
        return (curr >= startDate)
      } else {
        var curr = new Date(group.Date)
        return (curr >= startDate && curr <= endDate)
      }
    });
  }

  // Filtering by seeing if Name and Tag match
  function filterByMatching() {
    return groupData.filter(function(group) {
      if (matching) {
        return (group.Name.toLowerCase() === group.Tag.toLowerCase() && group.Date !== "N/A")
      } else {
        return (group.Date !== "N/A")
      }
    });
  }

  // Displaying results
  function displayResults(results) {
    var resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = "";
    var paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = "";
    var toContainer = document.getElementById("to-container");
    toContainer.innerHTML = "";
    var searchContainer = document.querySelector(".search-container");
    if (results.length === 0) {
      searchContainer.style.marginTop = "40vh";
      resultsContainer.innerHTML = "no results found.."
    } else {
      searchContainer.style.marginTop = "5vh";
      resultCreation(results, resultsContainer)
      paginationCreation(results)
    }
  }

  // Creating displays for each group
  function resultCreation(results, container) {
    var startIndex = (currentPage - 1) * maxPerPage;
    var endIndex = Math.min(startIndex + maxPerPage, results.length);
    for (var i = startIndex; i < endIndex; i++) {
      var currGroup = results[i];
      var card = document.createElement("div");
      card.className = "result";
      var groupID = document.createElement("p");
      groupID.innerHTML = "Group ID: " + currGroup["Group ID"];
      card.appendChild(groupID);
      var name = document.createElement("p");
      name.innerHTML = "Name: " + currGroup["Name"];
      card.appendChild(name);
      var tag = document.createElement("p");
      tag.innerHTML = "Tag: " + currGroup["Tag"];
      card.appendChild(tag);
      var creationDate = document.createElement("p");
      creationDate.innerHTML = "Creation Date: " + currGroup["Date"];
      card.appendChild(creationDate);
      var groupLink = document.createElement("a");
      groupLink.setAttribute('href', "https://steamcommunity.com/gid/" + currGroup["Group ID"])
      groupLink.setAttribute('target', "_blank")
      groupLink.innerHTML = "Steam Page";
      card.appendChild(groupLink);
      container.appendChild(card)
    }
  }

  // Creating pagination buttons
  function paginationCreation(results) {
    var paginationContainer = document.getElementById("pagination-container");
    var menu = document.getElementById("menu");
    var toContainer = document.getElementById("to-container");
    var totalPages = Math.ceil(results.length / maxPerPage)
    if (totalPages > 1) {
      if (currentPage === 1) {
        lower = 1;
        upper = Math.min(totalPages, 5);
      }

      // First page button
      var firstButton = document.createElement("button");
      firstButton.className = "pagination-button";
      firstButton.id = "first-button";
      var firstIcon = document.createElement("i");
      firstIcon.className = "fa-solid fa-angles-left";
      firstButton.appendChild(firstIcon);
      firstButton.onclick = function() {
        if (currentPage !== 1) {
          currentPage = 1
          menu.classList.remove("menu-active")
          window.scrollTo(0, 0);
          displayResults(results)
        }
      }
      paginationContainer.appendChild(firstButton)

      // Prev page button
      var prevButton = document.createElement("button");
      prevButton.className = "pagination-button";
      prevButton.id = "prev-button";
      var prevIcon = document.createElement("i");
      prevIcon.className = "fa-solid fa-angle-left";
      prevButton.appendChild(prevIcon);
      prevButton.onclick = function() {
        if (currentPage > 1) {
          if (currentPage == lower) {
            lower--;
            upper--;
            currentPage--;
          } else {
            currentPage--;
          }
        }
        menu.classList.remove("menu-active")
        window.scrollTo(0,0)
        displayResults(results)
      }
      paginationContainer.appendChild(prevButton)

      // Page #'s
      for (var i = lower; i <= upper; i++) {
        var pageButton = document.createElement("button");
        pageButton.innerHTML = i;
        pageButton.classList.add("pagination-button");
        if (i === currentPage) {
          pageButton.classList.add("active");
        }
        pageButton.onclick = (function(pageNumber) {
          return function() {
            currentPage = pageNumber;
            menu.classList.remove("menu-active")
            window.scrollTo(0, 0);
            displayResults(results);
          }
        })(i);
        paginationContainer.appendChild(pageButton);
      }

      // Next page button
      var nextButton = document.createElement("button");
      nextButton.className = "pagination-button";
      nextButton.id = "next-button";
      var nextIcon = document.createElement("i");
      nextIcon.className = "fa-solid fa-angle-right";
      nextButton.appendChild(nextIcon);
      nextButton.onclick = function() {
        if (currentPage < totalPages) {
          if (currentPage == upper) {
            lower++;
            upper++;
            currentPage++;
          } else {
            currentPage++;
          }
        }
        menu.classList.remove("menu-active")
        window.scrollTo(0,0)
        displayResults(results)
      }
      paginationContainer.appendChild(nextButton)

      // Last page button
      var lastButton = document.createElement("button");
      lastButton.className = "pagination-button";
      lastButton.id = "last-button";
      var lastIcon = document.createElement("i");
      lastIcon.className = "fa-solid fa-angles-right";
      lastButton.appendChild(lastIcon);
      lastButton.onclick = function() {
        if (currentPage !== totalPages) {
          currentPage = totalPages;
          upper = totalPages;
          lower = Math.max(1, totalPages - 4);
          menu.classList.remove("menu-active")
          window.scrollTo(0, 0);
          displayResults(results)
        }
      }
      paginationContainer.appendChild(lastButton)

      // "Go to" button
      var toButton = document.createElement("button");
      toButton.className = "to-button";
      toButton.id = "to-button";
      var toIcon = document.createElement("i");
      toIcon.className = "fa-solid fa-paper-plane";
      toButton.appendChild(toIcon);
      toButton.onclick = function() {
        var toMenu = document.getElementById("to-menu");
        toMenu.classList.toggle("to-menu-active");

      }
      toContainer.appendChild(toButton);

      // "Go to" menu
      var toMenu = document.createElement("div");
      toMenu.className = "to-menu";
      toMenu.id = "to-menu";
      toContainer.appendChild(toMenu);

      // Search bar and button
      var toBar = document.createElement("input");
      toBar.className = "to-bar";
      toBar.id = "to-bar";
      toBar.placeholder="page"
      var toGo = document.createElement("button");
      toGo.className = "to-go";
      toGo.id = "to-go";
      toGo.innerHTML = "go"
      toGo.onclick = function() {
        var pageNumber = parseInt(document.getElementById("to-bar").value);
        if (isNaN(pageNumber) || pageNumber <= 0 || pageNumber > totalPages) { // Do nothing if invalid input
          return;
        } else if (!isNaN(pageNumber) && pageNumber <= 3) {
          var toMenu = document.getElementById("to-menu");
          toMenu.classList.toggle("to-menu-active");
          currentPage = pageNumber;
          lower = 1;
          upper = Math.min(upper, 5)
          menu.classList.remove("menu-active")
          window.scrollTo(0, 0);
          displayResults(results);
        } else if (!isNaN(pageNumber) && pageNumber >= 3 && pageNumber <= totalPages-2) {
          var toMenu = document.getElementById("to-menu");
          toMenu.classList.toggle("to-menu-active");
          currentPage = pageNumber;
          lower = pageNumber-2;
          upper = pageNumber+2
          menu.classList.remove("menu-active")
          window.scrollTo(0, 0);
          displayResults(results);
        } else if (!isNaN(pageNumber) && pageNumber >= totalPages-2) {
          var toMenu = document.getElementById("to-menu");
          toMenu.classList.toggle("to-menu-active");
          currentPage = pageNumber;
          lower = Math.min(totalPages-4, currentPage-2);
          upper = totalPages;
          menu.classList.remove("menu-active")
          window.scrollTo(0, 0);
          displayResults(results);
        }
      }
      toMenu.appendChild(toBar);
      toMenu.appendChild(toGo);
    }
  }

  // UPON LOADING
  window.onload=function(){

    var menu = document.getElementById("menu");

    // Setting max date
    var maxDate = document.getElementById("end-date");
    maxDate.setAttribute("max", formattedCurrentDate)
    var maxDate2 = document.getElementById("start-date");
    maxDate2.setAttribute("max", formattedCurrentDate)

    // Event listener for Cogwheel menu
    document.getElementById("cogwheel-button").addEventListener("click", function() {
      menu.classList.toggle("menu-active");
    });

    // Event listener for Apply button
    document.getElementById("apply").addEventListener("click", function() {
      applySettings();
      menu.classList.toggle("menu-active");
    });

    // Search by name button
    document.getElementById("searchbyname").addEventListener("click", function() {
      menu.classList.remove("menu-active")
      filterByName()
    });

    // Search by tag button
    document.getElementById("searchbytag").addEventListener("click", function() {
      menu.classList.remove("menu-active")
      filterByTag()
    });
  }