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


exports.getAllPosts = async () => {
  return await prisma.post.findMany();
};


exports.getPost = async (id) => {
  return await prisma.post.findUnique({
    where: {
      id
    }
  });
};


exports.updatePost = async (id, userId, data) => {

  const post = await prisma.post.findFirst({
    where: {
      id,
      authorId: userId
    }
  });

  if (!post) {
    return null;
  }

  return await prisma.post.update({
    where: {
      id: post.id
    },
    data
  });
};


exports.deletePost = async (id, userId) => {

  const post = await prisma.post.findFirst({
    where: {
      id,
      authorId: userId
    }
  });

  if (!post) {
    return null;
  }

  return await prisma.post.delete({
    where: {
      id: post.id
    }
  });
};