const {
  createPost: createPostService,
  getAllPosts: getAllPostsService,
  getPost: getPostService,
  updatePost: updatePostService,
  deletePost: deletePostService
} = require("../service/post.service");

const { ApiError } = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");


exports.createPost = asyncHandler(async (req, res) => {
  const post = await createPostService(req.body);

  return res.status(201).json({
    success: true,
    message: "Post created successfully",
    post
  });
});


exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await getAllPostsService();

  return res.status(200).json({
    success: true,
    message: "Posts retrieved successfully",
    posts
  });
});


exports.getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await getPostService(Number(id));

  if (!post) {
    throw new ApiError("Post not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Post retrieved successfully",
    post
  });
});


exports.updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedPost = await updatePostService(
    Number(id),
    req.user.id,
    req.body
  );

  if (!updatedPost) {
    throw new ApiError(
      "You are not allowed to modify this post",
      403
    );
  }

  return res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post: updatedPost
  });
});


exports.deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;


  const deletedPost = await deletePostService(
    Number(id),
    req.user.id
  );

  if (!deletedPost) {
    throw new ApiError(
      "You are not allowed to delete this post",
      403
    );
  }

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    post: deletedPost
  });
});