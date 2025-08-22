import { toast } from 'react-toastify';

const messageHandler=(response,message)=>{
   
    if(message==="success")
    {

        toast.success(response);
    }
    if(message==="error")
    {

        toast.error(response);
    }

}
export default messageHandler;