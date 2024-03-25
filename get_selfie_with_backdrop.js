function __createOrUpdateVideo(
  context,
  contextWidth = context.getAttribute("component_width"),
  contextHeight = context.getAttribute("component_height")
) {
  const mainDivWebComponent =
    context.shadowRoot.getElementById("mainDiv_WebComp");
  mainDivWebComponent.style.width = `${
    contextWidth || context.default_width
  }px`;
  // mainDivWebComponent.style.height = `${
  //   contextHeight || context.default_height
  // }px`;

  // If Already Created then update the widht and Height
  const mainDivSelfieComp =
    context.shadowRoot.getElementById("mainDiv_SelfieComp");

  const videoDiv = mainDivSelfieComp.querySelector("#selfie-video");
  const canvasDiv = mainDivSelfieComp.querySelector("#selfie-canvas");

  if (context.__drawImage_Inteval) {
    clearInterval(context.__drawImage_Inteval);
  }

  if (!videoDiv) {
    // Create Video Tag
    const video_element = document.createElement("video");
    video_element.setAttribute("id", "selfie-video");
    video_element.setAttribute("autoplay", true);
    video_element.setAttribute("muted", true);
    video_element.setAttribute("playsinline", true);
    // video_element.style.transform = "rotateY(180deg)";
    video_element.style.position = "absolute";
    video_element.style.left = "0px";
    video_element.style.top = "0px";
    // video_element.style.visibility = "hidden";

    const loadingDiv = document.createElement("div");
    loadingDiv.setAttribute("id", "loadingMainDiv")
    loadingDiv.style.position = "absolute";
    loadingDiv.style.width = `${Number(context.default_width) + 1}px`
    loadingDiv.style.height = `${context.default_canvas_height}px`
    loadingDiv.style.background = `white`
    loadingDiv.style.display = `flex`
    loadingDiv.style.justifyContent = `center`
    loadingDiv.style.alignItems = `center`
    loadingDiv.style.boxSizing = `border-box`
    loadingDiv.style.borderLeft = `2px solid black`
    loadingDiv.style.borderRight = `2px solid black`

    
      // Crete Loading Text
      const loadingText =document.createElement('div')
      loadingText.innerText = "Loading......";
      loadingDiv.appendChild(loadingText)


    // Create Selfie Canvas Tag
    const canvas_element = document.createElement("canvas");
    canvas_element.setAttribute("id", "selfie-canvas");
    canvas_element.style.position = "absolute";
    canvas_element.style.left = "0px";
    canvas_element.style.top = "0px";
    canvas_element.style.visibility = "hidden";
    
    // Create Canvas Tag with Background and backdrop Image 
    const backdrop_canvas_element = document.createElement("canvas");
    backdrop_canvas_element.setAttribute("id", "backdrop-canvas");
    backdrop_canvas_element.style.position = "absolute";
    backdrop_canvas_element.style.left = "0px";
    backdrop_canvas_element.style.top = "0px";
    backdrop_canvas_element.style.visibility = "hidden";

    // Create Canvas Tag with Segementation Body Pix
    const bodyPix_canvas_element = document.createElement("canvas")
    bodyPix_canvas_element.setAttribute("id", "bodyPix-canvas");
    bodyPix_canvas_element.style.position = "absolute";
    bodyPix_canvas_element.style.left = "0px";
    bodyPix_canvas_element.style.top = "0px";

    // Setting Video Width and Height  & Canvas Width and Height
    video_element.width = context.default_width;
    video_element.height = context.default_canvas_height;

    canvas_element.width = context.default_width;
    canvas_element.height = context.default_canvas_height;
    
    backdrop_canvas_element.width = context.default_width;
    backdrop_canvas_element.height = context.default_canvas_height;
    
    bodyPix_canvas_element.width = context.default_width;
    bodyPix_canvas_element.height = context.default_canvas_height;


    // Append Video and Canvas
    mainDivSelfieComp.appendChild(video_element);
    mainDivSelfieComp.appendChild(loadingDiv);
    mainDivSelfieComp.appendChild(canvas_element);
    mainDivSelfieComp.appendChild(backdrop_canvas_element);
    mainDivSelfieComp.appendChild(bodyPix_canvas_element);

    // Start Camera
    // startCamera(context, video_element, canvas_element);

    // Event Listener on Playing the Video
    video_element.addEventListener("play", () => {
      const videoElement = context.shadowRoot.getElementById("selfie-video");
      const canvasElement = context.shadowRoot.getElementById("selfie-canvas");

      context.__drawImage_Inteval = setInterval(() => {
        if (context.bodyPixLoaded && context.net !== null) {
          //Checking for BodyPix has Loaded
          __drawImage(context, videoElement, canvasElement);
          clearInterval(context.__drawImage_Inteval);
          console.log("Capturing");
          console.log("BodyPix", context.bodyPixLoaded);
        }
      }, 100);
    });
  } else {
    // Setting Video and Canvas Dimensions
    videoDiv.width = `${contextWidth}`;
    videoDiv.height = `${contextHeight - context.default_capture_height}`;

    canvasDiv.width = `${contextWidth}`;
    // canvasDiv.height = `${contextHeight - context.default_capture_height}`;

    // Start Camera
    startCamera(context, videoDiv, canvasDiv);
  }
}

