
//Fetches list of all news along with their Title, image and description and sends data to add into DOM.
async function init(){
    //creating an element to add accordion into DOM
    let accordionDisplayElement = document.getElementById("accordion-display");
    accordionDisplayElement.innerHTML = `
                                        <div class="accordion" id="news-accordion">
                                        </div>
                                      `
  let accordionElement = document.getElementById("news-accordion");
    
  for(let index=0; index<magazines.length; index++){
        let newsTopicDataObject = await fetchNews(magazines[index]);
        addAccordionToDOM(newsTopicDataObject,index,accordionElement);
    }

    // hide next/previous carousel button when first and last news topic is shown.
    carouselButtonControl();
    //control the sliding nature of carousel.
    carouselSlideControl();
}

//Implementation of fetch call.
// Fetches the news  using the RSS feed, by converting RSS feed into JSON and return the data.
async function fetchNews(url){
    try{
        let rssResponse = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${url}`);
        let newsData = await rssResponse.json();
        return newsData;
    }catch(error){
        console.log(error);
        return null;
    }
}
//Implementation of DOM manipulation to add news accordions topic wise.
function addAccordionToDOM(newsTopicData,index,accordionElement){
  
    accordionElement.innerHTML += `
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="heading${index+1}">
                                        <button class="accordion-button ${index===0?"":"collapsed"}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index+1}" aria-expanded="${index==0?"true":"false"}" aria-controls="collapse${index+1}">
                                            <h5 class="accordion-header1">${newsTopicData.feed.title}</h5>
                                        </button>
                                    </h2>
                                    <div id="collapse${index+1}" class="accordion-collapse collapse ${index==0?"show":""}" aria-labelledby="heading${index+1}" data-bs-parent="#news-accordion">
                                        <div class="accordion-body" id="accordion-body-${index+1}">
                                        </div>
                                    </div>
                                </div>`
    let accordionBodyId = `accordion-body-${index+1}`;
    addCarouselToAccordion(newsTopicData.items,accordionBodyId,index)
}

//Implementation of DOM manipulation to add carousel inside accordion to show news related to topic.
function addCarouselToAccordion(newsItems,accordionBodyId,index){
//Addition of carousel inside accordion
    let accordionBodyElement = document.getElementById(accordionBodyId);
    accordionBodyElement.innerHTML = `
                                        <div id="news-carousel${index+1}" class="carousel carousel-dark slide" data-bs-ride="carousel">
                                            <div class="carousel-inner" id="carouselInner${index+1}">
                                            </div>
                                            <button class="carousel-control-prev visually-hidden" id="carousel-prev-button${index+1}" type="button" data-bs-target="#news-carousel${index+1}" data-bs-slide="prev">
                                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Previous</span>
                                            </button>
                                            <button class="carousel-control-next" id="carousel-next-button${index+1}" type="button" data-bs-target="#news-carousel${index+1}" data-bs-slide="next">
                                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Next</span>
                                            </button>
                                        </div>
                                `
  let carouselInnderId = `carouselInner${index+1}`;
    populateCarousel(newsItems,carouselInnderId);
}
                             
//Populating the carousel with the news link, images, title, and description of related topic.
function populateCarousel(newsItems,carouselInnderId){
    let carouselInnerElement = document.getElementById(carouselInnderId)
    newsItems.forEach((news,index)=>{
        let date = new Date(news.pubDate);
        let publishDate = date.toLocaleDateString("en-IN")
        carouselInnerElement.innerHTML += `
                                            <div class="carousel-item ${index==0?"active":""}" id="carousel-item${index+1}">
                                                <a href="${news.link}" style="text-decoration:none" target="_blank">
                                                <div class="card d-block w-100">
                                                    <img src="${(news.enclosure.link==null ||news.enclosure.link==undefined || news.enclosure.link=="")?"https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377__340.png":news.enclosure.link }" onerror="this.src='https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377__340.png'" class="card-img-top w-100" alt="${news.title}">
                                                    <div class="card-body">
                                                        <h3 class="card-title mb-0">${news.title}</h5>
                                                        <div class="author d-flex mb-2">
                                                            <div>${news.author}</div>
                                                            <div class="mx-3">&#8226;</div>
                                                            <div>${publishDate}</div>
                                                        </div>
                                                        <p class="card-text">${news.description}</p>
                                                    </div>
                                                    </div> 
                                                </a>   
                                            </div>
                                        `
                
    })
    
    
}
//Implementation of DOM manipulation to hide the carousel button next/previous button when first and last news appears.
function carouselButtonControl(){

    magazines.forEach((element,index)=>{
        let targetCarousel = document.getElementById(`news-carousel${index+1}`);

        let carouselPreviousButton = document.getElementById(`carousel-prev-button${index+1}`);
        let carouselNextButton = document.getElementById(`carousel-next-button${index+1}`);

        let firstCarouselItem = document.querySelector(`#carouselInner${index+1} > .carousel-item:first-child`);
        let lastCarouselItem = document.querySelector(`#carouselInner${index+1} > .carousel-item:last-child`);
        hideControl();
        targetCarousel.addEventListener('slid.bs.carousel', function () {
            hideControl();
          });
    
          targetCarousel.addEventListener('slide.bs.carousel', function () {
            showControl();
          });
    
        function hideControl(){
         if(firstCarouselItem.classList.contains("active")){
            carouselPreviousButton.classList.add("visually-hidden");

         }
         if(lastCarouselItem.classList.contains("active")){
            carouselNextButton.classList.add("visually-hidden");
         }
        }
    
        function showControl(){
            if(firstCarouselItem.classList.contains("active")){
                carouselPreviousButton.classList.remove("visually-hidden");
               
             }
             if(lastCarouselItem.classList.contains("active")){
                carouselNextButton.classList.remove("visually-hidden");
             }
        }

    })
  
}
// To control the sliding nature of carousel.
function carouselSlideControl(){
    magazines.forEach((element,index)=>{
        let targetSlideCarousel = document.getElementById(`news-carousel${index+1}`);
        let newsCarouselSlideControl = new bootstrap.Carousel(targetSlideCarousel)
        newsCarouselSlideControl.cycle();
    });
}
init();