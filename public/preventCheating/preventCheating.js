// This is a jquery code,now developer can't copy the question
// to search on internet

// .hide is class of quiz questions
$('.hide').on('copy paste cut drag drop', function (e) {
    e.preventDefault();
});