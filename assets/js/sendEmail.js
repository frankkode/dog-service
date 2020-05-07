function sendMail(contactForm) {
    emailjs.send("gmail", "doggy_services", {
            "from_name": contactForm.name.value,
            "from_subject": contactForm.subject.value,
            "from_email": contactForm.emailaddress.value,
            "from_content": contactForm.servicesummary.value
        })
        .then(
            function (response) {
                console.log("SUCCESS", response);
            },
            function (error) {
                console.log("FAILED", error);
            }
        );
    document.getElementById("myForm").reset(); //reset the form
    return false; // To block from loading a new page
}