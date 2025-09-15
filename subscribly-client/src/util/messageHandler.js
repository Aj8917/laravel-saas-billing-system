import { toast } from 'react-toastify';

const messageHandler=(response,messageType)=>{
   
    switch (messageType) {
        case "success":
            toast.success(response);
            break;
        case "error":
            toast.error(response);
            break;
        default:
            toast.info(response); // fallback
    }
}
export default messageHandler;