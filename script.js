// this is just to set up click activation
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#navbar ul');
console.log(menuToggle);

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});


function uploadAndIdentifyPlantID() {
  // Retrieve the photo from the frontend
  const photoInput = document.getElementByID('photoInput');

  // If the user does not submit a photo, prompts submission
  if(photoInput.files.length=== 0){
    alert("Please select a photo to upload.");
    return;
  }

  // Selects the first files from the files array of an input element
  const selectedFile = photoInput.files[0];

  // Creates a new file reader object so we can read contents of the file
  const reader = new FileReader ();

  // Sets up the event handler for the onload for the file reader Object
  // The onload event is triggered when the readaing operation of the file is completed
  reader.onload = function (e) {

    // Stores the base64image in a variable
    const base64Image = e.target.result;
    console.log('base64Image',base64Image);

    //Stores all the variables for the API call
    const apiKey = 'NYZL2VNVCGUcfYrpqrDaZRNUCHunRXHUTUqKzx8vSU4Z8jKQHB';
    const latitude = 49.207;
    const longitude = 16.608;
    const health = 'all';
    const similarImages = 'true';
    const details = 'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods,treatment,cause';
    const language = 'en';
    const apiUrlPlantID = `https://plant.id/api/v3/identification?details=${details}&language=${language}`;

    // Makes the first API call with the base64 image
    axios.post(apiUrlPlantID,{
      "images": [base64Image],
      "latitude": latitude,
      "longitude": longitude,
      "health": health,
      "similar_images": similarImages
    },{
      headers: {
        "Api-Key": apiKey,
        "Content-Type": "application/json"
      }
    })
    //succesful state of promise
    .then(function (response){
      console.log('Response from Plant ID API',response.data);
      displayPlantIDInfo(response.data,base64Image);
    })
    //error state of promise
    .catch(function (response){
      alert(`Error: ${error}❌❌❌`);
      console.error('Error',error);
    });
  };

//Read the selected file as a data URL which is a base64 image encoded representation of the file's content
reader.readAsDataUrl(selectedFile);
}

