// Data for each step (Image, Heading, Description)
const steps = [
    {
        image: "https://dummyimage.com/720x600/ff7a7a/333333", // Image for Step 1
        heading: "Step 1: Get Started",
        description: "Begin your journey with a clear vision and the right tools. It's the first step towards success."
    },
    {
        image: "https://dummyimage.com/720x600/7a7aff/333333", // Image for Step 2
        heading: "Step 2: Take Action",
        description: "Put your plan into motion and take meaningful steps toward your goal."
    },
    {
        image: "https://dummyimage.com/720x600/7aff7a/333333", // Image for Step 3
        heading: "Step 3: Overcome Challenges",
        description: "Challenges will come, but stay focused, and you'll push through with success."
    },
    {
        image: "https://dummyimage.com/720x600/ff7aff/333333", // Image for Step 4
        heading: "Step 4: Achieve Your Goal",
        description: "You've done it! Celebrate your success and enjoy the fruits of your labor."
    }
];

// Function to change the content based on the step clicked
function changeContent(stepIndex) {
    // Update the content dynamically for heading, description, and image
    document.getElementById("step-image").src = steps[stepIndex].image;
    document.getElementById("step-heading").innerText = steps[stepIndex].heading;
    document.getElementById("step-description").innerText = steps[stepIndex].description;

    // Remove 'active' class from all steps
    const allSteps = document.querySelectorAll("a");
    allSteps.forEach(step => step.classList.remove("bg-gray-100", "border-indigo-500", "text-indigo-500"));
    
    // Add 'active' class to the clicked step
    const activeStep = document.getElementById(`step-${stepIndex + 1}`);
    activeStep.classList.add("bg-gray-100", "border-indigo-500", "text-indigo-500");
}

window.onload = function() {
    changeContent(0);  // Set the default content to Step 1 on page load
};

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('carousel-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const paginationDots = document.querySelectorAll('#pagination-dots button');
    
    let currentIndex = 0;
    const cards = Array.from(carousel.children);
    const cardWidth = cards[0].offsetWidth;
    const totalCards = cards.length;
    
    // Touch handling variables
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isDragging = false;
    let startTranslateX = 0;
    let currentTranslateX = 0;
    
    // Create copies of all cards for smooth infinite scroll
    const cardsToShow = getCardsToShow();
    const cardsToAdd = cardsToShow + 1;
    
    // Add copies to the end
    for(let i = 0; i < cardsToAdd; i++) {
        const clone = cards[i].cloneNode(true);
        carousel.appendChild(clone);
    }
    
    // Add copies to the beginning (in reverse order)
    for(let i = 0; i < cardsToAdd; i++) {
        const clone = cards[totalCards - 1 - i].cloneNode(true);
        carousel.insertBefore(clone, carousel.firstChild);
    }
    
    // Set initial position
    updateCarousel(false);
    updateCardStyles();
    
    function getCardsToShow() {
        if (window.innerWidth >= 1024) return 3; // lg breakpoint
        if (window.innerWidth >= 768) return 2;  // md breakpoint
        return 1; // mobile
    }
    
    function updatePaginationDots() {
        paginationDots.forEach((dot, index) => {
            dot.classList.toggle('bg-gray-400', index === currentIndex);
            dot.classList.toggle('bg-gray-300', index !== currentIndex);
        });
    }
    
    function updateCardStyles() {
        const allCards = carousel.children;
        const centerIndex = currentIndex + cardsToAdd;
        
        Array.from(allCards).forEach((card, index) => {
            const cardInner = card.firstElementChild;
            const title = cardInner.querySelector('h3');
            const description = cardInner.querySelector('p');
            
            if (index === centerIndex) {
                cardInner.style.transform = 'scale(1)';
                cardInner.style.opacity = '1';
                cardInner.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.15)';
                card.style.zIndex = '20';
                
                title.style.color = '#059669';
                title.style.fontWeight = '700';
                title.style.textShadow = '0 0 1px rgba(16, 185, 129, 0.2)';
                description.style.color = '#065f46';
                description.style.fontWeight = '500';
            } else {
                cardInner.style.transform = 'scale(0.9)';
                cardInner.style.opacity = '0.6';
                cardInner.style.boxShadow = 'none';
                card.style.zIndex = '10';
                
                title.style.color = '';
                title.style.fontWeight = '';
                title.style.textShadow = 'none';
                description.style.color = '';
                description.style.fontWeight = '';
            }
        });
    }
    
    function updateCarousel(animate = true) {
        // Calculate the offset to center the current card
        const containerWidth = carousel.parentElement.offsetWidth;
        const cardWidthWithPadding = cardWidth; // Adding padding (2 * 16px)
        const centerOffset = (containerWidth - cardWidthWithPadding) / 2;
        const offset = -(currentIndex + cardsToAdd) * cardWidthWithPadding + centerOffset;
        
        carousel.style.transition = animate ? 'transform 0.3s ease-in-out' : 'none';
        carousel.style.transform = `translateX(${offset}px)`;
        updateCardStyles();
    }
    
    function handleTransitionEnd() {
        if (currentIndex >= totalCards) {
            currentIndex = 0;
            updateCarousel(false);
        }
        if (currentIndex < 0) {
            currentIndex = totalCards - 1;
            updateCarousel(false);
        }
        updatePaginationDots();
        updateCardStyles();
    }

    // Touch Event Handlers
    function handleTouchStart(e) {
        isDragging = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        startTranslateX = getCurrentTranslateX();
        
        // Disable transition during drag
        carousel.style.transition = 'none';
        
        // Prevent default to avoid scrolling while swiping
        e.preventDefault();
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
        
        // Calculate the distance moved
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Check if horizontal scroll is greater than vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
            currentTranslateX = startTranslateX + diffX;
            carousel.style.transform = `translateX(${currentTranslateX}px)`;
            e.preventDefault();
        }
    }

    function handleTouchEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        const diff = touchEndX - touchStartX;
        
        // Enable transition again
        carousel.style.transition = 'transform 0.3s ease-in-out';
        
        // Minimum distance for swipe
        const minSwipeDistance = cardWidth / 4;
        
        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0) {
                currentIndex--;
            } else {
                currentIndex++;
            }
        }
        
        updateCarousel();
        updatePaginationDots();
    }
    
    function getCurrentTranslateX() {
        const style = window.getComputedStyle(carousel);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }
    
    // Add touch event listeners
    carousel.addEventListener('touchstart', handleTouchStart, { passive: false });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
    carousel.addEventListener('touchend', handleTouchEnd);
    
    // Click event listeners
    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateCarousel();
    });
    
    paginationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            updatePaginationDots();
        });
    });
    
    carousel.addEventListener('transitionend', handleTransitionEnd);
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newCardWidth = cards[0].offsetWidth;
            if (newCardWidth !== cardWidth) {
                location.reload();
            }
        }, 250);
    });
    
    // Initial setup
    updatePaginationDots();
});

