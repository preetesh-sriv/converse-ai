import { useEffect, useRef, useState } from 'react';
import './newPrompt.css'
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from '../../lib/gemini'
import Markdown from 'react-markdown'
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewPrompt = ({data}) => {
const [question,setQuestion] = useState("")
const [answer,setAnswer] = useState("")

    const [img,setImg] = useState({
      isLoading:false,
      error:"",
      dbData:{},
      aiData:{}
    })
    
    const chat = model.startChat({
      history: [
        {
          role:'user',
          parts: [{text: 'Hello. I have 2 dogs in my house.'}],
          },
        {
          role: 'model',
          parts: [{text: 'Great to meet you. What would you like to know ?'}],
        },
      ],
      generationConfig: {
        // maxOutputTokens: 100,
      },
    });

    const endRef = useRef(null);
    const formRef = useRef(null);

useEffect(()=>{
    endRef.current.scrollIntoView({behaviour: 'smooth'});
  },[data,question,answer,img.dbData]);

  const queryClient = useQueryClient();


  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question:question.length ? question : undefined,
          answer,
          img: img.dbData?. filePath || undefined,
        })
      }).then((res) => res.json());
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["chat",data._id] }).then(()=>{
        formRef.current.reset()
        setQuestion("")
        setAnswer("")
        setImg({
          isLoading:false,
          error:"",
          dbData:{},
          aiData:{}
          // here may be we are handling that our chat and replies remain saved on reload
        })
      });
      // navigate(`/dashboard/chats/${id}`);
    },
    onError:(err)=>{
      console.log(err);
    },
  });

const add = async (text,isInitial)=>{
    if(!isInitial) setQuestion(text)  ;
    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData,text]:[text]
      );
      let accumulatedText = "";
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          console.log(chunkText);
          accumulatedText += chunkText;
          setAnswer(accumulatedText);
        }
      mutation.mutate();
    } catch (err) {
      console.log(err);
    }


};
/*
The img state in the NewPrompt component is reset at the end of the add function
The img state holds data about the currently uploaded image, including any AI data associated with that image. 
After the AI generates a response and the image (if any) has been processed, the state is reset to clear out this data. 
This prevents the previous image data from unintentionally being reused or displayed when the user submits a new question.
*/


      /*
    useRef Hook: Creates a persistent reference (endRef) to a DOM element, initialized with null.
    useEffect Hook: Runs a side effect after the component mounts, ensuring the effect only runs once.
    Scrolling Action: The scrollIntoView method is called on endRef.current, scrolling the referenced element into view.
    Smooth Scrolling: The behavior: 'smooth' option makes the scroll transition smooth rather than instantaneous.
    Use Case: Commonly used in chat applications to automatically scroll to the bottom, ensuring the latest message is visible.
  */

    const handleSubmit = async(e)=>{
      e.preventDefault()

      const text = e.target.text.value;
      if(!text){
        return;
      }
      add(text,false);
      
    }
    // in production we dont need it
    const hasRun = useRef(false)
    useEffect(()=>{
      if(!hasRun.current){
        if(data?.history?.length === 1){
          add(data.history[0].parts[0].text,true);
        }
      }
    hasRun.current = true;
    },[])
  return (
    <>
    {/* Add new chat  */}
    {img.isLoading && <div className=''>Loading...</div>}
    {img.dbData?.filePath && (
      <IKImage
      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
      path={img.dbData.filePath}
      width="380"
      transformation={[{width:380}]}
       />
    )}
      {question && <div className='message user'>{question}</div>}
      {answer && <div className='message '>
      <Markdown>{answer}</Markdown>
      </div>}
      <div className='endChat' ref={endRef}></div>
        <form className='newForm' onSubmit={handleSubmit} ref={formRef}>
          <Upload setImg={setImg}/>
            <input id='file' type='file' multiple={false} hidden />
            <input type='text' name='text' placeholder='Ask anything...'/>
            <button>
               <img src='/arrow.png' alt=''/>
            </button>
        </form>
    </>
  )
}

export default NewPrompt