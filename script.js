axios.get("https://dummyjson.com/recipes")
    .then(function(response){
        console.log(response)
    })

    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    
    uploadButton.addEventListener('click', () => {
      const file = fileInput.files[0];
    
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
    
        // Replace with your actual upload URL
        const uploadUrl = '/upload';
    
        fetch(uploadUrl, {
          method: 'POST',
          body: formData
        })
        .then(response => {
          // Handle the response from the server
          console.log('File uploaded successfully:', response);
        })
        .catch(error => {
          // Handle any errors
          console.error('Error uploading file:', error);
        });
      }
    });