// Sample image data - replace with your actual image data
const allImages = [
    { src: 'Images/Gallery/Untitled.png', alt: 'Description 1' },
    { src: 'Images/Gallery/Logo2.png', alt: 'Description 2' },
    { src: 'Images/Gallery/Cover.png', alt: 'Description 3' },
    { src: 'Images/Gallery/Logo New.png', alt: 'Description 4' },
    { src: 'Images/Gallery/Logo Next NTxt.png', alt: 'Description 5' },
    { src: 'Images/Gallery/Logo Next.png', alt: 'Description 6' },
    { src: 'Images/Gallery/Logo2 No Text.png', alt: 'Description 7' },
    { src: 'Images/Gallery/Logo2.png', alt: 'Description 8' },
    { src: 'Images/Gallery/The-Green-Bamboo-Wall-2-1529930041195.jpg', alt: 'Description 9' },
    { src: 'Images/Gallery/Untitled.png', alt: 'Description 10' },
    // Add more images as needed
];

let currentImageIndex = 0;

function initializeGallery() {
    // Select random images for the gallery
    const displayedImages = [...allImages].sort(() => 0.5 - Math.random()).slice(0, 6);

    // Update gallery images
    const imgElements = document.querySelectorAll('.gallery-img img');
    imgElements.forEach((img, index) => {
        if (index < displayedImages.length) {
            img.src = displayedImages[index].src;
            img.alt = displayedImages[index].alt;
        }
    });

    // Add overlay for remaining images on the last gallery image
    const remainingCount = allImages.length - 6;
    if (remainingCount > 0) {
        const lastGalleryImg = document.querySelector('.gallery-img.last-gallery-img');
        if (lastGalleryImg) {
            lastGalleryImg.setAttribute('data-overlay-text', `+${remainingCount}`);
        }
    }
}

// Lightbox functionality
function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    document.querySelector('.lightbox').classList.add('active');
}

function closeLightbox() {
    document.querySelector('.lightbox').classList.remove('active');
}

function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightbox-image');
    const caption = document.getElementById('lightbox-caption');
    const currentImage = allImages[currentImageIndex];

    // Update lightbox image and caption
    lightboxImg.src = currentImage.src;
    lightboxImg.alt = currentImage.alt;
    caption.textContent = currentImage.alt;
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    updateLightboxImage();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    updateLightboxImage();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();

    // Add click listeners to open the lightbox
    document.querySelectorAll('.gallery-img').forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    // Lightbox controls
    document.getElementById('close-lightbox').addEventListener('click', closeLightbox);
    document.getElementById('next-image').addEventListener('click', nextImage);
    document.getElementById('prev-image').addEventListener('click', prevImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!document.querySelector('.lightbox').classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
});
