var BASE_URL = '/';
$(window).load(function() {

// Functions which are invoked by .click functions that is why these are defined under window load function
    var apiCalled = false;

//    if(location.pathname == '/index.html'){
//        window.location.href = location.origin+'/'
//    }
//    if(location.pathname == ''){
//        window.location.href = location.origin+'/'
//    }
    $( "#header-content" ).load( "partials/_header.html", function() {
        document.getElementById('homeLink').innerHTML = "<a href="+BASE_URL+"><i class='glyphicon glyphicon-home'> </i>Home</a>";
        document.getElementById('aboutLink').innerHTML = "<a href="+BASE_URL+"about><i class='glyphicon glyphicon-info-sign'> </i>About Us</a>";
        document.getElementById('contactLink').innerHTML = "<a href="+BASE_URL+"contact><i class='glyphicon glyphicon-earphone'> </i>Contact</a>";
        window.scrollTo(0, 0);
        setNavLinks();
    });

    $( "#footer-content" ).load( "partials/_footer.html", function() {

    });

    $(window).on('hashchange', function(){
        newLocation = window.location.href;

        if(location.hash){

            hash = location.hash.substring(2);

            // var params = hash.split('&');

            switch(true){
                case(hash.indexOf('search') == '0'):

                    if(!apiCalled){
                        searchListings('');
                    }
                    break;
                case(hash.indexOf('listing_id') == '0'):

                    if(!apiCalled){
                        console.log('details api is called');
                        listingDetails(hash.split('=')[1]);
                    }

                    break;
                default:
                    console.log('home');
                    $("#body-content").load("partials/_homeBody.html", function(){
                    });
            };
        }else if( location.pathname == BASE_URL ){
            loadHomePage();

        }
    }).trigger('hashchange');



    function loadHomePage(){
        $("#header-content").load( "partials/_header.html", function() {
            document.getElementById('homeLink').innerHTML = "<a href="+BASE_URL+"><i class='glyphicon glyphicon-home'> </i>Home</a>";
            document.getElementById('aboutLink').innerHTML = "<a href="+BASE_URL+"about><i class='glyphicon glyphicon-info-sign'> </i>About Us</a>";
            document.getElementById('contactLink').innerHTML = "<a href="+BASE_URL+"contact><i class='glyphicon glyphicon-earphone'> </i>Contact</a>";
            window.scrollTo(0, 0);
            setNavLinks();
        });

        $("#search-content").load("partials/_search.html", function(){
            $('.search_button').click(function(){
                searchListings();
            });
        });

        $("#body-content").load("partials/_homeBody.html", function(){
            searchListings('');
        })

        $( "#footer-content" ).load( "partials/_footer.html", function() {

        });

    }


    function searchListings(){
        document.getElementById("search-content").style.display = "block";

        var searchVal = $("#txtSearch").val();
        var accomodationType = $("#ddType option:selected").val();
        var bedrooms = $("#ddBedroom option:selected").val();
        var sqft = $("#txtSqft").val();
        var adType = $("#ddAdType option:selected").val();
        var pageIndex = 0;
        if(localStorage.getItem("pageIndex") != null){
            pageIndex = parseInt(localStorage.getItem("pageIndex"));
        }

        getListings(searchVal, accomodationType, bedrooms, sqft, adType, pageIndex).then(function(data){
            $('#body-content').load("partials/_listingCard.html", function(){
                if(data.success){
                    var response = data.data;

                    for(var i=0; i < response.length; i++){
                        var template = $('#listingCard').clone();
                        template.attr('style',"display:block;");

                        template.find(".listing-title")[0].innerHTML = "<div id=listing-"+i+" class='view-listing-details' data='" +response[i].Id+ "'>" + response[i].Title + "</div>";
                        //template.find(".realestateAd-status")[0].innerHTML = "Available";
                        template.find(".realestateAd-type")[0].innerHTML = response[i].AdStatusId == 1 ? 'Available' : 'Sold Out';
                        //template.find(".realEstatePrice")[0].innerHTML =  response[i].Price;
                        template.find(".realEstateBeds")[0].innerHTML = response[i].BedRooms + ' Beds';
                        template.find(".realEstateType")[0].innerHTML = response[i].RealEstateCategory.CategoryName;
                        template.find(".realEstateAddress")[0].innerHTML = response[i].City+", "+response[i].State+", " + response[i].Zip + ".";
                        //template.find(".realEstateCity")[0].innerHTML = response[i].City;
                        //template.find(".realEstateState")[0].innerHTML = response[i].State;
                        template.find(".btn-link")[0].innerHTML = "<a href='javascript:' id=listing-link-"+i+" data="+response[i].Id+" class='hvr-sweep-to-right more view-listing-details'>See Details</a>";

                        template.find(".adImage")[0].innerHTML = "<img id=listing-image-"+i+" class='listing-image view-listing-details' src='" + response[i].AdMedia[0].ImagePath + "' data="+response[i].Id+" alt=''> <span class='four listing-price'>$"+response[i].Price+"</span>";
                        var exe = template.find(".adImage")[0];
                        // after adding all details appending the template
                        template.appendTo(".appendHere");
                    }

                    loadAgents();

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

    };

    function loadAgents(){
        getAgentsList().then(function(data){
        console.log(data);
        //var userInfo = getUserInfo();
        var response = data;
        if(response.success){
            var agentList = response.data;
            $("#agentCard").loadTemplate('partials/_agentCard.html', agentList, { append: true, elemPerPage: 10 });            
        }
        else{
            $("#error-msg").text(response.message);
        }
    });
    }

    function listingDetails(val){
         var userInfo = getUserInfo();
        console.log(val);
        apiCalled = true;
        var url = window.location.href;
        window.location.hash = '?listing_id='+val;

        getListingDetails(val).then(function(response){
            console.log(response);
            if(document.getElementById("search-content"))
            document.getElementById("search-content").style.display = "none";
            // $("#search-content").style.display = "none";
            $('#body-content').load("partials/_listingDetails.html", function(){
               
                document.getElementById('listing-heading').innerHTML = response.data.Title;
                // $(".realestateAd-status").html('Available');
                document.getElementById('listing-description').innerHTML = response.data.AdDescription;
                document.getElementById('listing-beds').innerHTML = response.data.BedRooms;
                document.getElementById('listing-baths').innerHTML = response.data.BathRooms;
                document.getElementById('listing-area').innerHTML = response.data.SquareFeet;
                document.getElementById('listing-parking').innerHTML = response.data.Parking;
                document.getElementById('listing-price').innerHTML = response.data.Price;
                document.getElementById('listing-kitchen').innerHTML = response.data.Kitchen;
                document.getElementById('listing-type').innerHTML = response.data.AdType.AdTypeName;
                document.getElementById('listing-address-street').innerHTML = response.data.Address;
                document.getElementById('listing-address-city').innerHTML = response.data.City;
                document.getElementById('listing-address-state').innerHTML = response.data.State;
                document.getElementById('listing-address-zip').innerHTML = response.data.Zip;
                document.getElementById('listing-primary-image').src=response.data.AdMedia[0].ImagePath;
                document.getElementById('agent-title').innerHTML=response.data.AgentName;
                document.getElementById('listing-livingRoom').innerHTML = response.data.LivingRooms;
                document.getElementById('listing-lot-area').innerHTML = response.data.LotArea;
                document.getElementById('listing-numberFloors').innerHTML = response.data.NumOfFloors;
                if(response.data.Parking == 1){
                    document.getElementById('listing-parking').innerHTML = "yes";
                }else{
                    document.getElementById('listing-parking').innerHTML = "no";
                }
                
                document.getElementById('agent-title').setAttribute("data", response.data.AgentId);
                document.getElementById('agent-picture').setAttribute("src", response.data.AgentImage);
                document.getElementById('lat').value = response.data.Latitude;
                document.getElementById('long').value = response.data.Longitude;
                document.getElementById('listing-id').value = response.data.ID;

                // loading maps

                    //initMap();
                //
                
                // document.getElementById('listing-images').
                var carousel = document.getElementsByClassName('listing-carousel-images');
                console.log(carousel[0]);
                    for(var i=1; i< response.data.AdMedia.length; i++){
                    var newCarouselImage = document.createElement('div');
                    newCarouselImage.setAttribute("class", "item");
                    newCarouselImage.innerHTML = "<img src="+response.data.AdMedia[i].ImagePath+" alt='' style='width:100%;'>";
                    console.log(newCarouselImage);
                    
                    carousel[0].appendChild(newCarouselImage);
                };
                

                $('#mark-favourite').hide();
                $('#unmark-fav').hide();
                $('.hide-agent-info').hide();
                $('.display-agent-info').hide();

                response.data.FavouriteIds = [];
                response.data.FavouriteAds.forEach(function(ad){
                    response.data.FavouriteIds.push(ad.UserUserId)
                });

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
            });
        })

    };

});


// Javascript functions which are called by using onclick method

$("#logout").click(function(){
    logOutUser();
});

function loadAgents(){
    getAgentsList().then(function(data){
        console.log(data);
        //var userInfo = getUserInfo();
        var response = data;
        if(response.success){
            var agentList = response.data;
            $("#agentCard").loadTemplate('partials/_agentCard.html', agentList, { append: true, elemPerPage: 10 }); 
            //$('<div/>').loadTemplate('partials/_agentCard.html', agentList, { append: true, elemPerPage: 10 }).appendTo("#agentCard");           
        }
        else{
            $("#error-msg").text(response.message);
        }
    });
}

function setNavLinks(){
    var userInfo = getUserInfo();
    if(userInfo != null){
        $("#login-link").css("display","none");
        $("#signup-link").css("display","none");
        $("#profile-anchor").css("display","inline-block");
        $("#messages-link").css("display","inline-block");
        $("#logout-link").css("display","inline-block");
        $("#profile-anchor").html("<a href="+BASE_URL+"profile.html><i class='glyphicon glyphicon-user'> </i>"+userInfo.UserName+"</a>");
    }
    else{
        $("#login-link").css("display","inline-block");
        $("#signup-link").css("display","inline-block");
        $("#profile-link").css("display","none");
        $("#messages-link").css("display","none");
        $("#logout-link").css("display","none");
    }
}

function showToaster(data, flag){
    var toaster = document.getElementById("toaster");
    toaster.className = "show";
    if(flag == 'success')
    toaster.style.backgroundColor = "#28db93";
    document.getElementById("toaster").innerHTML = data;
    setTimeout(function(){
        toaster.className = toaster.className.replace("show", ""); 
    }, 3000);
}

function authenticateUser(){
    $("#error-msg").text("");
    var userName = $("#username").val();
    var password = $("#password").val();

    if(userName == "" || userName === undefined){
        $("#error-msg").text("Please enter username");
        return;
    }

    if(password == "" || password === undefined){
        $("#error-msg").text("Please enter password");
        return;
    }

    checkUser(userName, password).then(function(data){
        console.log(data);
        var response = data;
        if(response.success){
            localStorage.setItem('userInfo', JSON.stringify(response.data));

            window.location.href = BASE_URL;
        }
        else{
            $("#error-msg").text(response.message);
        }
    });
}

function signUpUser(){
    $("#error-msg").text("");

    var firstName = $("#firstname").val();
    var lastName = $("#lastname").val();
    var email = $("#email").val();
    var mobile = $("#mobilenumber").val();
    var userName = $("#username").val();
    var password = $("#password").val();
    var confirmPass = $("#confirm-password").val();

    if(firstName == "" || firstName === undefined){
        $("#error-msg").text("Please enter First Name");
        return;
    }

    if(lastName == "" || lastName === undefined){
        $("#error-msg").text("Please enter Last Name");
        return;
    }

    if(email == "" || email === undefined){
        $("#error-msg").text("Please enter Email");
        return;
    }

    if(mobile == "" || mobile === undefined){
        $("#error-msg").text("Please enter Mobile Number");
        return;
    }

    if(userName == "" || userName === undefined){
        $("#error-msg").text("Please enter username");
        return;
    }

    if(password == "" || password === undefined){
        $("#error-msg").text("Please enter password");
        return;
    }

    if(confirmPass == "" || confirmPass === undefined){
        $("#error-msg").text("Please enter Confirm Password");
        return;
    }

    registerUser(firstName,lastName,email,mobile, userName, password, confirmPass).then(function(data){
        console.log(data);
        var response = data;
        if(response.success){
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            showToaster('You have registered successfully', 'success');
            window.location.href = BASE_URL;
        }
        else{
            $("#error-msg").text(response.message);
        }
    });
}

function renderUserConversations(){
    var userInfo = getUserInfo();
    console.log('calling conversations');
    if(userInfo != null){
        getUserConversations(userInfo.UserId).then(function(data){
        console.log(data);
        var response = data;

        response.data.forEach(function(obj){
            obj.image = userInfo.UserId == obj.SenderID ? obj.ReceiverImage : obj.SenderImage;
            obj.Name = userInfo.UserId == obj.SenderID ? obj.ReceiverName : obj.SendererName;
            obj.UserId = userInfo.UserId == obj.SenderID ? obj.ReceiverID : obj.SenderID;
        });
        if(response.success){
            
            $("#conversation-container").loadTemplate($("#msg-template"), response.data, { append: true, elemPerPage: 10 });
        }
        else{
            $("#error-msg").text(response.message);
        }
    });
    }
}

function loadConversation(el){
    var conId = parseInt($(el).find("span.con-id").text());
    var userId = parseInt($(el).find("span.user-id").text());
    var senderName = $(el).find(".sender-name").text();
    $(".msg-list-heading").text(senderName);
    $("#msg-thread-container").empty();
    $("#txt-con-id").val(conId);
    $("#txt-user-id").val(userId);
    getMessagesByConId(conId).then(function(data){
        console.log(data);
        var userInfo = getUserInfo();
        var response = data;
        if(response.success){
            var msgs = response.data;
            msgs.forEach(function(msg){
                console.log(msg);
                var isReceiver = msg.ReceiverID == userInfo.UserId ? true : false;
                if(isReceiver){                    
                    $('<div/>').loadTemplate($("#msg-template-receiver"), msg, { append: true, elemPerPage: 10 }).appendTo("#msg-thread-container");
                }else{                    
                    $('<div/>').loadTemplate($("#msg-template-sender"), msg, { append: true, elemPerPage: 10 }).appendTo("#msg-thread-container");
                }   
            })            
        }
        else{
            $("#error-msg").text(response.message);
        }
        
        var chatDivHeight = document.getElementsByClassName("user-messages")[0].scrollHeight;
            $('.user-messages').animate({scrollTop:chatDivHeight}, 'slow');
        document.getElementsByClassName("input-message")[0].style.display = 'block';
            console.log(document.getElementsByClassName("input-message"));
    });
}

function postMessage(){    
    var userInfo = getUserInfo();
    $("#error-msg-message").text("");
    if(userInfo != null){
        var msgText = $("#text-msg").val();
        var senderId = userInfo.UserId;
        var receiverId = parseInt($("#txt-user-id").val());

        if(msgText == "" || msgText === undefined){
            $("#error-msg-message").text("Please enter message text");
            return;
        }

        //return;
        postMessageToUser(senderId, receiverId, msgText).then(function(data){
            console.log(data);
            var userInfo = getUserInfo();
            var response = data;
            if(response.success){
                var msg = {SenderImage : userInfo.UserImagePath , MessageText : msgText, MsgDate : "now"};
                $('<div/>').loadTemplate($("#msg-template-sender"), msg, { append: true, elemPerPage: 10 }).appendTo("#msg-thread-container");           
                var chatDivHeight = document.getElementsByClassName("user-messages")[0].scrollHeight;

            $('.user-messages').animate({scrollTop:chatDivHeight}, 'slow');
            }
            else{
                $("#error-msg-message").text(response.message);
            }
            $("#text-msg").val('');
        });    
    }
    
}

function sendMsgToAgent(){
    var userInfo = getUserInfo();
    if(userInfo != null){
        var msgText = $("#msg-text").val();
        var senderId = userInfo.UserId;
        var receiverId = parseInt($("#agent-title").attr("data"));

        postMessageToUser(senderId, receiverId, msgText).then(function(data){
            console.log(data);
            var userInfo = getUserInfo();
            var response = data;
            if(response.success){
                $("#msg-text").val("")
                showToaster('Message sent successfully', 'success');
                var chatDivHeight = document.getElementsByClassName("user-messages")[0].scrollHeight;
            $('.user-messages').animate({scrollTop:chatDivHeight}, 'slow');
            }
            else{
                $("#error-msg").text(response.message);
            }
        });    
    }
    
}

function markFavourite(markFavourite){
    // var listingId = getParameterValues("listing_id");
    var listingId = parseInt($("#listing-id").val());
    var userId = getUserInfo().UserId;

    markUnmarkListing(listingId, markFavourite, userId).then(function(data){
        console.log(data);
        var response = data;
        if(response.success){
            window.location.reload();
            showToaster('Listing marked successfully', 'success');
        }
        else{
            $("#error-msg").text(response.message);
        }
    });
}

function referListingToOther(){
    $("#error-msg-refer").text("");

    var name = $("#referrer-name").val();
    var toEmail = $("#email").val();
    var description = $("#description").val();
    var url = window.location.href;

    if(name == "" || name === undefined){
        $("#error-msg-refer").text("Please enter Name");
        return;
    }

    if(toEmail == "" || toEmail === undefined){
        $("#error-msg-refer").text("Please enter email");
        return;
    }

    referListing(name, toEmail, description, url).then(function(data){
        console.log(data);
        var response = data;
        if(response.success){
            $("#referrer-name").val("");
            $("#email").val("");
            $("#description").val("");
            showToaster('Listing referred successfully', 'success');
        }
        else{
            $("#error-msg-refer").text(response.message);
        }
    });
}


function updateProfile(){
    alert("Not implemented yet");
}



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