function __createCaptureSection(context) {
  // Section 1---- Creating Section for the Camera
  const maniDivControls = context.shadowRoot.querySelector("#mainDiv_controls");
  // Styling mainDivControls
  maniDivControls.style.height = `${context.default_capture_height}px`;
  maniDivControls.style.width = "100%";
  // maniDivControls.style.backgroundColor = "";
  maniDivControls.style.display = "flex";
  maniDivControls.style.justifyContent = "center";
  maniDivControls.style.alignItems = "center";
  maniDivControls.style.marginTop = "-4px";

  // Positioning Absolute
  maniDivControls.style.position = "absolute";
  maniDivControls.style.top = `${context.default_canvas_height}px`;

  const cameraDiv = document.createElement("div");
  cameraDiv.setAttribute("id", "cameraDiv")
  cameraDiv.style.backgroundColor = "white";
  cameraDiv.style.width = "60px";
  cameraDiv.style.height = "60px";
  cameraDiv.style.display = "flex";
  cameraDiv.style.justifyContent = "center";
  cameraDiv.style.alignItems = "center";
  cameraDiv.style.borderRadius = "50%";
  cameraDiv.style.cursor = "pointer";
  cameraDiv.style.pointerEvents = "none";
  cameraDiv.style.opacity = "0.6";


  // Image Tag
  const imageTag = document.createElement("img");
  imageTag.src = "./assets/1_1.png";
  imageTag.width = "35";
  imageTag.height = "35";
  imageTag.setAttribute("alt", "camera");

  // Appending Image Tag
  cameraDiv.appendChild(imageTag);

  // Appending Camera Div to the Main Controls Div
  maniDivControls.appendChild(cameraDiv);

  // Section 2 ---- Creating Section for the Replace Button and Next Button
  const mainDivConfirm = context.shadowRoot.querySelector(
    "#mainDiv_ConfirmSection"
  );
  mainDivConfirm.style.height = `${context.default_capture_height}px`;
  mainDivConfirm.style.width = "100%";
  mainDivConfirm.style.backgroundColor = "black";
  mainDivConfirm.style.display = "flex";
  mainDivConfirm.style.justifyContent = "center";
  mainDivConfirm.style.alignItems = "center";
  mainDivConfirm.style.display = "none"; //Hiding the Div when the photo is getting clicked
  mainDivConfirm.style.marginTop = "-4px";

  // Positioning Absolute
  mainDivConfirm.style.position = "absolute";
  mainDivConfirm.style.top = `${context.default_canvas_height}px`;

  const buttonDiv = document.createElement("div");
  buttonDiv.setAttribute("id", "buttonDiv");
  buttonDiv.style.width = "80%";
  buttonDiv.style.display = "flex";
  buttonDiv.style.justifyContent = "space-between";
  // Button  Replace
  const buttonReplace = document.createElement("button");
  buttonReplace.setAttribute("id", "replaceBtn");
  buttonReplace.innerText = "Replace";
  buttonReplace.style.border = "none";
  buttonReplace.style.background = "white";
  buttonReplace.style.padding = "10px 30px";
  buttonReplace.style.borderRadius = "20px";
  buttonReplace.style.fontWeight = "bold";

  // Button Next
  const buttonNext = document.createElement("button");
  buttonNext.setAttribute("id", "nextBtn");
  buttonNext.innerText = "Next";
  buttonNext.style.border = "none";
  buttonNext.style.background = context.mainThemeColor;
  buttonNext.style.padding = "10px 30px";
  buttonNext.style.borderRadius = "20px";
  buttonNext.style.fontWeight = "bold";

  buttonDiv.appendChild(buttonReplace);
  buttonDiv.appendChild(buttonNext);

  mainDivConfirm.appendChild(buttonDiv);

  // Adding onClick Event to the Camera Button
  cameraDiv.addEventListener("click", () => {
    clearInterval(context.__drawImage_Inteval);

    mainDivConfirm.style.display = "flex";
    maniDivControls.style.display = "none";

    // Pausing the Video
    const video_element = context.shadowRoot.querySelector("#selfie-video");
    if (video_element) {
      video_element.pause();
    }
  });

  // Adding onClick Event to the Replace Button
  buttonReplace.addEventListener("click", () => {
    const videoElement = context.shadowRoot.getElementById("selfie-video");
    const canvasElement = context.shadowRoot.getElementById("selfie-canvas");
    if (videoElement) {
      if (context.__drawImage_Inteval) {
        clearInterval(context.__drawImage_Inteval);
      }
            
      context.__drawImage_Inteval = setInterval(() => {
        if (context.bodyPixLoaded && context.net !== null) {
          //Checking for BodyPix has Loaded
          __drawImage(context, videoElement, canvasElement);
          console.log("Through Replace Button");
          clearInterval(context.__drawImage_Inteval);
        }
      }, 100);

      // Hide the Button Div and Show the Camera Click Div
      mainDivConfirm.style.display = "none";
      maniDivControls.style.display = "flex";
    }
  });

  // Adding onClick Event to the Next Button
  buttonNext.addEventListener("click", () => {
    const parentDivForm = context.shadowRoot.querySelector("#parentDiv_Form");
    const selfieDiv = context.shadowRoot.querySelector("#parentDiv_Selfie");

    // Convert Canvas into Image
    const bodypix_canvas_element = context.shadowRoot.querySelector("#bodyPix-canvas");
    context.photo_with_aayushmann.src = __canvasToImage(bodypix_canvas_element);

    // Set the Background Image to the Form Div
    parentDivForm.style.backgroundImage =
      "url('" + context.photo_with_aayushmann.src + "')";
    parentDivForm.style.backgroundRepeat = "no-repeat";
    parentDivForm.style.backgroundSize = "cover";
    // Getting the Size of the backgroung Image
    context.photo_with_aayushmann.onload = () => {
      parentDivForm.style.height = `${context.photo_with_aayushmann.naturalHeight}px`;
      parentDivForm.style.width = `${context.photo_with_aayushmann.naturalWidth}px`;
    };

    // Show the Form Section
    parentDivForm.style.display = "flex";
    selfieDiv.style.display = "none";

    // Turning of the Camera 
    const videoTag = context.shadowRoot.querySelector("#selfie-video")
    localStream.getVideoTracks()[0].stop();
    videoTag.src = "";
  });
}

