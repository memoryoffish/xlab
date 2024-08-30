"use client";
import { api } from "~/trpc/react";
import React, { useRef } from 'react';
import { useState,useEffect } from 'react';
import '~/styles/chatroom.css';
import { useSearchParams,useRouter } from 'next/navigation';
import { POST } from "../api/trpc/[trpc]/route";
interface RoomEntryProps//有待精进
{
    id:number;
    roomid:number;
}

interface RoomAddArgs{
    username:string;
    roomName:string;
}
interface RoomPreviewInfo{
  creator: string;
  id: number;
  LastPost: string | null;
  roomname: string ;
}
interface useragent{
    userid:number;
    username:string;
}

export interface Message{
    messageId:number;
    roomId:number;
    sender:string;
    content:string;
    time:number;
}
function ChatRoomList({setRoomid,setRoomname1,username}:{setRoomid:React.Dispatch<React.SetStateAction<number>>,setRoomname1:React.Dispatch<React.SetStateAction<string>>,username:string}){
  const roomList= api.room.getroomlist.useSuspenseQuery()[0];
  const [roomname, setRoomname] = useState('')
  const [flag,setflag]=useState(0)
  const router=useRouter();
  const handleRoomClick = (Id:number,Name:string):void=>{
      setRoomid(Id);
      setRoomname1(Name);
  }
  const deleteroomMutation = api.room.deleteroom.useMutation({
    onSuccess: () => {
      setflag(flag + 1);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const createroomMutation = api.room.createroom.useMutation({
    onSuccess: () => {
      console.log("添加成功");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  function deleteroom(Id: number) {
    deleteroomMutation.mutate({ id: Id });
  }

  function addroom() {
    if (roomname === '') return;
    createroomMutation.mutate({ username:"你好", roomName: roomname });
    setRoomname('');
  }
  const getback=()=>{
    router.back();
  }
  return(
  <div className='left'>
      <div className='title'>
          <span className='username'>
              <button id="changeusername" onClick={getback}>更改用户名</button>
              <div id='username'>{username},你好！</div>
          </span>
          <label htmlFor='chatroom-add'>
              <div className='addroom'>+</div>
          </label>
      </div>
      <input type='checkbox'id='chatroom-add' />
      <div className='chatroom-list-add'>
          <input type="text" placeholder="room name" id="roomname" value={roomname} onChange={(e)=>{setRoomname(e.target.value)}}/>
          <button className='add' onClick={()=>addroom()}>add</button>
      </div>
      <div className="chatroom-list-container">
      {roomList.map((room) => (
      <div className='roombutton'key={room.id}>    
          <button  className='room'onClick={() => handleRoomClick(room.id,room.roomname)}>
              <div id='justroomname'>{room.roomname}</div>
              <div className='lastmessage'> {room.LastPost ? room.LastPost : 'No messages'}</div>

          </button>
          <button className='roomdelete' onClick={()=>deleteroom(room.id)} >delete</button>
      </div>
      ))
   }
      </div>
  </div>
)

}
function ChatRoomContent({name,id,username}:{name:string,id:number,username:string}){
  // const socketRef = useRef<WebSocket | null>(null);
  // // useEffect(() => {
  //   const newSocket = new WebSocket("ws://localhost:3001");

  //   newSocket.onopen = () => {
  //     console.log("Connected to WebSocket server");
  //   };

  //   newSocket.onmessage = (event) => {
  //     console.log("前端Message from server ");
  //     try {
  //       console.log('success')
  //     } catch (error) {
  //       console.error("前端Failed to parse JSON: ", error);
  //     }
  //   };

  //   newSocket.onerror = (error) => {
  //     console.error("前端WebSocket error: ", error);
  //   };

  //   // 将 WebSocket 实例存入引用
  //   socketRef.current = newSocket;

  //   return () => {
  //     // 清理 WebSocket
  //     if (socketRef.current) {
  //       socketRef.current.close();
  //       // 清除所有事件监听器
  //       socketRef.current.onopen = null;
  //       socketRef.current.onmessage = null;
  //       socketRef.current.onerror = null;
  //     }
  //   };
  // }, [id]);
    const [message, setMessage] = useState('')
    const [messageList,setMessageList] = useState<Message[]>(api.post.getpost.useQuery({ id }).data)
    const { data: postData, isSuccess, refetch } = api.post.getpost.useQuery({ id });
    console.log('裂开了')
    const idRef = useRef(1); // 使用 useRef 来保存 id 的值
    useEffect(() => {
      // 在数据成功加载时更新状态
      if (isSuccess && postData && !isEqual(messageList, postData)) {
        setMessageList(postData);
      }
    }, [isSuccess, postData, messageList]);
  
    useEffect(() => {
      // 定时器用于定期更新 id
      let intervalId: NodeJS.Timeout;
      intervalId = setInterval(() => {
        // idRef.current++; // 更新 id 以触发新的查询
        refetch().catch(console.error); // 发起新的查询
      }, 5000); // 每 5 秒更新一次
  
      // 清理定时器
      return () => {
        clearInterval(intervalId);
        refetch().catch(console.error); // 确保在组件卸载时取消挂起的请求
      };
    }, [refetch]); // id 作为依赖项，确保每次 id 改变时都会重新运行 useEffect
  
    // 辅助函数用于比较两个数组是否相等
    function isEqual(a: Message[], b: Message[]): boolean {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }
  
    const mutation = api.post.createpost.useMutation({
    onSuccess: () => {
      console.log("发送成功");
      setMessage('');
    },
    onError: (err) => {
      console.log(err);
    },
  });
    const sendmessage = (message: string): void => {
        if(message==null||id==null||username==null){
          return; 
        }
        console.log('hello')
        mutation.mutate({ id:id, name: username, message:message });
      };
  return(
      <div >
          <div className='chatcontent-roomname'>{name}</div>
          <div className='messages'>
              
          { messageList?.map((message,key) => {
                  const date = new Date(message.time);
                  const isoString = date.toISOString();
                  const formatted = isoString.slice(0, 16).replace('T', ' '); // 移除"T"并替换为空格
                  // 输出类似 "2024-02-15 11:10"
                 return( 
                 <div className='message' key={key}>
                  <div className='sender-tou'>用户</div>
                  <div className='sender'>{message.sender}</div>
                  <div className='content'>{message.content}</div>
                  <div className='time'>{formatted}</div>
                 </div> 
              )})
          }
          </div>
          <div id="yourmessage">
              <input className="yourmes"type="text" placeholder="your message"value={message} onChange={(e) => setMessage(e.target.value)} />
              <button className="small" onClick={()=>sendmessage(message)}>send</button>
          </div>
      </div>
  )

}
export  function Ome() {
  const[roomid,setRoomid]=useState(-1);
  const[roomname,setRoomname]=useState('')
  const searchParams = useSearchParams();
  const username = searchParams.get('username'); // 获取查询参数中的 "username"
  return (
    <div className="ome-container">
            <div className="chatroom-container">
                <ChatRoomList setRoomid={setRoomid}setRoomname1={setRoomname}username={username} />
            </div>
            <div className="chatroom-content-container">
                <ChatRoomContent name={roomname} id={roomid} username={username}/>
            </div>

    </div>    
  );
}
