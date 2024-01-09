import { useDispatch, useSelector } from "react-redux";
import { SideNavBar } from "../components/NavBar";
import { RootState } from "../app/store";
import { Loader } from "../components/Loader";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { chooseAPost, loadPostFeedFailed, loadPostFeedSuccess, startingToLoadPostFeed } from "../features/postSlice";
import axios from "axios";
import Post from "../components/Post/Post";
import { CreateNewPostBtn, NewPostFormModal } from "../components/Post/Form";
import Comments from "../components/Comments/Comments";

export default function Home() {

  const [newPostModal, setNewPostModal] = useState<boolean>(false)
  const { feed, postChoosenId } = useSelector((state: RootState) => state.postFeed)

  const choosenPost = useMemo(() => {
    if (postChoosenId === null) {
      return null
    }
    const post = feed.find((post) => post._id === postChoosenId)
    if (!post) return null;
    return post
  }, [postChoosenId, feed])

  // useEffect(() => {
  //   loadNewPosts({ skip: 0, limit: 10 })
  // }, [])
  // useMemo(() => {


  return (
    <div className="flex w-full justify-center overflow-y-auto">
      <SideNavBar />
      < CreateNewPostBtn setNewPostModal={setNewPostModal} />
      {
        newPostModal &&
        <NewPostFormModal setNewPostModal={setNewPostModal} />
      }
      <div className="flex flex-col border-x px-10">
        {
          postChoosenId === null &&
          <PostFeed feed={feed} />
        }
        {
          postChoosenId != null &&
          <PostWithComments post={choosenPost} />
        }
      </div>
    </div>
  )
}

function PostWithComments({ post }: { post: IPost | null }) {
  const dispatch = useDispatch()

  const [comments, setComments] = useState<IComment[]>([]) 
  if (!post) {
    return <div></div>
  }
  return (
    <>
      <div className="flex justify-start space-x-4 items-center w-full py-3 border-y">
        <button
          onClick={() => {
            dispatch(chooseAPost({ post_id: null }))
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <span className="text-xl font-semibold">Home</span>
      </div>
      <Post post={post} />
      <Comments post_id={post._id}/>
    </>
  )
}


function PostFeed({ feed }: {
  feed: IPost[],
}) {
  const { loading, isFinished } = useSelector((state: RootState) => state.postFeed)
  const dispatch = useDispatch()
  const currentlyLoading = useRef<boolean>(false)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const feedLength = feed.length

  useEffect(() => {
    // loadNewPosts({ skip: 0, limit: 10 })
    let options = {
      threshold: 1.0,
    };

    // console.log(feedLength)
    let observer = new IntersectionObserver((entries) => {
      console.log("Feed length", feedLength, feed.length)
      if (entries[0].isIntersecting) {
        // console.log("HERE!")
        loadNewPosts({
          skip: feedLength,
          limit: 10
        })
      }
    }, options);
    loadNewPosts({
      skip: feedLength,
      limit: 10
    })
    // if (loaderRef.current) {
    //   observer.observe(loaderRef.current)
    // }
  }, [feedLength])

  const loadNewPosts = useCallback(({
    skip,
    limit
  }: { skip: number, limit: number }) => {
    // console.log("Feed length", feed, feed.length)

    if (currentlyLoading.current || loading || isFinished) {
      return
    } else {
      console.log("Fetching --------------------------", skip, limit)
      currentlyLoading.current = true
      dispatch(startingToLoadPostFeed())
      axios.get(`${import.meta.env.VITE_API_URL}/p?skip=${skip}&limit=${limit}`, { withCredentials: true })
        .then(({ status, data }) => {
          if (status === 200 && data.posts) {
            dispatch(loadPostFeedSuccess({ newPosts: data.posts as IPost[], msg: null }))
          } else {
            dispatch(loadPostFeedFailed({ errorMsg: "Error while loding the post feed" }))
          }
        })
        .catch((err) => {
          console.error("While fetching feed", err)
          dispatch(loadPostFeedFailed({ errorMsg: "Error while loding the post feed" }))
        })
        .finally(() => {
          currentlyLoading.current = false
        })
    }
  }, [loading])

  return (
    <>
      <div>
        {
          feed.map((post, index) => {
            return <Post key={post._id + index.toString()} post={post} />
          })
        }
      </div>
      <div ref={loaderRef} className="my-3 min-h-24">
        {
          !isFinished && loading &&
          <Loader size={50} />
        }
        <div></div>
      </div>
    </>
  )
}