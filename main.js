// GLOBAL VAR AND FUNC
const mockLink = "https://64dc646de64a8525a0f66d77.mockapi.io/TruongDzz"

const ctn = document.getElementById("container")
const coll = document.getElementsByClassName("collapsible");

const title = document.getElementById("title");
const content = document.getElementById("content");
const rating = document.getElementById("rating");

const inputsContainer = document.getElementById("inputsContainer");
const stepInput = document.getElementsByClassName("step")
const descriptionInput = document.getElementsByClassName("description")

let subdata = [] // store the Description step

const fileInputs = document.getElementsByName('img');// get img files
const filesArray = [];//store the base64 image of subdata


// Get the modal
const modal = document.getElementById("myModal");
          
// Get the button that opens the modal
const addNew = document.getElementById("add-new");
// Get the button that add new data
const addBtn = document.getElementById("addContent")

// Get the button that add new data
const updateBtn = document.getElementById("update-data")
// Get the <span> element that closes the modal
const closeModal = document.getElementsByClassName("close")[0];
          
// When the user clicks the button, open the modal 
addNew.onclick = function() {
    updateBtn.style.display = "none";
    addBtn.style.display = "block";
    modal.style.display = "block";

  }
          
// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
   modal.style.display = "none";
   location.reload(true)

}
          
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
    location.reload(true)
    }
}


// ------------------------------------------------------------------------
// GET FUNCTION 
async function loadDatas() {
    try {
        let response = await fetch(mockLink);
        let result = await response.json();
        // console.log(result);


        // return result;
        for (let i = 0; i < result.length; i++) {
            ctn.innerHTML +=
                '<button type="button" class="collapsible">'+'📖 ' + result[i].title + '</button>'+ 
                '<div class="showContent" id="item-content'+ i + '">' +
                // Rating change
                // =======================================
                '<select name="rating" id="ratingChanger'+result[i].id+'" onchange="ratingChanger('+result[i].id+')">'+
                '<option value="" selected disabled hidden>rating: '+result[i].rating+'/5</option>'+
                '<option value="1">1</option>'+
                '<option value="2">2</option>'+
                '<option value="3">3</option>'+
                '<option value="4">4</option>'+
                '<option value="5">5</option>'+
                '</select>'+
                // =====================================
                'content: '+ result[i].content+
                '<button class ="button-80" style="background: red;color: white;" onclick="removeData('+result[i].id+')">'+"Xoá"+'</button>'+ 
                '<button class ="button-80" style="background: orange;color: white;" onclick="getUpdateData('+result[i].id+') ">'+"Sửa"+'</button> '+
                '</div>';

            
            let step_stepDescription = result[i].step_descriptons;
            const stepDisplay = document.getElementById("item-content" + i);

            for (let j = 0; j < step_stepDescription.length; j++) {
                stepDisplay.innerHTML +=
                '<div class = "step-img">'+
                    step_stepDescription[j].step+
                    step_stepDescription[j].description+
                    '<img src = "' + step_stepDescription[j].image + '">'+'</div>' ;
            }
        }

        for (let i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
              this.classList.toggle("active");
              const showContent = this.nextElementSibling;
              if (showContent.style.display === "contents") {
                  showContent.style.display = "none";
              } else {
                  showContent.style.display = "contents";
              }
            });
          }
    } catch (err) { }
}







// ------------------------------------------------------------------------
// POST FUNCTION 
  
// Create a new div to hold the input fields
const newInputDiv = document.createElement("div");

function addInputFields() {

  
    // Create the step input field
    const step = document.createElement("input");
    step.type = "text";
    step.className = "step";
    step.placeholder = "bước";
  
    // Create the step descriptions input field
    const stepDescription = document.createElement("input");
    stepDescription.type = "text";
    stepDescription.className = "description";
    stepDescription.placeholder = "Mô tả";

     // Create the img input field
     const img = document.createElement("input");
     img.type = "file";
     img.className = "img";
     img.name = "img";
     
  
    // Append the input fields to the new div
    newInputDiv.appendChild(step);
    newInputDiv.appendChild(stepDescription);
    newInputDiv.appendChild(img);
  
    // Append the new div to the inputs container
    inputsContainer.appendChild(newInputDiv);

    base64img();

  }

  function closeInputDiv(params) {
    
  }

function base64img() {
// Handle file selection for each input field
for (let i = 0; i < fileInputs.length; i++) {
  const fileInput = fileInputs[i];
  fileInput.addEventListener('change', function(event) {
    const fileList = event.target.files;

    // Iterate over the selected files
    for (let j = 0; j < fileList.length; j++) {
      const file = fileList[j];

      // Create a new FileReader object
      const reader = new FileReader();

      // Set the onload event handler
      reader.onload = function(event) {
        // Get the Base64 data from the FileReader result
        const base64Data = event.target.result;
        console.log('base64Data ', base64Data);

        // Add the file object to the array
        filesArray.push(base64Data);

        console.log(filesArray);
      };

      // Read the file as Data URL (Base64)
      reader.readAsDataURL(file);
    }
  });
}
}

  
        

