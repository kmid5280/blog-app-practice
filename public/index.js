let blogPost = ''


function getBlogPosts() {
    console.log('running getblogposts')
    $.ajax({
        //url: 
        method: "GET",
        dataType: "json"
    })
    .done(function(data) {
        console.log(data)
        postData = data;
        $('main').append(
            renderPosts(data)
        )
    })
    console.log('ran getblogposts')
}

function renderPosts(posts) {
    $('main').html('')
    for (i=0; i<posts.length; i++) {
        const postTitle = posts[i].title
        const postContent = posts[i].content
        const postDate = posts[i].date
        const itemId = posts[i]._id
    
        $('main').prepend(`
            <div>
            <p>Title: ${postTitle}</p>
            <p>Date: ${postDate}</p>
            <p>Entry: ${postContent}</p>
            </div>
        `)
    }
}

function watchForPost() {

}

getBlogPosts()