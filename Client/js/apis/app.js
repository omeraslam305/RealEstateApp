// This value will be changed when we deploy it to server if we need
var API_ENDPOINT = 'http://localhost:3000/';

function checkUser(userName,password){
    var _data = { username : userName, password : password };
    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/login',
        method: 'POST',
        data: JSON.stringify(_data),
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();  
};



function registerUser(firstName,lastName,email,mobile, userName, password, confirmPass){
    var _data = { username : userName, password : password, fname : firstName, lname: lastName, email : email, phone : mobile, cpassword : confirmPass };
    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/signup',
        method: 'POST',
        data: JSON.stringify(_data),
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();
};


function getListings(searchVal, accomodationType, bedrooms, sqft, adType, pageIndex){

    var _data = { searchText : searchVal, typeOfAccomodation : accomodationType, noOfBedRooms: bedrooms, squareFeet : sqft, adType : adType, pageIndex : pageIndex  };

    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT + 'api/listings',
        method: 'POST',
        data: JSON.stringify(_data),
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();
};

function getUserListings(id, type){
    var _data = { userId : id, userType : type};

    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT + 'api/listings/user',
        method: 'POST',
        data: JSON.stringify(_data),
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();
}

function getListingDetails(id){
    console.log('details api called');

    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT + 'api/listing?listing_id=' + id,
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();
};

function changePassword(oldPass, newPass, cnewPass, userType, userId){

    var _data = { oldPassword : oldPass, newPassword : newPass, cpassword : cnewPass, userId : userId, usertype : userType};
    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/user/resetpassword',
        method: 'POST',
        data: JSON.stringify(_data),
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            console.log('response after password change',response);
            deferred.resolve(response);

        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();  
};

function updateUserDetails(fname, lname, email, mobile, address, userId){

    var _data = { fname : fname, lname : lname, email : email, mobile : mobile, address: address, userId : userId};
    var formData = new FormData();
    formData.append('userImage', $('input[type=file]')[0].files[0]);
    for ( var key in _data ) {
        formData.append(key, _data[key]);
    }

    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/user/update',
        method: 'POST',
        processData: false, // important
        contentType: false,
        data: formData,
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();  
};

function deleteAdListing(listingId){
    var _data = {Id:listingId};
    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/deleteListing',
        method: 'POST',
        data: JSON.stringify(_data),
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            
            deferred.resolve(response);

        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();  
};

function saveLisitng(data){
    console.log('data before api call',data);
    var formData = new FormData();
    var i = 0;
    for(i ; i < $('input[type=file]')[0].files.length; i++){
        formData.append("uploadedImages[]", $('input[type=file]')[0].files[i]);
    }
    data['totalImages'] = i;

    for ( var key in data ) {
        formData.append(key, data[key]);
    }

    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/listing/create',
        method: 'POST',
        processData: false, // important
        contentType: false,
        data: formData,//JSON.stringify(_data),
        enctype: 'multipart/form-data',
        success: function (response) {
            
            deferred.resolve(response);

        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();  
};

function saveEditedLisitng(data, listingId){
     var _data = data;
    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/updateListing',
        method: 'POST',
        data: JSON.stringify(_data),
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            
            deferred.resolve(response);

        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();  
};

function getUserConversations(userId){
    
    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/GetAllConversations?receiverID=' + userId,
        method: 'GET',
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();
};

function getMessagesByConId(conId){
    
    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/GetAllMessages?conversationID=' + conId,
        method: 'GET',
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();
};

function postMessageToUser(senderId, receiverId, msgTxt){
    var _data = { senderId : senderId, receiverId : receiverId, msgTxt : msgTxt};
    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/PostMessage',
        method: 'POST',
        data: JSON.stringify(_data),
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();
};

function getAgentsList(){
    
    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/GetAgentListing',
        method: 'GET',
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();
};

function markUnmarkListing(listingId, mark, userId){
    var _data = { AdID : listingId, Status : mark, UserID: userId };
    
    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/favoriteListing',
        method: 'POST',
        data: JSON.stringify(_data),
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();
}

function referListing(name, toEmail, description, url){
    var _data = { name : name, email : toEmail, subject: description, url: url };
    var deferred = new $.Deferred();
    $.ajax({
        url: API_ENDPOINT+'api/referListing',
        method: 'POST',
        data: JSON.stringify(_data),
        dataType: "json",
        contentType: 'application/json',
        success: function (response) {
            deferred.resolve(response);
        },
        error: function (response){
            deferred.reject(response);
        }
    });
    return deferred.promise();
}
