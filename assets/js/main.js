// Header nav appears on scroll
$(window).scroll(function () {
    let offset = $(window).scrollTop();

    if (offset > 550) {
        // remove class .bg-trans from #nav-header, add class .bg-dark, and slide down
        $("#nav-header")
            .addClass("bg-dark")
            .removeClass("bg-trans")
            .css({
                "margin-top": "0",
                transition: "all 1s"
            });
        // show .navbar-brand img
        $(".navbar-brand img").css({
            opacity: "1",
            transition: "all 1s"
        });
    } else {
        $("#nav-header")
            .addClass("bg-trans")
            .removeClass("bg-dark")
            .css({
                "margin-top": "-55px",
                transition: "all 1s"
            });
        $(".navbar-brand img").css({
            opacity: "0",
            transition: "all 1s"
        });
    }
});

// SCROLLMAGIC
// ScrollMagic controller
let controller = new ScrollMagic.Controller();

// Scene: reveal #homepage-header background image
// create scene triggered by reaching px location
let sceneHomepageHeader = new ScrollMagic.Scene({
        offset: 0, // start scene after scrolling for 0px
        duration: 600 // pin the element for 600px of scrolling
    })
    .setPin("main") // the element we want to pin
    .addTo(controller); // add scene to controller

// video animates with pulse when it reaches center of screen
let weTrainVideo = new ScrollMagic.Scene({
        triggerElement: "#wetrain-video",
        duration: 0
    })
    .triggerHook(0.9)
    .setClassToggle("#wetrain-video div.animated", "pulse")
    .addTo(controller);

// hide my email from spambots
$("#email-frank").on("click", function () {
    event.preventDefault();
    let parts = ["frank", "gmail", "masabo55", ".", "@", "com"]; // split into array
    let email = parts[0] + parts[2] + parts[4] + parts[1] + parts[3] + parts[5]; // piece it back together
    // console.log(email);
    let subject = "Information about doggy hub"; // assign subject of email
    window.location = "mailto:" + email + "?subject=" + subject; // add mailto so click leads to user's email application
});

//google map services

// FUNCTIONAL SCRIPTS

