import React, {useRef, useState} from "react";

const CommentActions = ({socket, id, userImage, user, comment, cmt, nameReplyFor, isReply, type, countLike, checkLikeActive,checkDisLikeActive}) => {
  const [reply, setReply] = useState('')
  const replyRef = useRef();
  const replyWrapRef = useRef();

  const toggleReply = () => {
    replyWrapRef.current.classList.add("show");
    if(isReply) {
      replyRef.current.value = nameReplyFor + " "
    }
    replyRef.current.focus();
  };

  const hideReply = () => {
    replyWrapRef.current.classList.remove("show");
  };

  const handleReply = () => {
    const createdAt = new Date().toISOString();
    const send = "replyComment";
    if (socket) {
      socket.emit("createComment", {
        createdAt,
        user: user._id,
        productId: id,
        send,
        userCommentMain: cmt.user,
        comment: reply,
        name: user.name,
      });
    }
    setReply("");
    replyWrapRef.current.classList.remove("show");
  };

  const handleEmotion = (emotion) => {
    const uuid = (type ==='reply') ? comment.id : ''
    if(socket) {
      socket.emit("updateComment", {
        user: cmt._id,
        bossId: user._id,
        emotion,
        productId: id,
        type,
        uid: uuid,
      }) 
    }
  }


  return (
    <>
      <div className="wrap--action">
        <p>
          <i className={`fa-solid fa-thumbs-up ${checkLikeActive ? "active": "noActive"}`} onClick={() => {handleEmotion("like")}}></i>
           <span className="like--action">{countLike === 0 ? "" : countLike}</span>
        </p>
        <i className={`fa-solid fa-thumbs-down ${checkDisLikeActive ? "active": "noActive"}`} onClick={() => {handleEmotion("dislike")}}></i>
        <span className="reply" onClick={() => toggleReply()}>
          Trả lời
        </span>
      </div>
      <div ref={replyWrapRef} className="wrap--reply" style={{width: "100%"}}>
        <div className="wrap--reply-input">
          <img src={userImage} alt="avt" />
          <input
            ref={replyRef}
            type="text"
            placeholder="Thêm trả lời..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
        </div>
        <div className="wrap--reply-button">
          <button className="btn" onClick={hideReply}>
            CANCEL
          </button>
          <button className="btn" onClick={handleReply}>
            REPLY
          </button>
        </div>
      </div>
    </>
  );
};

export default CommentActions;
