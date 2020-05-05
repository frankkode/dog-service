function sendMail(contactForm) {
    emailjs.send("frankmasabo_gmail_com", "dog_service", {
            "from_name": contactForm.name.value,
            "from_subject": contactForm.subject.value,
            "from_email": contactForm.emailaddress.value,
            "service_request": contactForm.servicesummary.value
        })
        .then(
            function (response) {
                console.log("SUCCESS", response);
            },
            function (error) {
                console.log("FAILED", error);
            }
        );
    return false; // To block from loading a new page
}