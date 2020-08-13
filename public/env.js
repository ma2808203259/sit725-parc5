const testButtonFunction = () => {
  alert('Thank you for clicking')
}

//takes an array of journals, builds the html elements 
//and then display on the screen
const displayJournals = (journals) => {
  let journalsSpace = $('<div class="row col s12" id="journalsSpace"></div>')
  journals.forEach(journal => {
    let journalEntry = $('<div class="row col s12">' + journal.text + '</div>')
    journalsSpace.append(journalEntry)
  });
  $('#journalsContainer').append(journalsSpace)
}

//get the data from the server then display
const getJournals = () => {

  //some logic to get data from the server
  $.get('/journals', (result) => {
    
    $('#journalsContainer').find('*').not('.title').remove();

    displayJournals(result)
  })
}



//get the data from the modal,
//wraps it in a package and sends it to the server
const newJournal = () => {
  let text = $('#journalText').val()
  let data = {
    text: text,
    author: 'Guest'
  }
  $.ajax({
    url: '/journals',
    contentType: 'application/json',
    data: JSON.stringify(data),
    type: 'POST',
    success: (result) => {
      console.log(result);
    }
  })
}

$(document).ready(function () {
  console.log('Ready')

  //bind the button
  $('#testButton').click(testButtonFunction)

  //test get call
  $.get('/test?user_name="Fantastic User"', (result) => {
    console.log(result)
  })

  //map handling 
  var map = L.map('worldmap').setView([-37, 144], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // L.marker([-37, 144]).addTo(map)
  //   .bindPopup("VIC")
  //   .openPopup();
  let makers = [{
      lat: -37,
      lon: 144,
      text: 'my maker'
    },
    {
      lat: -37,
      lon: 145,
      text: 'my other maker'
    }
  ]
  let handleMarkers = (markers) => {
    markers.forEach(marker => {
      L.marker([marker.lat, marker.lon]).addTo(map)
        .bindPopup(marker.text)
        .openPopup();
    });
  }

  handleMarkers(makers)

  //once everything is ready, get the journals

  setInterval(() => {
    getJournals()

  }, 2000);

  //initializes the modal window
  $('.modal').modal();
})