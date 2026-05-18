// SIGNUP

async function signup(){

  const email =
  document.getElementById("email").value;

  const password =
  document.getElementById("password").value;

  const { error } =
  await supabase.auth.signUp({
    email,
    password
  });

  if(error){

    alert(error.message);

  }else{

    alert("Signup Success");

  }

}

// LOGIN

async function login(){

  const email =
  document.getElementById("email").value;

  const password =
  document.getElementById("password").value;

  const { error } =
  await supabase.auth.signInWithPassword({
    email,
    password
  });

  if(error){

    alert(error.message);

  }else{

    document.getElementById("app")
    .style.display = "block";

    loadPosts();

  }

}

// CREATE POST

async function createPost(){

  const caption =
  document.getElementById("caption").value;

  const image =
  document.getElementById("image").files[0];

  let imageUrl = "";

  if(image){

    const fileName =
    Date.now() + image.name;

    await supabase.storage
    .from("posts")
    .upload(fileName,image);

    imageUrl =
    `${SUPABASE_URL}/storage/v1/object/public/posts/${fileName}`;

  }

  await supabase
  .from("posts")
  .insert([
    {
      caption,
      image:imageUrl,
      likes:0
    }
  ]);

  loadPosts();

}

// LOAD POSTS

async function loadPosts(){

  const { data } =
  await supabase
  .from("posts")
  .select("*")
  .order("id",{ascending:false});

  const posts =
  document.getElementById("posts");

  posts.innerHTML = "";

  data.forEach(post=>{

    posts.innerHTML += `

    <div class="post">

      ${
        post.image
        ?
        `<img src="${post.image}">`
        :
        ""
      }

      <h3>${post.caption}</h3>

      <button onclick="likePost(${post.id})">
        ❤️ ${post.likes}
      </button>

      <input
      id="comment-${post.id}"
      placeholder="Write comment">

      <button onclick="commentPost(${post.id})">
        💬 Comment
      </button>

    </div>

    `;

  });

}

// LIKE

async function likePost(id){

  const { data } =
  await supabase
  .from("posts")
  .select("*")
  .eq("id",id)
  .single();

  await supabase
  .from("posts")
  .update({
    likes:data.likes + 1
  })
  .eq("id",id);

  loadPosts();

}

// COMMENT

async function commentPost(id){

  const comment =
  document.getElementById(
    `comment-${id}`
  ).value;

  await supabase
  .from("comments")
  .insert([
    {
      post_id:id,
      text:comment
    }
  ]);

  alert("Comment Added");

}

// DARK MODE

document.getElementById("darkBtn")
.onclick = ()=>{

  document.body.classList.toggle("dark");

};
