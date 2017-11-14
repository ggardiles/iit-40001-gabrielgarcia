var puppeteer = require('puppeteer')
var delay = require('delay');
var _page, _browser;

puppeteer.launch()
  .then(function (browser) {
    _browser = browser;
    return browser.newPage();
  })
  .then(function (page) {
    _page = page;
    return page.goto('http://localhost:3000');
  })
  .then(function () {
    return _page.evaluate(test_landing_page);
  })
  .then(function () {
    return _page.goto('http://localhost:3000/users');
  })
  .then(function () {
    return _page.evaluate(test_users_page);
  })
  .then(function () {
    return delay(1000);
  })
  .then(function () {
    return _page.evaluate(test_btn_click);
  })
  .then(function () {
    return _browser.close();
  })
  .then(function () {
    console.log('Finished All tests correctly');
  })
  .catch(function (err) {
    console.error(err);
    _browser.close();
  });

// Testing functions whose functionality runs within the browser
function test_landing_page() {
  if (document.title !== 'Assignment 8') {
    throw new Error('Title should be ' + 'Assignment 8');
  }
  var links = document.querySelectorAll('a[href]');
  if (links[0].text.localeCompare('Home') !== 0) {
    throw new Error('Home link text ' + links[0].text + ' should be ' + 'Home');
  }
  if (links[0].href !== 'http://localhost:3000/') {
    throw new Error('Home link ' + links[0].href + ' should be ' + 'http://localhost:3000/');
  }
  if (links[1].text !== 'Users') {
    throw new Error('Users link text ' + links[1].text + ' should be ' + 'Users');
  }
  if (links[1].href !== 'http://localhost:3000/users') {
    throw new Error('Users link ' + links[1].href + ' should be ' + 'http://localhost:3000/users');
  }
  if (links[2].text !== 'Show Users') {
    throw new Error('Show Users button text ' + links[2].text + ' should be ' + 'Show Users');
  }
  if (links[2].href !== 'http://localhost:3000/users') {
    throw new Error('Show users link ' + links[2].href + ' should be ' + 'http://localhost:3000/users');
  }
  if (links[3].text !== 'Gabriel Garcia') {
    throw new Error('Owner link text ' + links[3].text + ' should be ' + 'Gabriel Garcia');
  }
  if (links[3].href !== 'https://github.com/ggardiles/iit-40001-gabrielgarcia') {
    throw new Error('Owner link ' + links[3].href + ' should be ' + 'https://github.com/ggardiles/iit-40001-gabrielgarcia');
  }
}

function test_users_page() {
  var heading = document.querySelector('div h1').textContent;
  if (heading !== 'Users') {
    throw new Error('Heading ' + heading + ' should be: Users')
  }

  var sub_heading = document.querySelector('div p.lead').textContent;
  if (sub_heading !== 'Here you can see a list of all current users.') {
    throw new Error('Sub Heading ' + sub_heading + ' should be: Here you can see a list of all current users.')
  }

  var img = document.querySelector('a img');
  if (img.src !== document.location.origin + '/images/adduser.png') {
    throw new Error('Incorrect image src ' + img.src + ' should be: ' + document.location.origin + '/images/adduser.png')
  }

  if (window.location.href !== document.location.origin + '/users') {
    throw new Error('Should be at the /users location for this test but is on: ' + window.location.href);
  }

  var search_value = document.querySelector('form input');
  search_value.value = '1';

  var search_btn = document.querySelector('form button');
  search_btn.click();
}

function test_btn_click() {
  if (window.location.href !== document.location.origin + '/users/1') {
    throw new Error('Search by ID doesn\'t work, should be at ' + document.location.origin + '/users/1' + ' but is on: ' + window.location.href);
  }
}