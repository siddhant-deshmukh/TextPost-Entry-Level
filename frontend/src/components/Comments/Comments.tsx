import axios from "axios"
import { useCallback, useMemo, useState } from "react"
import { Loader } from "../Loader"

export default function Comments({ post_id }: {
  post_id: string
}) {
  const [loding, setLoding] = useState<boolean>(false)
  const [comments, setComments] = useState<IComment[]>([])
  const [newComment, setNewComment] = useState<string>("")

  useMemo(() => {
    setLoding(true)
    axios.get(`${import.meta.env.VITE_API_URL}/c/${post_id}`, { withCredentials: true })
      .then(({ data }) => {
        if (data.comments) {
          setComments(data.comments)
        }
      }).catch(() => {

      }).finally(() => {
        setLoding(false)
      })
  }, [post_id, setComments])

  const AddComment = useCallback(() => {
    setLoding(true)
    axios.post(
      `${import.meta.env.VITE_API_URL}/c/${post_id}`,
      {
        text: newComment
      },
      { withCredentials: true }
    ).then(({ data }) => {
      if (data.comment) {
        setComments((prev) => {
          return [data.comment].concat(prev.slice())
        })
        setNewComment("")
      } else {
        console.error("While posting the commment")
      }
    }).catch((err) => {
      console.error("While posting the commment", err)
    }).finally(() => {
      setLoding(false)
    })
  }, [newComment, setComments])

  return (
    <div className="w-full">
      <div className="flex px-2 space-x-2 items-end pb-4">
        <textarea
          className="w-full outline-none px-2 py-3 border"
          rows={2}
          onChange={(event) => {
            setNewComment(event.target.value)
          }}
        ></textarea>
        <button 
          className="px-2 py-3 rounded-md bg-gray-700 text-white font-semibold"
          onClick={()=>{ AddComment() }}
          >Add</button>
      </div>
      {
        loding && <div className="flex items-center my-2">
          <Loader size={30} />
        </div>
      }
      {
        comments.map((comment, index) => {
          return (
            <Comment key={comment._id + index.toString()} comment={comment} />
          )
        })
      }
    </div>
  )
}

function Comment({ comment }: { comment: IComment }) {
  const date = new Date(comment.time)
  return (
    <div className="w-[500px] border-b mb-5">
      <div className="py-3">
        <div className="flex justify-start space-x-2 items-center text-xs">
          <h3 className="text-right">by {comment.author_name}</h3>
          <div className="w-1 aspect-square rounded-full bg-gray-500"></div>
          <div>{date.toDateString().slice(4)}</div>
        </div>
        <p className="mt-3 text-gray-700">{comment.text}</p>
      </div>
    </div>
  )
}