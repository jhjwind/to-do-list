var todo = {};

todo.txtNew = $('#txtNew');
todo.list = $("#lists");
todo.oldEntry = ''; // storage of old entry
todo.options = "<div class='ud'><a class='update'>Update</a><a class='delete'>Delete</a></div>";
todo.form = "<form id='updateTextForm' action='' onsubmit='return false;'><input id='updateTextInput' type='text'/></form>";

// View
todo.deleteView = function (item){
	// remove the entry
	$(item).remove();
	// if the list has nothing, update info
	if($(todo.list).children().length == 0){
		todo.updateInfo("Weeee! Nothing on the list!");
	};
	// hide the massive weapon when there is only one entry
	if($(todo.list).children().length == 1){
		$('#massiveWeapon').css('display', 'none');
	};
}

todo.addView = function (res){
	// set text area as null;
	$('input').attr('value','');
	// de-focus the text area
	$('input').blur();
	// add new entry to the top of the list
	$("<li/>",{"id": res.id, "text": res.content}).prependTo(todo.list);
	// Extend the width if msg is too long
	if(res.content.length >= 35){
		$('#'+res.id).css("height","50px");
	}
	// if the list has more than two entries, grants the permission to use massive weapon/delete all
	if($(todo.list).children().length >= 2){
		$('#massiveWeapon').css('display', 'block');
	};
}

// Render to-do list view
todo.getView = function (res){
	// if the list has more than two entries, grants the permission to use massive weapon/delete all
	if(res.length >= 2){
		$('#massiveWeapon').css('display', 'block');
	}
	// update the list view
	for (var i=0; i< res.length; i++){
		$("<li/>", {"id": res[i].id, "text": res[i].content}).appendTo(todo.list);
		// Extend the width if msg is too long
		if(res[i].content.length >= 35){
			$('#'+res[i].id).css("height","50px");
		}
	}
}

todo.updateView = function (id, content){
	var newLiElement = $('#'+id);
	// update the entry 
	var newElement = $("<li/>", {"id": id, "text": content});
	// remove the text area
	$("#updateTextForm").parent().replaceWith(newElement);
	// enable option view
	$(newLiElement).removeClass("activeIsDisabled");
	// Extend the width if msg is too long
	if(content.length >= 35){
		$(newLiElement).css("height","50px");
	}
}

todo.deleteAllView = function (){
	// remove every entry in the window
	$(todo.list).children().remove();
	// hide the massive weapon
	$('#massiveWeapon').css('display', 'none');
	// update happy info 
	todo.updateInfo("Weeee! Nothing on the list!");
}

todo.formView = function (id){
	// replace the old entry with form
	$(todo.form).hide().appendTo('#'+id).slideDown().css("text-decoration","none");
	// Remove the options view and disable adding options view
	$("#updateTextForm").parent().removeClass("active").addClass("activeIsDisabled");
	// set focus on text area
	$('#updateTextForm input').focus();
}

todo.formCancellView = function (e){
	// enable option view
	$(e).parent().removeClass("activeIsDisabled");
	// remove the form
	$(e).remove();
}

// Update Information Area on the top right of the window
todo.updateInfo = function (text){
	$("#info").html(text).fadeIn("slow");
	// Wait 1.5s to fade out the information
	setTimeout(function(){
	$('#info').fadeOut('slow');
	}, 2000);
}

// Handlers / Model

// Handler for mouse enter and leave an entry
$('li:not(.activeIsDisabled)').live('mouseover mouseleave', function(event){
	if (event.type == 'mouseover'){
		todo.addOptions($(this));
	}
	else{
		todo.removeOptions($(this));
	}
});

// Handler for click event of the delete button
$(".delete").live("click", function(){
	var item = $(this).parent().parent();
	todo.removeList(item);
});

// Handler for click event of the update button
$(".update").live("click", function(){
	var item = $(this).parent().parent();
	var id = $(item).attr('id');
	// keep the old entry in case user cancells the update 
	todo.oldEntry = item;
	// remove the delete and update div
	$(item).children().filter("div").remove();
	// Update the view--- add form
	todo.formView(id);
	// bind the submit event to form
	todo.bindSubmitEvent(id);
});

// Hander for blur event and keydown event of the textbox.
// Old entry will be restored when textbox loses focus or ESC is pressed
/*
$("#updateTextForm").live('keydown', function(e){
	if (e.keyCode == 27){
		console.log("The error message below might be a bug of jQuery");
		$(this).replaceWith(todo.oldEntry);
	}
});
*/
$("#updateTextForm").live('blur', function(){
	todo.formCancellView(this);
});

