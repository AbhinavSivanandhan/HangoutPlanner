    const tagContainer = document.querySelector('.tag-container');

    const input = document.querySelector('.tag-container input');

    var tags = [];

   function createTag(label){
      const div = document.createElement('div');
      div.setAttribute('class', 'tag');
      const span = document.createElement('span');
      span.innerHTML = label;
      const closeBtn = document.createElement('span');
      closeBtn.setAttribute('class','material-symbols-outlined');
      closeBtn.setAttribute('data-item', label);//set attribute just creates a variable on tag, this is allowed and it is handy
      closeBtn.innerHTML = 'close';
      
      div.appendChild(span);
      div.appendChild(closeBtn);
     return div;      
    }

function reset(){
    document.querySelectorAll('.tag').forEach(function(tag){
        tag.parentElement.removeChild(tag);
    })
}
function addTags(){
    reset(); 
    tags.slice().reverse().forEach(function(tag){
        const input = createTag(tag);
        tagContainer.prepend(input);
    })
}

//tagContainer.prepend(createTag('Value1'))
input.addEventListener('keyup', function(e){
   if(e.key === 'Enter'){
      tags.push(input.value);
      addTags();
      input.value='';
   }
})

document.addEventListener('click', function(e){
    if (e.target.innerHTML === 'close'){
        const value = e.target.getAttribute('data-item'); 
        const index = tags.indexOf(value);
        tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
        addTags();
    }
})

document.addEventListener("DOMContentLoaded", function() {
    var button = document.getElementById("tagButton");
    var alert = document.getElementById("tagAlert");
    button.addEventListener("click", function() {
      alert.classList.remove("d-none");
    });
  });

const inputField = document.getElementById("tagList");
  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

function sendTaglist(){
    const url = new URL(window.location.href);
    const occasion_id = url.pathname.split('occasions/').pop();
    // console.log(tags);
    const post_url='/occasions/'+occasion_id+'/tags'
    fetch(post_url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(tags)
})
.then(response => {
  if (response.ok) {
    // console.log(response)
    return response.json();
  }
  throw new Error('Network response was not ok.');
})
.then(json => {
  console.log('Data sent successfully:', json);
})
.catch(error => {
  console.error('Error sending data:', error);
});
}

// function getTaglist(){
    
// }
function getTaglist(){
  const url = new URL(window.location.href);
  const occasion_id = url.pathname.split('occasions/').pop();
  console.log('occ id:'+occasion_id);
    // console.log(tags);
    const get_url='/occasions/'+occasion_id+'/tags'
    console.log('get_url: '+get_url);
    fetch(get_url)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(tagsJSON => {
    // Assign the tags array to a variable
    console.log(tagsJSON[0].tag);
    tags = Array.from(tagsJSON[0].tag);
    console.log('Tags:', tags);
    console.log('Tagstype:', typeof tags);
  })
  .then(tagsJSON => {
    reset(); 
  //var dummy = ['a','b','c']
  tags.slice().reverse().forEach(function(tag){
      const input = createTag(tag);
      tagContainer.prepend(input);
  })
  //tags=tags;
  }) 
  .catch(error => {
    console.error('Error retrieving tags:', error);
  });
  
  
 // console.log('reload the page');

}
document.addEventListener("DOMContentLoaded", function() {
  // Code to be executed when the page is fully loaded
  getTaglist();
  //dummyLoad();
});

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: occasion.geometry.coordinates, // starting position [lng, lat]
zoom: 9, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(occasion.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${occasion.title}</h3><p>${occasion.location}</p>`
            )
    )
    .addTo(map)
