
const prisma = require("../config/db");


exports.createPost = async (data) => {
  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId
    }
  });

  return post;
};
exports.getAllPosts=async()=>{
    const posts=await prisma.post.findMany()
    return posts
}

exports.getPost=async(id)=>{
    const post=await prisma.post.findUnique({
        where:{
            id
        }
    })
    return post
}

exports.upadatePost=async(data,id)=>{
   

    const updatedPost=await prisma.post.update({
        where:{
            id
        },
        data
    })
    return updatedPost
}

exports.deletePost=async(id)=>{
    const deletedPost=await prisma.post.delete(id)
    return deletedPost
}