function displayPlantIDInfo(plantIdResponse,base64Image){
  // ======================================
  // VARIABLE TO STORE THE FIRST SUGGESTION
  // ======================================
  const plantIdClassification = plantIdResponse.result.classification;
  const plantIdDisease = plantIdResponse.result.disease;
  const plantIdIsHealthy = plantIdResponse.result.is_healthy;
  const plantIdIsPlant = plantIdResponse.result.is_plant;

  // ======================================
  // PLAN PREVIEW IMAGE
  // ======================================
  //Grab the preview image element from the front plantidentifier.html
  const previewImage = document.getElementById('previewImage');
  //Set the image HTML src attribute to the preivew image we uploaded on the plantidentifier.html
  previewImage.src = base64Image

  // ======================================
  // PLANT NAME 
  // ======================================
  //Grab the HTML for the plant title container
  const plantNameContainer = document.getElementById('plant-name-container');
  //Create a new <p> tag element for the plant title
  const plantNameElement = document.createElement('p');
  //Add the name of the plan to the inner HTML of the <p> tag we created
  plantNameElement.innerHTML = `<strong>Name:</strong> ${plantIdClassificiation.suggestions[0].name}`;
  //Append the new div we created to the API result container that we grabbed from our html
  plantNameContainer.appendChild(plantNameElement);

  // ======================================
  // SIMILAR IMAGE 
  // ======================================
  //Grab the similar image from the API Response
  const plantSimilarImage = plantIdClassification.suggestions[0].similar_images[0].url;
  //Grab the HTML where the image will be placed
  const similarImageHTML = document.getElementById('plant-similar');
  //Set the image HTML src attribute to the image
  similarImageHTML.src = plantSimilarImage;

  // ======================================
  // PROBABILITY  
  // ======================================
  //Grab the probability score from the API response
  const probabilityOfPlant = plantIdClassification.suggestions[0].probability;
  //Grab the HTML where the probability is going to be placed
  const probabilityNameContainer = document.getElementById('probability-container');
  //Create a new <p> tag element for the probability text
  const probabilityNameElement = document.createElement('p');
  //Add the probability text to the inner HTML of the new <p> tag
  probabilityNameElement.innerHTML = `<strong>Probability:</strong> ${probabilityOfPlant}`;
  //Append the new div we created to the probability name container that we grabbed from our html
  probabilityNameContainer.appendChild(probabilityNameElement);

  // ======================================
  // IS PLANT
  // ======================================
  //Grab the 'is plant' boolean value from API response
  const isPlant = plantIdIsPlant.binary;
  //Grab the HTML where the plant boolean will be placed
  const isPlantContainer = document.getElementById('isPlant-container');
  //Create a new <p> tag element for the 'is plant' boolean
  const isPlantElement = document.createElement('p');
  //Check if the uploaded image is a plant; if not, alert the user
  if (isPlant===false){
    alert('The picture you submitted is not a plant. ❌❌❌ Please try again');
    //reload the page
    window.location.reload();
  }
  //Add the 'is plant' boolean text to the inner HTML of the new <p> tag
  isPlantElement.innerHTML = `<strong>Is Plant:</strong> ${isPlant}`;
  //Append the new div we created to the isPlant container that we grabbed from our html
  isPlantContainer.appendChild(isPlantElement);

  // ======================================
  // COMMON NAME
  // ======================================
  //Grab the first common name from the API Response
  const commonName = plantIdClassification.suggestions[0].details.common_names[0];
  //Grab the HTML where the common name will be placed
  const commonNameContainer = documnent.getElementById('common-name-container');
  //Create a new <p> tag element for the common name text
  const commonNameElement = document.createElement('p');
  //Add the common name text to the inner HTML of the new <p> tag
  commonNameElement.innerHTML = `<strong>Common Name:</strong> ${commonName}`;
  //Append the new div we created to the commonName container that we grabbed from our html
  commonNameContainer.appendChild(commonNameElement);

  // ======================================
  // DESCRIPTION
  // ======================================
  //Grab the description value from the API response
  const plantDescription = plantIdClassification.suggestions[0].details.description.value;
  //Grab container from frontend
  const descriptionContainer = document.getElementById('description-container');
  //Create a new <p> tag for the description text
  const descriptionElement = document.createElement('p');
  //Add the description text to the inner HTML of the new <p> tag
  descriptionElement.innerHTML = `<strong>Description:</strong> ${plantDescription}`;
  //Append the new div we created to the description container that we grabbed from our HTML
  descriptionContainer.appendChild(descriptionElement);

  // ======================================
  // PLANT HEALTH STATUS
  // ======================================
  //Grab the health status value from the API response
  const plantHealthStatus = plantIdIsHealthy.binary;
  //Grab container from frontend
  const plantHealthStatusContainer = document.getElementById('plant-health-status-container');
  //Create a new <p> tag for the health status text
  const plantHealthStatusElement = document.createElement('p');
  //Add the plant health status to the inner HTML of the new <p> tag
  plantHealthStatusElement.innerHTML = `<strong>Is Plant Healthy:</strong> ${plantHealthStatus}`;
  //Append the new div we created to the plant health status container that we grabbed from our HTML
  plantHealthStatusContainer.appendChild(plantHealthStatusElement);

  // ======================================
  // SIMILAR IMAGE WITH DISEASE
  // ======================================
  //Grab the similar image from API response
  const plantSimilarImageWithDisease = plantIdDisease.suggestions[0].similar_images[0].url;
  //Grab the html where image will be placed
  const similarImageWithDiseaseHTML = document.getElementById('plant-similar-image-with-disease');
  //Set the image HTML src attribute to the img
  similarImageWithDiseaseHTML.src = plantSimilarImageWithDisease;

  // ======================================
  // DISEASE NAME
  // ======================================
  //Grab the value from the API response
  const plantDiseaseName = plantIdDisease.suggestions[0].name;
  //Grab container from frontend
  const plantDiseaseNameContainer = document.getElementById('plant-disease-name-container');
  //Create a new <p> tag for the text
  const plantDiseaseNameElement = document.createElement('p');
  //Add the text to the inner HTML of the new <p> tag
  plantDiseaseNameElement.innerHTML = `<strong>Disease:</strong> ${plantDiseaseName}`;
  //Append the new div we created to the container that we grabbed from our HTML
  plantDiseaseNameContainer.appendChild(plantDiseaseNameElement);

  // ======================================
  // DISEASE PROBABILITY 
  // ======================================
  //Grab the value from the API response
  const plantDiseaseProbability = plantIdDisease.suggestions[0].probability;
  //Grab container from frontend
  const plantDiseaseProbabilityContainer = document.getElementById('plant-disease-probability');
  //Create a new <p> tag for the text
  const plantDiseaseProbabilityElement = document.createElement('p');
  //Add the text to the inner HTML of the new <p> tag
  plantDiseaseProbabilityElement.innerHTML = `<strong>Disease Probability:</strong> ${plantDiseaseProbability}`;
  //Append the new div we created to the container that we grabbed from our HTML
  plantDiseaseProbabilityContainer.appendChild(plantDiseaseProbabilityElement);

  // ======================================
  // DISEASE TREATMENT 
  // ======================================
  //Grab the value from the API response
  const plantDiseaseTreatment = plantIdDisease.suggestions[0].details.treatment;
  //Grab container from frontend
  const plantDiseaseTreatmentContainer = document.getElementById('plant-disease-treatment');
  //Create a new <p> tag for the text
  const plantDiseaseTreatmentElement = document.createElement('p');

  // Do a check: if the plant is dead and the object is empty, we let the user know that there is no treatment available for dead plants
  if (Object.keys(plantDiseaseTreatment).length === 0) {
    // Add text to the inner HTML of the new <p> tag we created
    plantDiseaseTreatmentElement.innerHTML = `<strong>Disease Treatment:</strong> No Treatment Available`;
    //Append the new div we created to the container that we grabbed from our HTML
    plantDiseaseTreatmentContainer.appendChild(plantDiseaseTreatmentElement);
  }

  // Loop the object and map keys to values
  // Then attach them to the HTML container
  for (const key in plantDiseaseTreatment) {
    // if the object has a key value pair
    if (plantDiseaseTreatment.hasOwnProperty(key)) {
      //create a variable and the store the value of each key on each iteration
      const plantDiseaseTreatmentValues = plantDiseaseTreatment[key].map(value => `<li>${value}</li>`).join('');
      //create a variable that matches the key with the values and wrap them in HTML
      const plantDiseaseTreatmentText = `<strong>Disease Treatment ${key}:</strong> <ul>${plantDiseaseTreatmentValues}</ul>`;
      //append the text of the key value pairs into the HTML container
      plantDiseaseTreatmentContainer.innerHTML += plantDiseaseTreatmentText;
    }
  }
  
}






























// axios.get("https://dummyjson.com/recipes")
//     .then(function(response){
//         console.log(response)
//     })

//     const fileInput = document.getElementById('fileInput');
//     const uploadButton = document.getElementById('uploadButton');
    
//     uploadButton.addEventListener('click', () => {
//       const file = fileInput.files[0];
    
//       if (file) {
//         const formData = new FormData();
//         formData.append('file', file);
    
//         // Replace with your actual upload URL
//         const uploadUrl = '/upload';
    
//         fetch(uploadUrl, {
//           method: 'POST',
//           body: formData
//         })
//         .then(response => {
//           // Handle the response from the server
//           console.log('File uploaded successfully:', response);
//         })
//         .catch(error => {
//           // Handle any errors
//           console.error('Error uploading file:', error);
//         });
//       }
//     });