import { useState } from "react";
import CommentActions from "./CommentActions";
import { CommentCardItem } from "./CommentCardItem";

const CommentItem = ({
    id,
    cmt,
    userImage,
    socket,
    user,
    isShowReport,
    setIsShowReport,
}) => {
    const [moreReply, setMoreReply] = useState(false);
    const replies = cmt.reply;

    const countLike = (arg) => {
        let numberLikeEmotion = 0;
        arg.emotions?.forEach((em) => {
            if (em.type === "like") {
                numberLikeEmotion++;
            }
        });
        return numberLikeEmotion;
    };

    const checkActive = (comment, type) => {
        let result = false;
        if (user) {
            let userCurrentId = user._id;
            if (!comment.rating) {
                const check = comment.emotions?.find(
                    (item) =>
                        item.user.toString() === userCurrentId &&
                        comment.id === item.id &&
                        item.type === type &&
                        item.iden === "child"
                );
                if (check) {
                    result = true;
                } else {
                    result = false;
                }
            } else {
                const check = comment.emotions?.find(
                    (item) =>
                        item.user.toString() === userCurrentId &&
                        comment.id === item.id &&
                        item.type === type &&
                        !item.iden
                );
                if (check) {
                    result = true;
                } else {
                    result = false;
                }
            }
        }
        return result;
    };

    return (
        <>
            <div className="wrap--review__margin">
                <>
                    {/* <Rating
            {...{
              value: cmt.rating || 0,
              readOnly: true,
              precision: 0.5,
            }}
          /> */}
                    <CommentCardItem
                        comment={cmt}
                        cmt={cmt}
                        socket={socket}
                        bossId={user._id}
                        isShowReport={isShowReport}
                        setIsShowReport={setIsShowReport}
                    >
                        <CommentActions
                            socket={socket}
                            comment={cmt}
                            cmt={cmt}
                            id={id}
                            userImage={userImage}
                            user={user}
                            countLike={countLike(cmt)}
                            checkLikeActive={checkActive(cmt, "like")}
                            checkDislikeActive={checkActive(cmt, "dislike")}
                        />
                        <span
                            onClick={() => setMoreReply(!moreReply)}
                            className="custom--more__reply"
                        >
                            {replies.length > 0 ? (
                                !moreReply ? (
                                    <>
                                        <i className="fa-solid fa-caret-down"></i>{" "}
                                        Xem trả lời
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-caret-up"></i>{" "}
                                        Ẩn trả lời
                                    </>
                                )
                            ) : (
                                ""
                            )}
                        </span>
                        {replies &&
                            moreReply &&
                            replies.map((reply, i) => (
                                <CommentCardItem
                                    key={i}
                                    comment={reply}
                                    bossId={user._id}
                                    socket={socket}
                                    type="reply"
                                    cmt={cmt}
                                    isShowReport={isShowReport}
                                    setIsShowReport={setIsShowReport}
                                >
                                    <CommentActions
                                        isReply={true}
                                        nameReplyFor={reply.name}
                                        socket={socket}
                                        comment={reply}
                                        cmt={cmt}
                                        id={id}
                                        userImage={userImage}
                                        user={user}
                                        type="reply"
                                        countLike={countLike(reply)}
                                        checkLikeActive={checkActive(
                                            reply,
                                            "like"
                                        )}
                                        checkDisLikeActive={checkActive(
                                            reply,
                                            "dislike"
                                        )}
                                    />
                                </CommentCardItem>
                            ))}
                    </CommentCardItem>
                </>
            </div>
        </>
    );
};

export default CommentItem;
