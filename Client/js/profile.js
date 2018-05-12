$(document).ready(function() {

    var userInfo = getUserInfo();
    var userType = '', userId = '';
    // if the user is not logged and try to access page then redirecting to home page.
    if(userInfo){
        userType = userInfo.UserTypeId;
        userId = userInfo.UserId;
        loadAgentListings();
        document.getElementById('profile-name').innerHTML = userInfo.FirstName+" "+userInfo.LastName;
        document.getElementById('profile-picture').setAttribute("src", userInfo.UserImagePath);
    }
    else if(userInfo == undefined){
        window.location.href = BASE_URL;
    }

    //  checking the user if he is not agent he cannot create listing
    if(userType == 1){
        $('.add-new-listing').css("display", "none");
    }

    // Gets the list of listings which are added by agent.
    function loadAgentListings(){
        getUserListings(userId, userType).then(function(data){
            $('.myprofile-content').load("partials/_listingCard.html", function(){
                $(".agent-section").css("display","none");
                if(data.success){
                    var response = data.data;

                    for(var i=0; i < response.length; i++){
                        var template = $('#listingCard').clone();
                        template.attr('style',"display:block;");

                        template.find(".listing-title")[0].innerHTML = "<div id=listing-"+i+" class='view-listing-details' data='" +response[i].Id+ "'>" + response[i].Title + "</div>";
                        template.find(".realestateAd-type")[0].innerHTML = response[i].AdType.AdTypeName;
                        
                        template.find(".realEstateBeds")[0].innerHTML = response[i].BedRooms || '3 Beds';
                        template.find(".realEstateType")[0].innerHTML = response[i].RealEstateCategory.CategoryName;
                        template.find(".realEstateAddress")[0].innerHTML = response[i].City+", "+response[i].State+", " + response[i].Zip + ".";
                        
                        template.find(".btn-link")[0].innerHTML = "<a href='javascript:' id=listing-link-"+i+" data="+response[i].Id+" class='hvr-sweep-to-right more view-listing-details'>See Details</a>";

                        template.find(".adImage")[0].innerHTML = "<img id=listing-image-"+i+" class='listing-image view-listing-details' src='" + response[i].AdMedia[0].ImagePath + "' data="+response[i].Id+" alt=''> <span class='four listing-price'>$"+response[i].Price+"</span>";
                        if(userType == 2){
                           template.find(".actionBtns")[0].innerHTML = "<span id=edit-listingBtn-"+i+" class='label label-primary edit-listing' data="+response[i].Id+">Edit</span> &nbsp;<span id=delete-listingBtn-"+i+" class='label label-danger delete-listing' data="+response[i].Id+">Delete</span>"; 
                        }
                        
                        var exe = template.find(".adImage")[0];

                        // after adding all details appending the template
                        template.appendTo(".appendHere");
                    }
                    
                    if(userType == 2){
                        console.log(document.getElementsByClassName('actionBtns'));
                        document.getElementsByClassName('actionBtns')[0].style.display = 'block';
                        var actionLinks = document.getElementsByClassName('actionBtns');

                        for(var i=0;i < actionLinks.length;i++) {
                            actionLinks[i].style.display = 'block';
                            
                        };
                        var deleteListingLinks = document.getElementsByClassName("delete-listing");
                        var editListingLinks = document.getElementsByClassName("edit-listing");

                        for(var i=0;i < deleteListingLinks.length;i++) {
                            deleteListingLinks[i].addEventListener("click", function() {
                                var element = document.getElementById(this.id);
                                var idx = element.getAttribute("data");
                                deleteListing(idx);
                            });
                        };

                        for(var i=0;i < editListingLinks.length;i++) {
                            editListingLinks[i].addEventListener("click", function() {
                                var element = document.getElementById(this.id);
                                var idx = element.getAttribute("data");
                                editListing(idx);
                            });
                        };
                    }

                    var listingDetailsLinks = document.getElementsByClassName("view-listing-details");                    
                    for(var i=0;i < listingDetailsLinks.length;i++) {
                        listingDetailsLinks[i].addEventListener("click", function() {
                            var element = document.getElementById(this.id);
                            var idx = element.getAttribute("data");
                            listingDetails(idx);
                        });
                    };
                    apiCalled = false;
                }

            });
        });
    }   


    // Displaying and getting list
    $('.myprofile-listings').click(function(){

        loadAgentListings();
    })

    //Showing changing password form in view
    $('.myprofile-change-password').click(function(){
       
        $( ".myprofile-content" ).load( "partials/_changePassword.html", function() {
             $('.change-password-btn').click(function(){
                updatePassword();
            });
        });
    })

    //Shwoing editing profile form in view
    $('.myprofile-edit').click(function(){
       
        $( ".myprofile-content" ).load( "partials/_editProfile.html", function() {
            
            var userInfo = JSON.parse(localStorage.getItem("userInfo"));

            $("#firstname").val(userInfo.FirstName);
            $("#lastname").val(userInfo.LastName);
            $("#email").val(userInfo.Email);
            $("#mobilenumber").val(userInfo.MobileNumber);
            $("#address").val(userInfo.Address);

            $('.edit-profile-btn').click(function(){
                updateProfile();
            });
        });
    })

    // Showing add new listing form in view
    $('.add-new-listing').click(function(){
       
        $( ".myprofile-content" ).load( "partials/_addNewListing.html", function() {
            var createListingBtn = document.getElementsByClassName("listing-new-btn");
            $('.ad-status').css("display", "none");
            $('#listing-map').locationpicker({
                location: {
                    latitude: 50.5558095,
                    longitude: 9.680844900000011
                },
                radius: 250,
                inputBinding: {
                    latitudeInput: $('#listing-latitude'),
                    longitudeInput: $('#listing-longitude'),
                    locationNameInput: $('#us3-address')
                },
                enableAutocomplete: true,
                onchanged: function (currentLocation, isMarkerDropped) {
                }
            });

             // Adding click event for button
            $('.listing-update-btn').css("display", "none");
            for(var i=0;i < createListingBtn.length;i++) {
                createListingBtn[i].addEventListener("click", function() {
                   
                    createListing();
                });
            };
        });
    })    
    
    // Saving password after updating
    function updatePassword(){

        var oldPass = $("#current-password").val(),
        newPass = $("#new-password").val(),
        cnewPass = $("#confirm-new-password").val();

        if(oldPass == "" || oldPass === undefined){
            $("#error-msg").text("Please enter old password");
            return;
        }
        if(newPass == "" || newPass === undefined){
            $("#error-msg").text("Please enter password");
            return;
        }
        if(cnewPass == "" || cnewPass === undefined){
            $("#error-msg").text("Please confirm password");
            return;
        }
        if(newPass != cnewPass){
            $("#error-msg").text("Passwords mismatch please re enter passwords");
            return;
        }

        changePassword(oldPass, newPass, cnewPass, userType, userId).then(function(data){
            console.log('response after change password =',data);
            var response = data;
            if(response.success == false){
                $("#error-msg").text(response.message);
            }
            else if(response.success){
                showToaster('Password changed successfully', 'success');
                loadAgentListings();
            }
            
        });
    }

    // Saving profile details after updating
    function updateProfile(){

        var fname = $("#firstname").val(),
        lname = $("#lastname").val(),
        email = $("#email").val(),
        mnumber = $("#mobilenumber").val(),
        address = $("#address").val();

        if(fname == "" || fname === undefined){
            $("#error-msg").text("Please enter first name");
            return;
        }
        if(lname == "" || lname === undefined){
            $("#error-msg").text("Please enter last name");
            return;
        }
        if(email == "" || email === undefined){
            $("#error-msg").text("Please confirm email ");
            return;
        }
        if(mnumber == "" || mnumber === undefined){
            $("#error-msg").text("Please enter mobile number");
            return;
        }


        updateUserDetails(fname, lname, email, mnumber, address, userId).then(function(data){
            console.log('response after updating profile=', data);
            var response = data;
            if(response.success == false){
                $("#error-msg").text(response.message);
            }
            else if(response.success){
                localStorage.setItem('userInfo', JSON.stringify(response.data));
                document.getElementById('profile-picture').setAttribute("src", response.data.UserImagePath);;
                showToaster('Profile updated successfully', 'success');
                //loadAgentListings();
                $('.myprofile-edit').click();
            }
            
        });
    }

    // Deleting listing
    function deleteListing(id){
        console.log(id);
        var deleteConfirm = confirm("Are you sure Do you want to delete ?");
        if (deleteConfirm) {
            console.log('deleted');
            deleteAdListing(id).then(function(data){
                if(data.success == false){
                    
                }
                else if(data){
                    loadAgentListings();
                    showToaster('Profile updated successfully', 'success');
                }
            })
        }
        else {
            console.log('not deleted');
        }
    };

    // locates the address in google maps and add it to html page
    // function locateInMap(address){
    //     var address = address || 'Germany';
    //     geocoder = new google.maps.Geocoder();
    //     if (geocoder) {
    //         geocoder.geocode({
    //             'address': address
    //         }, function (results, status) {
    //             if (status == google.maps.GeocoderStatus.OK) {
                
    //                 document.getElementById('listing-map').innerHTML = "<iframe src='https://maps.google.com/maps?q="+results[0].geometry.location.lat()+","+results[0].geometry.location.lng()+"&hl=es;z=14&amp;output=embed'></iframe>";

    //             }else{
    //                 document.getElementById('listing-map').innerHTML = "<iframe src='https://maps.google.com/maps?q=51.165691,10.451526000000058&hl=es;z=14&amp;output=embed'></iframe>";
    //             }
    //         });
    //     }else{
    //         document.getElementById('listing-map').innerHTML = "<iframe src='https://maps.google.com/maps?q=51.165691,10.451526000000058&hl=es;z=14&amp;output=embed'></iframe>";

    //     }
    // }


    // Getting the listing details and displaying them.
    function listingDetails(val){
        var userInfo = getUserInfo();
        console.log(val);
        getListingDetails(val).then(function(response){
            console.log(response);
            if(document.getElementById("search-content"))
            document.getElementById("search-content").style.display = "none";
            // $("#search-content").style.display = "none";
            $('.myprofile-content').load("partials/_listingDetails.html", function(){
                
                document.getElementsByClassName('listing-details-banner')[0].style.display = 'none';
                $("#listing-heading").html(response.data.Title);
                $(".realestateAd-status").html('Available');
                $('#listing-description').html(response.data.AdDescription);
                $('#listing-beds').html(response.data.BedRooms);
                $('#listing-baths').html(response.data.BathRooms);
                $('#listing-area').html(response.data.SquareFeet);
                $('#listing-parking').html(response.data.Parking);
                $('#listing-price').html(response.data.Price);
                $('#listing-kitchen').html(response.data.Kitchen);
                $('#listing-type').html(response.data.AdType.AdTypeName);
                $('#listing-address-street').html(response.data.Address);
                $('#listing-address-city').html(response.data.City);
                $('#listing-address-state').html(response.data.State);
                $('#listing-address-zip').html(response.data.Zip);

                $('#listing-livingRoom').html(response.data.LivingRooms);
                $('#listing-lot-area').html(response.data.LotArea);
                $('#listing-numberFloors').html(response.data.NumOfFloors);
                if(response.data.Parking == 1){
                    $('#listing-parking').html("yes");
                }else{
                    $('#listing-parking').html("no");
                    }
                document.getElementById('listing-primary-image').src=response.data.AdMedia[0].ImagePath;
                $('#agent-title').innerHTML=response.data.AgentName;
                document.getElementById('agent-title').setAttribute("data", response.data.AgentId);
                document.getElementById('agent-picture').setAttribute("src", response.data.AgentImage);
                document.getElementById('lat').value = response.data.Latitude;
                document.getElementById('long').value = response.data.Longitude;
                document.getElementById('listing-id').value = response.data.ID;
                
                $('#mark-favourite').hide();
                $('#unmark-fav').hide();
                $('.hide-agent-info').hide();
                $('.display-agent-info').hide();

                response.data.FavouriteIds = [];
                response.data.FavouriteAds.forEach(function(ad){
                    response.data.FavouriteIds.push(ad.UserUserId)
                });

                // document.getElementById('listing-images').
                var carousel = document.getElementsByClassName('listing-carousel-images');
                console.log(carousel[0]);
                for(var i=1; i< response.data.AdMedia.length; i++){
                    var newCarouselImage = document.createElement('div');
                    newCarouselImage.setAttribute("class", "item");
                    newCarouselImage.innerHTML = "<img src="+response.data.AdMedia[i].ImagePath+" alt='' style='width:100%;'>";
                    console.log(newCarouselImage);
                    
                    carousel[0].appendChild(newCarouselImage);

                    var address = response.data.Address +','+ response.data.City +','+ response.data.State+','+ response.data.Zip;
                    //locateInMap(address);
                };

                if(userInfo){
                    if(userInfo.UserTypeId == 2){
                        $('.display-agent-info').hide();   
                        $('.mark-as-favourite').hide(); 
                        $('.login-message').hide();                    
                    }
                    else{
                        $('.display-agent-info').show(); 
                        $('.login-message').hide();
                        if($.inArray( userInfo.UserId , response.data.FavouriteIds) < 0){
                            $('#mark-favourite').show();
                            $('#unmark-fav').hide();
                        }
                        else{
                            $('#mark-favourite').hide();
                            $('#unmark-fav').show();
                        }
                    }
                } else{
                   $('.display-agent-info').hide();
                    $('.login-message').show(); 
                    $('.mark-as-favourite').hide();                      
                }

                //loading map
                initMap();
            });
        })

    };

    // Getting listing details for editing
    function editListing(id){
        console.log(id);
       
        getListingDetails(id).then(function(response){
            console.log('details of listing =',response);
                
            $( ".myprofile-content" ).load( "partials/_addNewListing.html", function() {
                $('#listing-title').val(response.data.Title);
                $('#listing-description').val(response.data.AdDescription);
                $('#listing-noOfBeds').val(response.data.BedRooms);
                $('#listing-noOfBaths').val(response.data.BathRooms);
                $('#listing-kitchen').val(response.data.Kitchen);
                $('#listing-noOfLiving').val(response.data.LivingRooms);
                $('#listing-area').val(response.data.SquareFeet);
                $('#listing-lotArea').val(response.data.LotArea);
                $('#listing-type').val(response.data.AdTypeId);
                $('#listing-category').val(response.data.RealEstateCategoryId);
                $('#listing-noOfFloors').val(response.data.NumOfFloors);
                $('#listing-parking').val(response.data.Parking);
                $('#listing-status').val(response.data.AdStatusId);
                var parking = response.data.Parking+''
                document.getElementById('listing-parking').value = response.data.Parking;
                $('#listing-price').val(response.data.Price);
                $('#listing-door').val(response.data.Address);
                $('#listing-city').val(response.data.City);
                $('#listing-state').val(response.data.State);
                
                $('#listing-zip').val(response.data.Zip);
                $('.listing-new-btn').css("display", "none");
                $('.listing-update-btn').attr("data", response.data.ID);
                $('.listing-update-btn').attr("id", 'listing-update-'+response.data.ID);
                $('.uploadfile').css("display", "none");
                var updateListingBtn = document.getElementsByClassName("listing-update-btn");

                for(var i=0;i < updateListingBtn.length;i++) {
                    updateListingBtn[i].addEventListener("click", function() {
                        var element = document.getElementById(this.id);
                        var idx = element.getAttribute("data");
                        updateListing(idx);
                    });
                };

                $('#listing-map').locationpicker({
                    location: {
                        latitude: response.data.Latitude || 50.5558095,
                        longitude: response.data.longitude || 9.680844900000011
                    },
                    radius: 250,
                    inputBinding: {
                        latitudeInput: $('#listing-latitude'),
                        longitudeInput: $('#listing-longitude'),
                        locationNameInput: $('#us3-address')
                    },
                    enableAutocomplete: true,
                    onchanged: function (currentLocation, isMarkerDropped) {
                    }
                });
            });
          
        })
    };

    // Create new listing
    function createListing(){
       
        var data = {};
        data.Title = $('#listing-title').val();
        data.AdDescription = $('#listing-description').val();
        data.BedRooms = $('#listing-noOfBeds').val();
        data.BathRooms = $('#listing-noOfBaths').val();
        data.Kitchen = $('#listing-kitchen').val();
        data.LivingRooms = $('#listing-noOfLiving').val();
        data.SquareFeet = $('#listing-area').val();
        data.LotArea = $('#listing-lotArea').val();
        data.NumOfFloors = $('#listing-noOfFloors').val();
        data.Parking = $('#listing-parking').val();
        data.AdTypeName = $('#listing-type').val();
        data.RealEstateCategory = $('#listing-category').val();
        data.Price = $('#listing-price').val();
        data.Address = $('#listing-door').val();
        data.City = $('#listing-city').val();
        data.State = $('#listing-state').val();
        data.Zip = $('#listing-zip').val();

        data.Latitude = $('#listing-latitude').val();
        data.Longitude = $('#listing-longitude').val();

        data.AgentId = userInfo.UserId;

        for(var key in data){
            console.log(key,'=', data[key]);
            if(data[key] == ''){
                var errMsg = "Please enter "+ key;
                $("#error-msg").text(errMsg);

                return;
            }
        }

        //data.Images = listingFiles;

        console.log( 'after creating =',data);
        saveLisitng(data).then(function(data){
           console.log('response after creating listing=', data);
            var response = data;
            if(response.success == false){
                $("#error-msg").text(response.message);
            }
            else if(response.success){
                showToaster('Listing created successfully', 'success');
                loadAgentListings();
            } 
        })
    }
        
// Save listing after editing 
    function updateListing(listingId){
        console.log('listing id in updating =', listingId);
        var data = {};
        data.Title = $('#listing-title').val();
        data.AdDescription = $('#listing-description').val();
        data.BedRooms = $('#listing-noOfBeds').val();
        data.BathRooms = $('#listing-noOfBaths').val();
        data.Kitchen = $('#listing-kitchen').val();
        data.LivingRooms = $('#listing-noOfLiving').val();
        data.AdTypeName = $('#listing-type').val();
        data.SquareFeet = $('#listing-area').val();
        data.LotArea = $('#listing-lotArea').val();
        data.NumOfFloors = $('#listing-noOfFloors').val();
        data.Parking = $('#listing-parking option:selected').val();
        data.AdTypeName = $('#listing-type option:selected').val();
        data.RealEstateCategory = $('#listing-category option:selected').val();
        data.Price = $('#listing-price').val();
        data.Address = $('#listing-door').val();
        data.City = $('#listing-city').val();
        data.State = $('#listing-state').val();
        data.Zip = $('#listing-zip').val();
        data.AdStatus = $('#listing-status').val();
        data.Latitude = $('#listing-latitude').val();
        data.Longitude = $('#listing-longitude').val();
        data.AgentId = userInfo.UserId;
        data.ID = listingId;
        data.AdStatusId = $('#listing-status option:selected').val();

        for(var key in data){
            console.log(key,'=', data[key]);
            if(data[key] == ''){
                var errMsg = "Please enter "+ key;
                $("#error-msg").text(errMsg);

                return;
            }
        }

        saveEditedLisitng(data).then(function(data){
           console.log('response after updating listing=', data);
            var response = data;
            if(response.success == false){
                $("#error-msg").text(response.message);
            }
            else if(response){
                loadAgentListings();
                showToaster('Listing updated successfully', 'success');
            } 
        })
    }

});

