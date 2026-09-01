
const prisma=require('../config/db')




exports.getPostWithAuthor = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return post;
};
exports.getUserWithPost = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    },

    select: {
      id: true,
      name: true,
      email: true,

      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true
        }
      }
    }
  });

  return user;
};