function getFormData() {

    for (let i = 0; i < stepInput.length; i++) {
        const step = stepInput[i].value;
        const description = descriptionInput[i].value;
        const img = filesArray[i];
        console.log(img);

        // Create a new object using the input values
        const stepObject = {
            step: step,
            description: description,
            image: img};

        // Add the new object to the array
    subdata.push(stepObject)
    }

    
    const data = { title: title.value,
            content: content.value,
            rating: rating.value,
            step_descriptons: subdata };
            
    addData(data);
    
  }

async function addData(data) {
    try {
        let response = await fetch(mockLink, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        let result = await response.json();
        location.reload(true);
        loaddatas();
        console.log("post ok: ",result);
        return result;
    } catch (err) {
    }
}
// ------------------------------------------------------------------------


// DELETE FUNCTION 
// ------------------------------------------------------------------------
async function removeData(id) {
    if (confirm("Bạn có chắc muốn xoá!") == true) {
        try {
            let response = await fetch(mockLink +"/"+ id, {
                method: "DELETE",
            })
            console.log("delete ok")
            location.reload(true);
            loadDatas();
        } catch (err) {
        }
      } else {
        alert("You canceled!") ;
      }

}

// ------------------------------------------------------------------------
// UPDATE FUNCTION
function base64imgChange() {
    // Handle file selection for each input field
    for (let i = 0; i < fileInputs.length; i++) {
      const fileInput = fileInputs[i];
      fileInput.addEventListener('change', function(event) {
        const fileList = event.target.files;
    
        // Iterate over the selected files
        for (let j = 0; j < fileList.length; j++) {
          const file = fileList[j];
    
          // Create a new FileReader object
          const reader = new FileReader();
    
          // Set the onload event handler
          reader.onload = function(event) {
            // Get the Base64 data from the FileReader result
            const base64Data = event.target.result;
    
            filesArray.splice(i, 1, base64Data);
          };
          reader.readAsDataURL(file);
        }
      });
    }
    }

function getUpdateData(id) {
    const apiUrl = mockLink+"/"+ id ;
    // Attach the onclick event handler
    updateBtn.style.display = "block";
    addBtn.style.display = "none";
    modal.style.display = "block";
    const clickUpdate = document.getElementById('update-data');
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Do something with the data 
        title.id = "title";
        title.value = data.title;

        content.className = "content"
        content.value = data.content

        rating.className = "rating"
        rating.value = data.rating

        for (let i = 0; i  < data.step_descriptons.length; i++) {
            filesArray.push(data.step_descriptons[i].image)

                // Create the step descriptions input field
                const step = document.createElement("input");
                step.type = "text";
                step.className = "step";
                step.placeholder = "bước";
                step.value = data.step_descriptons[i].step;
            
                // Create the step descriptions input field
                const stepDescription = document.createElement("input");
                stepDescription.type = "text";
                stepDescription.className = "description";
                stepDescription.placeholder = "Mô tả";
                stepDescription.value=data.step_descriptons[i].description;

                // Create the img  field
                let img = document.createElement("img");
                img.className = "img-temp";
                img.src = data.step_descriptons[i].image;

                 // Create the img input field
                const changeImg = document.createElement("input");
                changeImg.type = "file";
                changeImg.className = "img";
                changeImg.name = "img";

                // Append the input fields to the new div
                newInputDiv.appendChild(step);
                newInputDiv.appendChild(stepDescription);
                newInputDiv.appendChild(img);
                newInputDiv.appendChild(changeImg);
                
                // Append the new div to the inputs container
                inputsContainer.appendChild(newInputDiv);
                
                base64imgChange();

            
        }
            // Attach the onclick event handler
            clickUpdate.addEventListener('click', function() {      
            for (let i = 0; i < stepInput.length; i++) {
                const step = stepInput[i].value;
                const description = descriptionInput[i].value;
                const img = filesArray[i];
                // console.log(img);
        
                // Create a new object using the input values
                const stepObject = {
                    step: step,
                    description: description,
                    image: img};
        
                // Add the new object to the array
            subdata.push(stepObject)
            }
        
            const dataUpdate = { title: title.value,
                    content: content.value,
                    rating: rating.value,
                    step_descriptons: subdata };

            updateData(dataUpdate,id);
      });
    });
    
}

  

async function updateData(data,id) {
    try {
        let response = await fetch(mockLink+"/"+ id , {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
        location.reload(true);
        loadDatas();
        console.log("update ok")
    } catch (err) {
    }
}

// --------------------------------------------------------------------
// RATING
function ratingChanger(id) {
  const ratingChanger = document.getElementById("ratingChanger"+id).value;
  console.log("id: "+id+" ,rating: "+ratingChanger);

  const apiUrl = mockLink+"/"+ id ;
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log("data that change rating: "+data);
    data.rating = ratingChanger;
    updateData(data,id);
  })
}

loadDatas();
base64img();
// adddata();
// updatedata();
// removeData(7);