var listingFiles = [];

function checkUploadedFile(){

        var x = document.getElementById('listing-fileUpload');
        console.log(x);

        var txt = "";
        if ('files' in x) {

            console.log(x.files,'=========',x);
            if (x.files.length == 0) {
                txt = "Select one or more files.";
            } else {
                for (var i = 0; i < x.files.length; i++) {
                   
                    if(x.files[i].type == 'image/png' || x.files[i].type == 'image/jpeg' || x.files[i].type == 'image/jpg'){
                         listingFiles.push(x.files[i]);
                          txt += "<br><strong>" + (i+1) + ". file</strong><br>";
                        var file = x.files[i];
                        if ('name' in file) {
                            txt += "name: " + file.name + "<br>";
                        }
                        if ('size' in file) {
                            txt += "size: " + file.size + " bytes <br>";
                        }
                    }else{
                        $("#error-msg").text('Please upload valid files like ".jpg", ".jpeg", ".png"');
                        document.getElementById('listing-fileUpload').value = '';
                    }
                   
                }
            }
        } 
        document.getElementById("listing-images").innerHTML = txt;

    }

    // initializing the map for displaying it.

var map, infoWindow;
function initMap() {
    var latitude = $("#lat").val();
    var longitude = $("#long").val();
    if(latitude != "" || latitude !== undefined)
        latitude = parseFloat(latitude);
    if(longitude != "" || longitude !== undefined)
        longitude = parseFloat(longitude);

    var location = $("#listing-address-street").text();

    var myLatLng = {lat: latitude, lng: longitude};

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: myLatLng
    });

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: location
    });

    marker.info = new google.maps.InfoWindow({
      content: '<b>Location:</b> ' + location
    });

    google.maps.event.addListener(marker, 'click', function() {
      marker.info.open(map, marker);
    });
}

