import React ,{useState,useEffect, Children} from 'react';
import { useRouter } from 'next/router';

//internal import
import {CheckIfWalletConnected,connectWallet,connectingWithContract} from "../Utils/apiFeature";
export const ChatAppContext=React.createContext();
export const ChatAppProvider = ({children}) => {
    const [account,setAccount] = useState("");
    const [userName,setUserName] = useState("");
    const [friendLists,setFriendLists] = useState([]);
    const [friendMsg,setFriendMsg] = useState([]);
    const [loading,setLoading] = useState(false);
    const [userLists,setUserLists] = useState([]);
    const [error,setError] = useState("");

    //chat user 
    const [currentUserName, setCurrentUserName] =useState("");
    const [currentUserAddress, setCurrentUserAddress] = useState("");
    
    
    const router = useRouter();
    const fetchData= async()=>{
        try{
            //getcontract
            const contract=await connectingWithContract();
            const connectAccount=await connectWallet();
            setAccount(connectAccount);
            //get username
            const userName=await contract.getUsername(connectAccount);
            setUserName(userName);
            //get my friend list
            const friendLists=await contract.getMyFriendList();
            setFriendLists(friendLists);
            //get all app user lists
            const userLists= await contract.getAllAppUser();
            setUserLists(userList);
        }
        catch(error)
        {
            setError("Please install And Connect Your Wallet");
        }
    };
    //this effect
    useEffect(() => {
        fetchData();
    } ,[]);

    const readMessage = async(friendAddress) => {
        try{
            const contract= await connectingWithContract();
            const read=await contract.readMessage(friendAddress);
            setFriendMsg(read);
        }
        catch(error)
        {
            setError("Currently You have no Messages");
        }
    }
    const createAccount= async({name,accountAddress}) => {
        try{
            if(name || accountAddress) return setError("Name and address cannot be empty");
            const contract=await connectingWithContract();
            const getCreatedUser = await contract.createAccount(name);
            setLoading(true);
            await getCreatedUser.wait();
            setLoading(false);
            window.location.reload();
            
        }catch(error){
            setError("ERROR WHILE CREATING YOUR ACCOUNT ")
        }
    }
    //add your freind
    const addFriends = async({name,accountAddress})=>{
        try{
            if(name || accountAddress)  return setError("Please provide proper details");
            const contract=await connectingWithContract();
            const addMyFriend = await contract.addFriend(accountAddress, name);
            setLoading(true);
            await addMyFriend.wait();
            setLoading(false);
            router.push('/');
            window.location.reload();
        }catch(error)
        {
            setError("something went wrong while adding friends, try again after some time")
        }
    }
    const sendMessage = async({msg,address}) => {
        try{
            if(msg || address) return setError("Please Type your Message");
            const contract = await connectingWithContract();
            const addMessage = await contract.sendMessage(address ,msg);
            setLoading(true);
            await addMessage.wait();
            setLoading(false);
            window.location.reload();
        }catch(error){
            setError("Please reload and try again");
        }
    }
    const readUser = async(userAddress) => {
        const contract = await connectingWithContract();
        const userName=await contract.getUsername(userAddress);
        setCurrentUserName(userName);
        setCurrentUserAddress(userAddress);
    };
    return (
        //USESTATE
        <ChatAppContext.Provider value={{readMessage,createAccount,addFriends,sendMessage ,readUser,CheckIfWalletConnected,account,userName,friendLists,friendMsg,loading,userLists,error,currentUserName,currentUserAddress}}>
            {children}
        </ChatAppContext.Provider>
    );
}
