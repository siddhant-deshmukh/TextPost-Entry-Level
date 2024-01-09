import axios from "axios"
import { useCallback, useState } from "react"
import { Loader } from "../Loader"
import { useDispatch } from "react-redux"
import { addNewPost } from "../../features/postSlice"

export default function Form({ setNewPostModal }: {
  setNewPostModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const defaultForm: IPostCreate = {
    title: "",
    tags: [],
    description: "",
  }
  const dispatch = useDispatch()
  const [newTag, setNewTag] = useState<string>("")
  const [loding, setLoding] = useState<boolean>(false)
  const [formContent, setFormContent] = useState<IPostCreate>(defaultForm)

  const createNewPost = useCallback(() => {
    if (!loding) {
      setLoding(true)
      axios.post(
        `${import.meta.env.VITE_API_URL}/p`,
        {
          ...formContent,
        },
        {
          withCredentials: true
        })
        .then(({ status, data }) => {
          if (status === 201) {
            dispatch(addNewPost({ newPost: data.post as IPost }))
            setFormContent(defaultForm)
            setNewPostModal(false)
          } else {
            console.error("While creating new post error occured")
          }
        }).catch((err) => {
          console.error("While creating new post error occured", err)
        }).finally(() => {
          setLoding(false)
        })

    }
  }, [loding, formContent])

  return (
    <div className="bg-white px-10 py-5 rounded-xl">
      <h1 className="text-2xl font-extrabold my-5">Write a new post</h1>
      <div className="flex flex-col space-y-9  w-96">
        <div className="flex flex-col">
          <label
            className="font-semibold my-1 text-gray-600"
            htmlFor="new-post-title" >
            Title
          </label>
          <textarea
            id="new-post-title"
            rows={2}
            className="p-3 border outline-none"
            placeholder="Write title of the post"
            onChange={(event) => {
              setFormContent((prev) => {
                return {
                  ...prev,
                  title: event.target.value
                }
              })
            }}
            maxLength={30} />
        </div>
        <div className="">
          <p
            className="font-semibold my-1 text-gray-600"
          >
            Tags:
          </p>
          <div className="flex flex-wrap items-center justify-start">
            {
              formContent.tags.map((tag) => {
                return <span className="mr-2 text-xs">{tag}</span>
              })
            }
            {
              formContent.tags.length < 5 &&
              <div className="flex border border-black bg-gray-900 text-xs">
                <input
                  value={newTag}
                  onChange={(event) => {
                    setNewTag(event.target.value)
                  }}
                  className="w-24 px-2" maxLength={10} />
                <button
                  onClick={() => {
                    setFormContent((prev) => {
                      return {
                        ...prev,
                        tags: prev.tags.slice().concat([newTag])
                      }
                    })
                    setNewTag("")
                  }}
                  className=" px-2 py-1 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 aspect-square">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            }
          </div>
        </div>
        <div className="flex flex-col">
          <label
            className="font-semibold my-1 text-gray-600"
            htmlFor="new-post-desc">
            Description
          </label>
          <textarea
            id="new-post-desc"
            rows={5}
            className="p-3 border outline-none"
            placeholder="Write description of the post"
            onChange={(event) => {
              setFormContent((prev) => {
                return {
                  ...prev,
                  description: event.target.value
                }
              })
            }}
            maxLength={200} />
        </div>
      </div>
      <div className="flex justify-between my-6 font-semibold">
        <button
          className="rounded-lg text-center w-44 py-2 border bg-gray-100 text-gray-800"
          onClick={() => {
            setNewPostModal(false)
            setFormContent(defaultForm)
          }}
        >Cancel</button>
        <button
          className="rounded-lg text-center flex justify-center items-center w-44 py-2 border bg-gray-900 text-white"
          onClick={() => {
            createNewPost()
          }}
        >
          {
            loding &&
            <Loader size={20} />
          }
          {
            !loding &&
            <span>Submit</span>
          }
        </button>
      </div>
    </div>
  )
}

export function NewPostFormModal({ setNewPostModal }: {
  setNewPostModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <div className="fixed z-50 w-full h-screen bg-black bg-opacity-35 flex items-center justify-center">
      <button
        onClick={() => {
          setNewPostModal(false)
        }}
        className="absolute top-5 right-5 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 aspect-square">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="">
        <Form setNewPostModal={setNewPostModal} />
      </div>
    </div>
  )
}

export function CreateNewPostBtn({ setNewPostModal }: {
  setNewPostModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <button
      onClick={() => {
        setNewPostModal(true)
      }}
      className="fixed z-40 bottom-10 right-10">
      <div className="w-20 aspect-square rounded-full bg-gray-800 text-white flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 aspect-square">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    </button>
  )
}