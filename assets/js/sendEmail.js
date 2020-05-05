function sendMail(contactForm) {
    emailjs.send("gmail", "dog service", {
            "from_name": contactForm.name.value,
            "from_email": contactForm.emailaddress.value,
            "form_subject": contactForm.subject.value,
            "information_request": contactForm.informationsummary.value
        })
        .then(
            function (response) {
                console.log("SUCCESS", response);
                alert("Your message has been sent successfully");
                document.getElementById('id01').reset();
            },
            function (error) {
                console.log("FAILED", error);
                alert("Message was not sent");
                document.getElementById('id01').reset();
            }
        );
    return false; // To block from loading a new page
}
/* google email key */
(function () {
    emailjs.init("user_PfKdr4g0Xy587kbdqzLqb");
})();