(function () {
    // UI VARIABLES

    let userInput = "";
    let buttonParam = "";

    // DOM QUERY VARIABLES

    const resultText = $("#results-text-show");
    const goButtonClick = $(".go-button-click");
    const goButton = $("#go");
    const resultSection = $("section");
    const resetButton = $("#reset-button");
    const searchButtonStyle = $(".search-form-button");

    // ON PAGE LOAD CLEAR SEARCH FIELD WITH EMPTY STRING

    const searchBar = document.getElementById("user-input");

    searchBar.value = "";

    //AUTO COMPLETE - Restricted to sweden

    let input = searchBar;
    let options = {
        types: ["(cities)"],
        componentRestrictions: {
            country: ["se", "ie"]
        }
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);

    // ACTIVATE XMLHTTP REQUEST ON GO CLICK - UI SCRIPTS BELOW

    function sendSearch() {
        let geoUrl =
            "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            userInput.toString() +
            "&key=AIzaSyD-CXRwTcTgC8tAAbiYZ6T4BWGD9FK9uCs";

        //HTTP REQUEST

        function getLocation(geoUrl, locationData) {
            let xhr = new XMLHttpRequest();

            xhr.open("GET", geoUrl);
            xhr.send();

            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    locationData(JSON.parse(this.responseText));
                }
            };
        }

        // GET LAT AND LONG OF LOCATION

        function position(callback) {
            getLocation(geoUrl, function (locationData) {
                let geoData = locationData.results[0].geometry.location;
                let lat = geoData.lat.toString();
                let long = geoData.lng.toString();

                let latLong = [lat, long];
                callback(latLong);
            });
        }

        //INITIALIZE GOOGLE MAP AND PASS IN LATLONG

        position(function (latLong) {
            let map;
            let service;
            let infowindow;

            function initialize() {
                let mapLocation = new google.maps.LatLng(latLong[0], latLong[1]); // latLong called back from geo request //

                map = new google.maps.Map(document.getElementById("map"), {
                    center: mapLocation,
                    zoom: 11
                });

                // PASS IN UI TO REQUEST

                let request = {
                    location: mapLocation,
                    radius: "5000",
                    query: buttonParam
                };

                service = new google.maps.places.PlacesService(map);
                service.textSearch(request, callback);
            }

            function callback(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (let i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                }
            }

            infowindow = new google.maps.InfoWindow();

            // find place details using nearby search

            function createMarker(place) {
                let marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                marker.addListener("click", function () {
                    let request = {
                        reference: place.reference
                    };

                    service.getDetails(request, function (details, status) {
                        //  retrieve all reviews and create new array

                        let reviewArray = [];

                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            if (details.reviews == undefined) {
                                reviewArray.push("The author didn't leave a review"); // if no reviews insert string
                            } else {
                                for (let i = 0; i < details.reviews.length; i++) {
                                    // else iterate through google reviews array and populate my reviewsArray with results

                                    if (details.reviews[i].text.length !== 0) {
                                        reviewArray.push(details.reviews[i].text); // check if the array item isn"t empty
                                    } else if (details.reviews[i].text.length == 0) {
                                        reviewArray.push("The author didn't leave a review");
                                    }
                                }
                            }

                            //  object created with retrieved details ready to be passed to a DIV for styling below the map

                            let info = {
                                name: details.name,
                                address: details.formatted_address,
                                website: details.website,
                                number: details.formatted_phone_number,
                                rating: details.rating
                            };

                            // write to document below HTML on Marker click

                            document.getElementById("text").innerHTML = `<h2>${info.name}</h2>
                              <h3>Address</h3>
                              <p>${info.address}</p>
                              <h3>Website</h3>
                              <p><a href="${info.website}" target="_blank"><button class="website-button">Click Me</button></a></p>
                              <h3>Phone</h3>
                              <p>${info.number}</p>
                              <h3>Overall Rating</h3>
                              <p>${info.rating}</p>
                              <h3>Reviews</h3>`;

                            let eachReview;

                            for (i = 0; i < reviewArray.length; i++) {
                                //iterate reviewArray and create HTML

                                eachReview = document.createElement("p");
                                eachReview.innerHTML = `<em><strong>"${reviewArray[i]}</strong>"</em>`;
                                document.getElementById("text").appendChild(eachReview);
                            }

                            resultText.addClass("resultstext");
                            resultText.delay(200).slideDown(400);
                        }
                    });

                    infowindow.setContent(place.name);
                    infowindow.open(map, marker);
                });
            }

            initialize(); // INITIALIZE MAP
        });
    }

    // UI SCRIPTS (JQUERY)

    // GO FUNCTION

    function goAll() {
        sendSearch();

        goButtonClick.addClass("go-click");
        resultSection.slideDown("fast");
        resetButton.addClass("results-reset-click");
    }

    // RESET FUNCTIONS

    function resetUI() {
        searchBar.value = "";
        userInput = "";
        buttonParam = "";
    }

    function resetResults() {
        $("#scrollTo").css("display", "none");
    }

    function resetButtons() {
        searchButtonStyle.removeClass("search-button-clicked");
        searchButtonStyle.children("span").removeAttr("id");
        searchButtonStyle.children("i").removeClass("search-form-icon-clicked");
        goButtonClick.removeClass("go-click");
        resetButton.addClass("results-reset-click");
    }
    // HALF RESET FUNCTION

    function stylesReset() {
        resultText.delay(200).slideUp(400);
        goButtonClick.removeClass("go-click");
    }

    searchButtonStyle.on("click", function () {
        if ($(this).hasClass("search-button-clicked")) {
            $(this).removeClass("search-button-clicked");
            $(this)
                .children("i")
                .removeClass("search-form-icon-clicked");
            $(this)
                .children("span")
                .removeAttr("id");

            searchButtonStyle.children("span").removeAttr("id");
            searchButtonStyle.children("i").removeClass("search-form-icon-clicked");

            buttonParam = "";

            //  console.log(this);
        } else {
            searchButtonStyle.removeClass("search-button-clicked");
            searchButtonStyle.children("span").removeAttr("id");
            searchButtonStyle.children("i").removeClass("search-form-icon-clicked");

            $(this).addClass("search-button-clicked");
            $(this)
                .children("i")
                .addClass("search-form-icon-clicked");
            $(this)
                .children("span")
                .attr("id", "search-buttons-text-clicked");

            buttonParam = $(this)
                .attr("value")
                .toString();
        }

        stylesReset();
    });

    // GO BUTTON

    goButtonClick.on("click", function () {
        userInput = $(searchBar).val();

        // variables to determine content of modal
        const modal = $(".modal");
        const close = $(".modal__content-close");
        const modalText = $(".modal__content-text");
        const modalTextObj = {
            enterBoth: "Please enter a location and select a service",
            enterLocation: "Please enter a location",
            selectStop: "Please select a service"
        };

        // MODAL FUNCTION

        function myModal() {
            modal.fadeIn();

            close.on("click", function () {
                modal.fadeOut();
            });
        }

        if (userInput == "" && buttonParam == "") {
            modalText.html(modalTextObj.enterBoth);

            myModal();
        } else if (userInput == "" && buttonParam !== "") {
            modalText.html(modalTextObj.enterLocation);

            myModal();
        } else if (userInput !== "" && buttonParam == "") {
            modalText.html(modalTextObj.selectStop);

            myModal();
        } else if (userInput !== "" && buttonParam !== "") {
            if (goButton.hasClass("go-click")) {
                goButton.addClass("go-click");
            } else if (
                goButton.attr("class") !== "go-click" &&
                resultSection.attr("id") == "scrollTo"
            ) {
                console.log("called");
                goAll();

                $("html, body")
                    .delay(400)
                    .animate({
                            scrollTop: $(
                                $(this)
                                .parent()
                                .attr("href")
                            ).offset().top
                        },
                        400
                    );
            } else if (
                goButton.attr("class") !== "go-click" &&
                resultSection.attr("id") == undefined
            ) {
                goAll();
            }
        }
    });
    // INPUT CLICK RESET STYLES

    $(searchBar).on("click", function () {
        stylesReset();
    });

    // RESET SEARCH

    resetButton.on("click", function () {
        resetUI();
        resetResults();
        resetButtons();
    });
})();

/*google translate */
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en'
    }, 'google_translate_element');
}