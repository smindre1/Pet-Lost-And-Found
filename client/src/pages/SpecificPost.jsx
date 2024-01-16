import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";

import { ADD_REPLY } from "../../utils/mutations";
import { GET_POST } from "../../utils/queries";

const SpecificPost = () => {
  const { postId } = useParams();
  const [mainPost, setMainPost] = useState(null);
  const { loading, data } = useQuery(GET_POST, {
    variables: { postId: postId },
  });
  const [petData, setPetData] = useState({
    type: "",
    name: "",
    img: "",
    lastSeen: "",
    species: "",
  });
  

//This will run every time the loading or data values change
  useEffect(() => {
    if (!loading && data) {
      setMainPost(data?.post || {});
      setPetData({
        type: data?.post.pet.type,
        name: data?.post.pet.name,
        img: data?.post.pet.img,
        lastSeen: data?.post.pet.lastSeen,
        species: data?.post.pet.species,
      })
    }
  }, [loading, data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-3">
      <h2>Pet's Name: {petData.name || "No name"}</h2>
      <h2>Location: {mainPost?.location || "none"}</h2>
      <p>Message: {mainPost?.message || "none"}</p>
      <p>Species/LastSeen/Status: {petData.species || "none"}, {petData.lastseen || "none"}, {petData.type || "none"}</p>
      {/* <img>{petData.img || "none"}</img> */}
    </div>
  );
};

const ReplyForm = ({ postId }) => {
  const [replyText, setReplyText] = useState("");
  const [addReply] = useMutation(ADD_REPLY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReply({
        variables: {
          postId: postId,
          message: replyText,
        },
        refetchQueries: [{ query: GET_POST, variables: { postId: postId } }],
      });
      setReplyText("");
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write your reply..." rows={4} cols={50} required />
      <button type="submit">Add Reply</button>
    </form>
  );
};

export default SpecificPost;
