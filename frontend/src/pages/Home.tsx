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
  const [searchField, setSearchField] = useState<string>("")
  const [searchFeedToggle, setSearchFeedToggle] = useState<boolean>(false)

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

        {/* Not in The post page with comments this means we are in home page */}
        {
          postChoosenId === null &&
          <>
            <SearchInPostTitleInput
              setSearchField={setSearchField}
              setSearchFeedToggle={setSearchFeedToggle}
            />
          </>
        }

        {/* Showing searched posts */}
        {
          postChoosenId === null && searchFeedToggle &&
          <SearchPostFeed search_string={searchField} setSearchFeedToggle={setSearchFeedToggle} />
        }

        {/* Not in post comment page and not showing earch feed */}
        {
          postChoosenId === null && !searchFeedToggle &&
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

function SearchInPostTitleInput({ setSearchField, setSearchFeedToggle }: {
  setSearchField: React.Dispatch<React.SetStateAction<string>>
  setSearchFeedToggle: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [inputStr, setInputStr] = useState<string>("")

  return (
    <div className="my-2 ">
      <div className="flex w-full border-2 border-gray-400">
        <input
          onChange={(event) => {
            setInputStr(event.target.value)
          }}
          className="px-2 py-3 w-full outline-none" placeholder="Enter text to search among titles (only)" />
        <button
          onClick={() => {
            if (inputStr) {
              setSearchField(inputStr)
              setSearchFeedToggle(true)
            }
          }}
          className="text-center px-3 bg-gray-800 text-white">
          Search
        </button>
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
      <Comments post_id={post._id} />
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
      <span className="text-xs font-bold">Showing all posts. {feed.length} Found</span>
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

function SearchPostFeed({ search_string, setSearchFeedToggle }: {
  search_string: string
  setSearchFeedToggle: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [loading, setLoding] = useState<boolean>(false)
  const [postList, setPostList] = useState<IPost[]>([])

  useMemo(() => {
    if (search_string !== "") {
      setLoding(true)
      axios.get(`${import.meta.env.VITE_API_URL}/p/s?search=${search_string}`, { withCredentials: true })
        .then(({ data }) => {
          if (data.posts) {
            setPostList(data.posts)
          } else {
            console.error("While getting posts for searched query")
          }
        }).catch((err) => {
          console.error("While getting posts for searched query", err)
        }).finally(() => {
          setLoding(false)
        })
    }
  }, [setLoding, search_string, setPostList])

  return (
    <>
      <button
        className="text-right my-2 hover:underline text-sm font-bold"
        onClick={() => {
          setSearchFeedToggle(false)
        }}>
        Show all posts
      </button>
      <span className="text-xs font-bold">Showing posts containing string {search_string} in their title. {postList.length} found</span>
      <div>
        {
          postList.map((post, index) => {
            return <Post key={post._id + index.toString()} post={post} />
          })
        }
      </div>
      {
        loading &&
        <Loader size={50} />
      }
    </>
  )
}