// Hander for focus event for  both textboxs
$('#mainTextInput').focus(function(){
	$(this).css("color", "#000000");
	$(this).css("text-align", "left");
	$(this).css("font-size", "22px");
	if($(this).attr("value") == " I have to ...."){
		$(this).attr("value", "");
	}
});

// Handler for keypress event of the main textbox
// when key is pressed, clear button shows up
$('#mainTextInput').keypress(function(){
	$('#clearButton').css('display', 'block');
});

// Handler for click event of the clear button
$("#clearButton").live("click",function(){
	$('#mainTextInput').attr("value","");
	$('#clearButton').css('display', 'none');
});

// Handler for submit event of the main textbox 
$("#mainTextForm").live("submit", function(){
	// trim off the white space and empty line
	var content = $(this).children().filter("#mainTextInput").attr("value");
	var text = $.trim(content);
	// do not add if text is null
	if (text == ''){
		todo.updateInfo("It's an empty entry");
	}
	else if ( text.length > 58){
		todo.updateInfo("message's too long");
	}
	else{
		todo.updateInfo("Adding....");
		todo.addList(text);
		content = null;
	}
});

// Handler for submit event of the new update textbox
todo.bindSubmitEvent = function(itemId){
	$("#updateTextForm").live("submit", function(){
		// trim off the white space and empty line
		var content = $(this).children().filter("#updateTextInput").attr("value");
		var newContent = $.trim(content);
		// do not add if text is null
		if (newContent == ''){
			todo.updateInfo("It's an empty entry");
		}
		else if (newContent.length > 58){
			todo.updateInfo("message's too long");
		}
		else{
			todo.updateInfo("Updating....");
			todo.updateList(itemId,newContent);
		}
	});
}

// Handler for massiveWeapon/ DeleteAll
$('#massiveWeapon').bind('click', function(){
	if (confirm("Are you sure to delete everything?")){
		todo.removeAllList();
	}
});

// add the "Delete" and "Update" options to an entry 
todo.addOptions = function(item){
	$(item).addClass("active");
	if($(item).children().hasClass("ud") == false){
		$(item).append(todo.options);
	}
};

//remove the "Delete" and "Update" options to an entry
todo.removeOptions = function(item){
	$(item).removeClass("active");
	if($(item).children().hasClass("ud")){
		$(item).children(".ud").remove();
	}
};

// Four methods for to-do lists
// "op" stand for the five operations of the database:
// Get the list, update the list, add an entry to the list, delete an entry from the list and delete all
todo.getList = function (){
	$.ajax({
		url: 'server.php',
		method: 'GET',
		data: 'op=getList',
		dataType: "json", // response as json
		error: function(res){
			todo.updateInfo("Failed to get the list");
		},
		success: function(res){
			if (res.length == 0){
				todo.updateInfo("Weeee! Nothing on the list!");
			}
			else if (res.length >= 10){
				todo.updateInfo("Crap! Swamped!");
			}
			else{
				// nothing for now
			};
			
			todo.getView(res);			
		}
	});
};

todo.addList = function (text){
	$.ajax({
		url: 'server.php',
		method: 'GET',
		data: 'op=addList&content='+text,
		dataType: "json", // response as json
		error: function(res){
			todo.updateInfo("Failed to add new entry");
		},
		success: function(res){
			todo.updateInfo("New Entry added");
			todo.addView(res);
		}
	});
}

todo.updateList = function (id, newContent){
	$.ajax({
		url: 'server.php',
		method: 'GET',
		data: 'op=updateList&id='+id+"&content="+newContent,
		error: function(){
			todo.updateInfo("Failed to update new entry");
		},
		success: function() {
			todo.updateInfo("Entry updated");
			todo.updateView(id, newContent);
		}
	});
}

todo.removeList = function (item){
	var itemId = $(item).attr('id');
	$.ajax({
		url: 'server.php',
		method: 'GET',
		data: 'op=removeList&id='+itemId ,
		error: function(){
			todo.updateInfo("Failed to delete new entry");
		},
		success: function() {
			todo.updateInfo("Entry deleted");			
			todo.deleteView(item);
		}
	});
}

todo.removeAllList = function (){
	$.ajax({
		url: 'server.php',
		method: 'GET',
		data: 'op=removeAllList' ,
		error: function(){
			todo.updateInfo("Failed to delete all the entries");
		},
		success: function() {
			todo.updateInfo("Weeee! Nothing on the list!");			
			todo.deleteAllView();
		}
	});
}

$(document).ready(function(){
	// fetch list from database
	todo.getList();
});