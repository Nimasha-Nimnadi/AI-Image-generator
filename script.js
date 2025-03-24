const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".img-gallery");

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");

    //set the image src to the generated image
    const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.image}`;
    imgElement.src = aiGeneratedImg;

    //
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
    };

    const downloadBtn = imgCard.querySelector(".dwn-btn");
    downloadBtn.href = `data:image/jpeg;base64,${imgObject.image}`;
    downloadBtn.download = `image-${index + 1}.jpeg`;
  });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const UNSPLASH_ACCESS_KEY = "your-unsplash-access-key";
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer YOUR_HUGGINGFACE_API_KEY`, // Replace with your Hugging Face API key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: parseInt(userImgQuantity),
          size: "1024x1024",
          response_format: "b64_json",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate images");
    }

    const { data } = await response.json();
    updateImageCard([...data]);
  } catch (error) {
    alert("Failed to generate images");
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();
  const userPrompt = e.target[0].value; // Use e.target instead of e.srcElement for better compatibility
  const userImgQuantity = e.target[1].value;

  const imgCardMarkup = Array.from(
    { length: userImgQuantity },
    () => `
    <div class="img-card loading">
      <img src="images/loader.svg" alt="loading-img" />
      <a href="#" class="dwn-btn">
        <img src="images/download.svg" alt="download icon" />
      </a>
    </div>
  `
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