function __createFormSection(context) {
  const parentDivForm = context.shadowRoot.querySelector("#parentDiv_Form");

  // Section 1

  // Creating an Image with the background
  const mainDivClickedImage = document.createElement("div");
  mainDivClickedImage.setAttribute("id", "mainDiv_ClickedImage");
  mainDivClickedImage.style.background = "#000000b3";
  mainDivClickedImage.style.width = "fit-content";
  mainDivClickedImage.style.padding = "20px 10px";
  mainDivClickedImage.style.borderRadius = "10px";
  mainDivClickedImage.style.display = "flex";
  mainDivClickedImage.style.flexDirection = "column";
  mainDivClickedImage.style.gap = "20px";
  mainDivClickedImage.style.width = "80%";
  mainDivClickedImage.style.maxWidth = "360px";
  mainDivClickedImage.style.height = "fit-content";

  // Creating a Form and Heading
  const headingfortheForm = document.createElement("div");
  headingfortheForm.innerText =
  "Fill in your details to get greetings from Ayushmann Khurrana";
  headingfortheForm.style.textAlign = "center";
  headingfortheForm.style.color = "white";
  headingfortheForm.style.fontWeight = "bold";
  headingfortheForm.style.fontFamily = "Poppins";

  // Name Input
  const nameInput = __createInputElement(
    context,
    "nameInput",
    "Name",
    "text",
    "name"
  );
  // Email Input
  const emailInput = __createInputElement(
    context,
    "emailInput",
    "Email Id",
    "email",
    "email"
  );
  // Mobile Number Input
  const phoneNumberInput = __createInputElement(
    context,
    "phoneNumberInput",
    "Mobile Number",
    "number",
    "mobile-number"
  );

  //Check Box
  const checkBoxStyling = document.createElement("style")
  checkBoxStyling.innerText=`
  .container {
    position: relative;
    top: 6px;
    left: 18px;
    margin-bottom: 12px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color:white;
  }
  
  /* Hide the browser's default checkbox */
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    width: 30px;
    background-color: ${context.mainThemeColor};
  }
  
  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  
  /* Show the checkmark when checked */
  .container input:checked ~ .checkmark:after {
    display: block;
  }
  
  /* Style the checkmark/indicator */
  .container .checkmark:after {
    left: 12px;
    top: 3px;
    width: 6px;
    height: 14px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  `

  const checkBoxDiv =document.createElement('div')
  checkBoxDiv.setAttribute("id", "checkboxDiv");

    
  const checkBoxLabel = document.createElement('label')
  checkBoxLabel.setAttribute("class", "container")
  checkBoxLabel.innerHTML = `<input type="checkbox" checked="true" name='tnc' id='tncCheckBox'>
  <span class="checkmark"></span>`;

  const spanlabel  = document.createElement("span")
  spanlabel.innerText = "I want to receive offers and promotions from Godrej";
  spanlabel.setAttribute("style", "position: relative; left:68px; width:206px; font-weight: bold; color: white; display:block")

  checkBoxDiv.appendChild(checkBoxLabel)
  checkBoxDiv.appendChild(spanlabel)


  //Error Text
  const errorDiv = document.createElement("div");
  errorDiv.style.color = "red";
  errorDiv.style.fontWeight = "bold";
  errorDiv.style.fontSize = "14px";
  errorDiv.style.textAlign = "center";
  errorDiv.style.width = "230px";
  errorDiv.style.margin = "auto";

  // Submit Button Input
  const buttonDivSubmit = document.createElement("div");
  buttonDivSubmit.style.textAlign = "center";
  const submitButton = document.createElement("button");
  submitButton.setAttribute("id", "submitButton");
  submitButton.innerText = "Submit";
  submitButton.style.border = "none";
  submitButton.style.background = context.mainThemeColor;
  submitButton.style.padding = "10px 30px";
  submitButton.style.borderRadius = "20px";
  submitButton.style.fontWeight = "bold";
  buttonDivSubmit.appendChild(submitButton);

  // Appending all the Input fields to the MainDivClickedImage
  mainDivClickedImage.appendChild(headingfortheForm); //Append the Heading
  mainDivClickedImage.appendChild(nameInput);
  mainDivClickedImage.appendChild(emailInput);
  mainDivClickedImage.appendChild(phoneNumberInput);
  mainDivClickedImage.appendChild(checkBoxStyling);
  mainDivClickedImage.appendChild(checkBoxDiv);
  mainDivClickedImage.appendChild(errorDiv);
  mainDivClickedImage.appendChild(buttonDivSubmit);

  parentDivForm.appendChild(mainDivClickedImage);

  // Style Input Element
  __styleInput(mainDivClickedImage);

  //Submit Button Form
  submitButton.addEventListener("click", () => {
    const allInputElement = context.shadowRoot.querySelectorAll(
      "#mainDiv_ClickedImage input"
    );

    let isValid = true;
    allInputElement.forEach((input) => {
      const name = input.name;
      const value = input.value;

      if (!value) {
        isValid = false;
        errorDiv.style.display = "block";
        errorDiv.innerText = "Name, Email and Mobile Number are mandatory";

        return;
      }
      if (name == "email" && !value.includes("@")) {
        isValid = false;
        errorDiv.style.display = "block";
        errorDiv.innerText = "Invalid Email ID";
        return;
      }
      if (name === "mobile-number" && value.length !== 10) {
        isValid = false;
        errorDiv.style.display = "block";
        errorDiv.innerText = "Mobile Number should be of 10 Digits";
        return;
      }
    });

    if (isValid) {
      errorDiv.style.display = "none";
      // console.log("Submittesd");

      let payload = {};

      allInputElement.forEach((input) => {
        if (input.name === "name") {
          payload["name"] = input.value;
        } else if (input.name === "email") {
          payload["email"] = input.value;
        } else if(input.name === "mobile-number"){
          payload["mobile"] = input.value;
        }else{
          payload["tnc"] = input.checked;
        }
      });

      payload.image = context.photo_with_aayushmann.src;
      // Passing UTM Values

      const params =  new URLSearchParams(window.location.search);
      const paramsObj = Array.from(params.keys()).reduce(
        (acc, val) => ({ ...acc, [val]: params.get(val) }),
        {}
      );

      for(let key in paramsObj){
        payload[key]  = paramsObj[key]
      }

      // console.log(payload);

      // Button is Disabled
      const button = context.shadowRoot.querySelector("#mainDiv_ClickedImage button");
      button.innerText = "Submitting...."
      button.style.disabled = true
      button.style.opacity = 0.7
      
      fetch(`${context.api_hostName}${context.api_endPoint}`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Accept: "application/json",
        },
      })
      .then(res=> res.json())
        .then((data) => {
          if (data?.message === "Submission created successfully") {
            gwd?.actions?.gwdGoogleAd?.goToPage("gwd-ad", "expanded-page_3");

            const submissions = data?.submission

            window.TrackierWebSDK.trackConv('lyxel35.gotrackier.com', '6541fe5d89d82d4d1b48db80', {"is_camp":true,"sub1": submissions?.email,"sub2": submissions?.name,"sub3": submissions?.mobile, "sub4": `${submissions?.id}`,"is_iframe":true});

          } else {
            errorDiv.style.display = "block";
            errorDiv.innerText = data?.message;
          }
          button.innerText = "Submit"
          button.style.disabled = false
          button.style.opacity = 1
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

async function startCamera(context, videoDiv, canvasDiv) {
  try {
    var constraints = {
      audio: false,
      video: {
        facingMode: "user",
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function success(stream) {
        videoDiv.srcObject = stream;
        window.localStream = stream;
      });
  } catch (err) {
    console.log("Error in accessing the camera ", err);
  }
}

function __drawImage(context, videoElement, canvasElement) {
  videoElement.play();
  const backdropCanvas = context.shadowRoot.getElementById("backdrop-canvas");
  const backdropCtx = backdropCanvas.getContext("2d", {willReadFrequently: true})
  const bodyPixCanvas = context.shadowRoot.getElementById("bodyPix-canvas");
  const bodyPixCtx = bodyPixCanvas.getContext("2d", {willReadFrequently: true})
  const ctx = canvasElement.getContext("2d",{ willReadFrequently: true });
  const video_width = videoElement.width;
  const video_height = videoElement.height;

  // Enabling Camera Buttons
  const cameraDiv = context.shadowRoot.getElementById('cameraDiv')
  cameraDiv.style.opacity = "1"
  cameraDiv.style.pointerEvents = "auto"


  const segmentFrame = async () => {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    //   Fliping Video Element
    // ctx.translate(video_width, 0);
    // ctx.scale(-1, 1);
    ctx.drawImage(videoElement, 0, 0, video_width, video_height);
    // Getting the Data of Video with pixel
    const videoPixels = ctx.getImageData(0, 0, video_width, video_height);

    // console.log(videoPixels);
    
    // ctx.translate(video_width, 0);
    // ctx.scale(-1, 1);


    //   Fliping Aayushmann
    // ctx.drawImage(context.aayushmann_Image, 0, 0);

    const segmentation = await context.net.segmentPerson(videoElement);

    // Create an image with a transparent background
    const faceImage = new ImageData(segmentation.width, segmentation.height);

    // Create Background Image
    const backgroundImage = new ImageData(
      segmentation.width,
      segmentation.height
    );

    for (let i = 0; i < segmentation.data.length; i++) {
      //The data array stores four values for each pixel
      const [r, g, b, a] = [
        videoPixels.data[i * 4],
        videoPixels.data[i * 4 + 1],
        videoPixels.data[i * 4 + 2],
        videoPixels.data[i * 4 + 3],
      ];

      if (segmentation.data[i]) {
        // Face Image Data
        faceImage.data[i * 4] = r;
        faceImage.data[i * 4 + 1] = g;
        faceImage.data[i * 4 + 2] = b;
        faceImage.data[i * 4 + 3] = a;

        // Background Image Data is Set to white
        backgroundImage.data[i * 4] = 0;
        backgroundImage.data[i * 4 + 1] = 0;
        backgroundImage.data[i * 4 + 2] = 0;
        backgroundImage.data[i * 4 + 3] = 1;
      } else {
        // Face Image Data is Set to white
        faceImage.data[i * 4] = 0;
        faceImage.data[i * 4 + 1] = 0;
        faceImage.data[i * 4 + 2] = 0;
        faceImage.data[i * 4 + 3] = 0;

        // Background Image Data
        backgroundImage.data[i * 4] = r;
        backgroundImage.data[i * 4 + 1] = g;
        backgroundImage.data[i * 4 + 2] = b;
        backgroundImage.data[i * 4 + 3] = a;
      }
    }


    flipImageDataHorizontally(backgroundImage);
    flipImageDataHorizontally(faceImage);

    backdropCtx.putImageData(backgroundImage, 0,0)
    backdropCtx.drawImage(context.aayushmann_Image,0,0)

    const backdropImageData =  backdropCtx.getImageData(0,0, context.default_width, context.default_canvas_height)

    // Testing
    // backdropCtx.drawImage(context.natureImage, 0, 0)
    // const backdropImageData =  backdropCtx.getImageData(0,0, context.default_width, context.default_canvas_height)
    // Testing

    
    // Mergin Two Image Here
    const newImageData = new ImageData(segmentation.width, segmentation.height)
    for (let i = 0; i < segmentation.data.length; i++){
      const [r, g, b, a] = [
        faceImage.data[i * 4],
        faceImage.data[i * 4 + 1],
        faceImage.data[i * 4 + 2],
        faceImage.data[i * 4 + 3],
      ];

      if(r===0 && g===0 && b===0 && a===0){  
        // console.log("White Space")
        const [r1, g1, b1, a1] = [
          backdropImageData.data[i * 4],
          backdropImageData.data[i * 4 + 1],
          backdropImageData.data[i * 4 + 2],
          backdropImageData.data[i * 4 + 3],
        ];
        newImageData.data[i * 4] = r1;
        newImageData.data[i * 4 + 1] = g1;
        newImageData.data[i * 4 + 2] = b1;
        newImageData.data[i * 4 + 3] = a1;
      }
      else{

        newImageData.data[i * 4] = r;
        newImageData.data[i * 4 + 1] = g;
        newImageData.data[i * 4 + 2] = b;
        newImageData.data[i * 4 + 3] = a;
      }
    }

    bodyPixCtx.putImageData(newImageData, 0, 0)

    requestAnimationFrame(segmentFrame);
  };

  segmentFrame();

  function flipImageDataHorizontally(imageData) {
    var width = imageData.width;
    var height = imageData.height;

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width / 2; x++) {
        // Get the current pixel and its corresponding pixel on the other side
        var pixelIndex = (y * width + x) * 4;
        var oppositePixelIndex = (y * width + (width - x - 1)) * 4;

        // Swap the pixel data (RGBA values)
        for (var i = 0; i < 4; i++) {
          var temp = imageData.data[pixelIndex + i];
          imageData.data[pixelIndex + i] = imageData.data[oppositePixelIndex + i];
          imageData.data[oppositePixelIndex + i] = temp;
        }
      }
    }
  }

  //   console.log(videoElementImageData);
}

function __canvasToImage(canvasElement) {
  return canvasElement.toDataURL();
}

function __styleInput(mainParentDivInput) {
  mainParentDivInput.querySelectorAll("input").forEach((input) => {
    if(input.type !== "checkbox"){
      input.style.backgroundColor = "white";
      input.style.padding = "10px";
      input.style.border = "none";
      input.style.borderRadius = "5px";
      input.style.fontWeight = "bold";
      input.style.fontFamily = "Poppins";
      input.style.width = "230px";
    }
  });
}

function __createInputElement(context, id, placeholder, type, name) {
  const div = document.createElement("div");
  div.style.textAlign = "center";

  const Input = document.createElement("input");
  Input.setAttribute("id", `${type}Input`);
  Input.setAttribute("name", name);
  Input.type = type;
  Input.setAttribute("placeholder", placeholder);

  div.appendChild(Input);

  return div;
}

async function loadBodyPix(context) {
  context.net = await bodyPix.load(context.netOptions);
}

class GetSelfieWithBackdrop extends HTMLElement {
  constructor() {
    super();
    this.context = this;
    this.mainThemeColor = "#f1cc00";
    this.default_width = "355";
    this.default_height = window.innerHeight;
    this.default_canvas_height = "500";
    this.default_capture_height = "84";
    this.__drawImage_Inteval = null;
    this.aayushmann_Image = new Image();
    this.photo_with_aayushmann = new Image();
    this.api_hostName = "https://ayushmannbhavaforever.ekaleido.co/";
    this.api_endPoint = "api/submissions";
    this.aayushmann_Image.src = "./assets/2_1.png";
    // BodyPix Parameters
    this.netOptions = {
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2,
      internalResolution:"full"
    };
    this.net = null;
    this.bodyPixLoaded = false;
    //BodyPix Parameter
    this.selfieWithBackdrop = new Image();

    // Testing
    // this.natureImage = new Image()
    // this.natureImage.src = "./assets/nature.jpg"
    // Testing


    const shadowRoot = this.attachShadow({ mode: "open" });

    const mainDiv = document.createElement("main");
    mainDiv.setAttribute("id", "mainDiv_WebComp");
    mainDiv.style.width = "fit-content";
    mainDiv.style.position = "absolute";
    mainDiv.style.left = "50%";
    mainDiv.style.top = "10%";
    mainDiv.style.marginLeft = `-${this.default_width / 2}px`;
    // mainDiv.style.marginTop = `-${this.default_canvas_height/2}px`

    // Page 1------
    const parentDivSelfie = document.createElement("div");
    parentDivSelfie.setAttribute("id", "parentDiv_Selfie");
    // parentDivSelfie.style.width = "fit-content";

    // Webcam Component
    const mainDivSelfieComp = document.createElement("div");
    mainDivSelfieComp.setAttribute("id", "mainDiv_SelfieComp");
    mainDivSelfieComp.style.width = "fit-content";
    mainDivSelfieComp.style.position = "relative";

    // Controls Component
    const controlsDiv = document.createElement("div");
    controlsDiv.setAttribute("id", "mainDiv_controls");

    // Replace and Next Button
    const confirmSectionDiv = document.createElement("div");
    confirmSectionDiv.setAttribute("id", "mainDiv_ConfirmSection");

    // Appending to ParentSelfie Div
    parentDivSelfie.appendChild(mainDivSelfieComp);
    parentDivSelfie.appendChild(controlsDiv);
    parentDivSelfie.appendChild(confirmSectionDiv);

    // Page 2----
    const parentDivForm = document.createElement("div");
    parentDivForm.setAttribute("id", "parentDiv_Form");
    parentDivForm.style.width = "100%";
    parentDivForm.style.height = "100%";
    parentDivForm.style.display = "none";
    parentDivForm.style.justifyContent = "center";
    parentDivForm.style.alignItems = "center";

    // Appending to the Main DIv
    mainDiv.appendChild(parentDivSelfie);
    mainDiv.appendChild(parentDivForm);

    shadowRoot.appendChild(mainDiv);

    // Create a Video Tag and Canvas
    __createOrUpdateVideo(this);
    // Creating Capture Section
    __createCaptureSection(this);

    // Create a Form Section
    __createFormSection(this);
  }

  connectedCallback() {
    loadBodyPix(this).then(() => {
      this.bodyPixLoaded = true;
    });
  }

  // Define Allowed Attributes
  static get observedAttributes() {
    return ["start_camera"];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === "start_camera" && newVal === "true") {
      const videoElement = this.shadowRoot.querySelector(
        "#mainDiv_SelfieComp video"
      );
      const canvasElement = this.shadowRoot.querySelector(
        "#mainDiv_SelfieComp canvas"
      );

      startCamera(this, videoElement, canvasElement);
    }
  }
}

customElements.define("selfie-with-backdrop", GetSelfieWithBackdrop);
