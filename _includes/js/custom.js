$(document).ready( () => {
    var tags = document.getElementsByTagName("button");
    for (let tag of tags) {
        updateTagCounts(tag.dataset.tag);
    }
    let currentTag = "";
    const queryTag = getQuery().tag;

    if (queryTag) {
        filterByTagName(queryTag);
    } else {
        clear();
    }

    $("button").on("click", (e) => {
        currentTag = e.target.dataset.tag;
        if (currentTag != "clear"){
            filterByTagName(currentTag);
        } else {
            clear();
        }
    });
});

function updateTagCounts(tagName) {
    if (tagName == "clear"){
        return;
    }
    var counter = 0;
    $('.post-wrapper').each((index, elt) => {
        if (elt.hasAttribute(`data-${tagName}`)) {
            counter += 1;
        }
    });

    var updated = $(`.btn[data-tag=${tagName}]`).text() + " (" + counter + ")";
    console.log(updated);
    $(`.btn[data-tag=${tagName}]`).html(updated);
}

function getQuery() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {

        params[key] = value;
    });

    return params;
}

function filterByTagName(tagName) {
    var counter = 0;
    $('.hidden').removeClass('hidden');
    $('.post-wrapper').each((index, elt) => {
        if (!elt.hasAttribute(`data-${tagName}`)) {
            $(elt).addClass('hidden');
        } else {
            counter += 1;
        }
    });

    $(`.btn`).removeClass('selected');
    $(`.btn[data-tag=${tagName}]`).addClass('selected');
    $(".count").text(counter);
}

function clear() {
    $('.post-wrapper').addClass('hidden');
    $(`.btn`).removeClass('selected');
    $(`.btn[data-tag=clear]`).addClass('selected');
    $('.count').text("Tag unset");
}
