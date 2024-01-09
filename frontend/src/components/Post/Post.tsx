import React from "react";
import { useDispatch } from "react-redux";
import { chooseAPost } from "../../features/postSlice";

export default React.memo(
  function Post({ post }: {
    post: IPost
  }) {
    const dispatch = useDispatch()
    const date = new Date(post.time)

    return (
      <div className="w-[500px] border-b mb-5">
        <div className="py-3">
          <div className="flex flex-wrap justify-start mt-2">
            {
              post.tags.map((tag, index) => {
                return <span key={index} className="mb-2 mr-2 px-2 text-xs text-gray-900 bg-gray-200 rounded-full">{tag}</span>
              })
            }
          </div>
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <div className="flex justify-end space-x-2 items-center text-xs">
            <div>{date.toDateString().slice(4)}</div>
            <div className="w-1 aspect-square rounded-full bg-gray-500"></div>
            <h3 className="text-right">by {post.author_name}</h3>
          </div>
          <p className="mt-3 text-gray-700">{post.description}</p>

          <div className="my-2 flex justify-end space-x-5 text-xs text-gray-900 font-medium">
            <button
              className="flex space-x-2 items-center rounded-lg px-2 py-1"
              onClick={() => {
                dispatch(chooseAPost({ post_id: post._id }))
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 aspect-square">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="">Add Comment</span>
            </button>
            <button
              className="flex space-x-2 items-center"
              onClick={() => {
                dispatch(chooseAPost({ post_id: post._id }))
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 aspect-square">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              <span>{post.num_comments}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
) 
