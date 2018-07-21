

function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function start() {
    if (this.readyState === 4 && this.status === 200) {
      callbackFunc(this);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var userDatas = JSON.parse(xhttp.responseText)[2].data;
  removeNullCredits(userDatas);
  userDatas = tempArray;
  costOrder(userDatas);
  userDatas = userDatas.concat(tempArrayNull);
  userDatas = deleteNull(userDatas);
  userDatas = nullToUnknown(userDatas);
  showSpaceshipList(userDatas);

  var footerDatas = 'One man crew: ' + statCrew(userDatas) + ', Largest cargo capacity: ' + largestCargo(userDatas) + ', All crew: ' + allPassengersNumber(userDatas) + ', Longest ship: ' + longestShip(userDatas);
  var leftDiv = document.querySelector('.spaceship-list');
  var newP = document.createElement('p');
  newP.className = 'footer-p';
  leftDiv.appendChild(newP);
  document.querySelector('p').innerHTML = footerDatas;
}

getData('/json/spaceships.json', successAjax);

var tempArrayNull = [];
var tempArray = [];

function removeNullCredits(userDatas) {
  for (var i in userDatas) {
    if (!userDatas[i].cost_in_credits) {
      tempArrayNull.push(userDatas[i]);
    } else {
      tempArray.push(userDatas[i]);
    }
  }
  return tempArray;
}

function costOrder(userDatas) {
  for (var i = 0; i < userDatas.length - 1; i++) {
    for (var j = i + 1; j < userDatas.length; j++) {
      if (parseInt(userDatas[i].cost_in_credits, 10) > parseInt(userDatas[j].cost_in_credits, 10)) {
        var temp = [userDatas[i], userDatas[j]];
        userDatas[i] = temp[1];
        userDatas[j] = temp[0];
      }
    }
  }
  return userDatas;
}

function deleteNull(userDatas) {
  for (var i = 0; i < userDatas.length; i++) {
    if (!userDatas[i].consumables) {
      userDatas.splice(i, 1);
      i--;
    }
  }
  return userDatas;
}

function nullToUnknown(userDatas) {
  for (var i = 0; i < userDatas.length; i++) {
    for (var k in userDatas[i]) {
      if (userDatas[i].hasOwnProperty(k)) {
        if (!userDatas[i][k]) {
          userDatas[i][k] = 'unknown';
        }
        if (userDatas[i][k] === '0') {
          userDatas[i][k] = 'unknown';
        }
      }
    }
  }
  return userDatas;
}

function  statCrew(spaceships) {
  var oneCrew = 0;
  for (var i = 0; i < spaceships.length; i++) {
    if (parseInt(spaceships[i].crew, 10) === 1) {
      oneCrew++;
    }
  }
  return oneCrew;
}


function largestCargo(spaceships) {
  var largestCargoShip = parseInt(spaceships[0].cargo_capacity, 10);
  var largestCargoName = spaceships[0].model;
  for (var i = 1; i < spaceships.length; i++) {
    if (parseInt(spaceships[i].cargo_capacity, 10) > largestCargoShip) {
      largestCargoShip = parseInt(spaceships[i].cargo_capacity, 10);
      largestCargoName = spaceships[i].model;
    }
  }
  return largestCargoName;
}

function allPassengersNumber(spaceships) {
  var allPassengers = 0;
  for (var i = 0; i < spaceships.length; i++) {
    if (spaceships[i].passengers !== 'unknown') {
      allPassengers += parseInt(spaceships[i].passengers, 10);
    }
  }
  return allPassengers;
}

function longestShip(spaceships) {
  var longShip = parseInt(spaceships[0].lengthiness, 10);
  var longestShipPictureName = spaceships[0].image;
  for (var i = 0; i < spaceships.length; i++) {
    if (parseInt(spaceships[i].lengthiness, 10) > longShip) {
      longShip = parseInt(spaceships[i].lengthiness, 10);
      longestShipPictureName = spaceships[i].image;
    }
  }
  return longestShipPictureName;
}

// showSpaceshipList(userDatas);


// Hajók listájának megjelenítése - array a listSource
function showSpaceshipList(userDatas) {
  var container = document.querySelector('.spaceship-list');
  var listDiv = createListDiv(container);
  for (let i = 0; i < userDatas.length; i++) {
    createSpaceship(listDiv, userDatas[i]);
  }
}

function createListDiv(container) {
  var listDiv = container.querySelector('.list-div');
  if (!listDiv) {
    listDiv = document.createElement('div');
    listDiv.className = 'list-div';
    container.appendChild(listDiv);
  }
  return listDiv;
}

function createSpaceship(list, spaceship) {
  var itemDiv = document.createElement('div');
  itemDiv.className = 'spaceship-item';
  itemDiv.spaceship = spaceship;
  itemDiv.onclick = function addOnclick() {
    creatOneSpaceship(this.spaceship);
  };

  var img = document.createElement('img');
  img.src = '/img/' + spaceship.image;
  img.alt = 'No picture found';
  img.onerror = function noImg(ev) {
    ev.target.src = '/img/noimg.jpg';
  };

  var span = document.createElement('span');
  var outputSpaceship = '';
  for (var i in spaceship) {
    if (Object.prototype.hasOwnProperty.call(spaceship, i)) {
      outputSpaceship += `${i}: ${spaceship[i]}, `;
    }
  }
  span.innerHTML = outputSpaceship;

  itemDiv.appendChild(img);
  itemDiv.appendChild(span);

  list.appendChild(itemDiv);
}

function creatOneSpaceship(spaceship) {
  var container = document.querySelector('.one-spaceship');
  var listDiv = createListDiv(container);
  listDiv.innerHTML = '';

  var img = document.createElement('img');
  img.src = '/img/' + spaceship.image;
  img.onerror = function imgAgain(ev) {
    ev.target.src = '/img/noimg.jpg';
  };

  var title = document.createElement('h3');
  title.innerHTML = spaceship.model;

  var outputSpaceship = '';
  for (var i in spaceship) {
    if (Object.prototype.hasOwnProperty.call(spaceship, i)) {
      outputSpaceship += `${i}: ${spaceship[i]}\n`;
    }
  }

  var shipDescription = document.createElement('pre');
  shipDescription.innerHTML = outputSpaceship;

  listDiv.appendChild(img);
  listDiv.appendChild(title);
  listDiv.appendChild(shipDescription);
}

function searchShip() {
  var inputValue = document.querySelector('#search-text').value;
  var list = document.querySelectorAll('.spaceship-list .spaceship-item');
  for (var i = 0; i < list.length; i++) {
    if (list[i].spaceship.model.toLowerCase().indexOf(inputValue.toLowerCase()) < 0) {
      list[i].style.display = 'none';
    } else {
      list[i].style.display = 'block';
    }
  }
}

document.querySelector('#search-button').onclick = searchShip;
