function collapse(button, offMsg, onMsg, offCol="black", onCol="blue") {
	content = button.nextElementSibling;
	if (content.style.display == "block") {
		button.innerHTML = "<u>" + offMsg + "</u>";
		button.style.color = offCol;
    	content.style.display = "none";
	} else {
		button.innerHTML = "<u>" + onMsg + "</u>";
		button.style.color = onCol;
		content.style.display = "block";
	}
}